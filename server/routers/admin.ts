import { z } from "zod";
import { Role, ScheduleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import nodemailer from "nodemailer";

import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { render } from "@react-email/components";
import PlanCancelledNotification from "@/emails/plan-cancelled-notification";

export const adminRouter = router({
  getUsers: adminProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      }),
    )
    .mutation(async (opts) => {
      const { from, to } = opts.input;

      const users = await prisma.user.findMany({
        where: {
          role: {
            not: Role.ADMIN,
          },
          createdAt: {
            gte: from,
            lte: to,
          },
        },
        include: {
          subscription: {
            include: {
              coupon: true,
            },
          },
        },
      });

      return { users };
    }),
  getPeriodStatistics: adminProcedure
    .input(
      z.object({
        from: z.string().min(1, "Data de início é obrigatório"),
        to: z.string().min(1, "Data de término é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { from, to } = opts.input;

      const startDateFormatted = format(
        parse(from, "yyyy-MM-dd", new Date(), { locale: ptBR }),
        "yyyy-MM-dd",
      );
      const endDateFormatted = format(
        parse(to, "yyyy-MM-dd", new Date(), { locale: ptBR }),
        "yyyy-MM-dd",
      );

      const schedules = await prisma.schedule.findMany({
        where: {
          date: {
            gte: startDateFormatted,
            lte: endDateFormatted,
          },
        },
        include: {
          service: true,
        },
      });

      const schedulesFiltered = schedules.filter(
        (schedule) => schedule.status === ScheduleStatus.confirmed,
      );

      const totalEarned = schedulesFiltered.reduce((total, obj) => {
        return total + obj.service.price;
      }, 0);
      const clientsConfirmed = schedules.filter(
        (schedule) => schedule.status === ScheduleStatus.confirmed,
      ).length;
      const clientsCancelled = schedules.filter(
        (schedule) => schedule.status === ScheduleStatus.cancelled,
      ).length;
      const schedulesCount = schedules.length;

      return {
        totalEarned,
        clientsConfirmed,
        clientsCancelled,
        schedulesCount,
      };
    }),
  changeEmail: adminProcedure
    .input(
      z
        .object({
          actualEmail: z
            .string()
            .email("E-mail inválido")
            .min(1, "E-mail atual é obrigatório"),
          newEmail: z
            .string()
            .email("E-mail inválido")
            .min(1, "Novo e-mail é obrigatório"),
          password: z.string().min(1, "Senha é obrigatória"),
        })
        .superRefine(({ actualEmail, newEmail }, ctx) => {
          if (newEmail === actualEmail) {
            ctx.addIssue({
              code: "custom",
              message: "Os e-mails não podem ser iguais",
              path: ["newEmail"],
            });
          }
        }),
    )
    .mutation(async (opts) => {
      const { actualEmail, newEmail, password } = opts.input;
      const { email } = opts.ctx.admin;

      if (actualEmail !== email) {
        return {
          error: true,
          message: "E-mail ou senha inválidos",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email: actualEmail,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      if (!user.confirmationPassword) {
        return {
          error: true,
          message: "Crie uma senha de confirmação para alterar a senha",
        };
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.confirmationPassword!,
      );

      if (!isPasswordCorrect) {
        return {
          error: true,
          message: "E-mail ou Senha inválidos",
        };
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: newEmail,
        },
      });

      return {
        error: false,
        message: "E-mail atualizado com sucesso, realize o login novamente",
      };
    }),
  createConfirmationPassword: adminProcedure
    .input(
      z
        .object({
          confirmationPassword: z
            .string()
            .min(1, "Senha de confirmação é obrigatória"),
          confirmConfirmationPassword: z
            .string()
            .min(1, "Confirmar senha de confirmação é obrigatória"),
        })
        .superRefine(
          ({ confirmationPassword, confirmConfirmationPassword }, ctx) => {
            if (confirmConfirmationPassword !== confirmationPassword) {
              ctx.addIssue({
                code: "custom",
                message: "As senhas não coincidem, verifique e tente novamente",
                path: ["confirmConfirmationPassword"],
              });
            }
          },
        ),
    )
    .mutation(async (opts) => {
      const { confirmationPassword } = opts.input;
      const { id } = opts.ctx.admin;

      const salt = await bcrypt.genSalt(10);
      const confirmationPasswordHash = await bcrypt.hash(
        confirmationPassword,
        salt,
      );

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          confirmationPassword: confirmationPasswordHash,
        },
      });

      return { message: "Senha de confirmação criada com sucesso" };
    }),
  changeConfirmationPassword: adminProcedure
    .input(
      z
        .object({
          actualConfirmationPassword: z
            .string()
            .min(1, "Atual senha de confirmação obrigatória"),
          newConfirmationPassword: z
            .string()
            .min(1, "Nova senha de confirmação obrigatória"),
          confirmConfirmationPassword: z
            .string()
            .min(1, "Confirma senha de confirmação obrigatória"),
        })
        .superRefine(
          (
            {
              actualConfirmationPassword,
              newConfirmationPassword,
              confirmConfirmationPassword,
            },
            ctx,
          ) => {
            if (actualConfirmationPassword === newConfirmationPassword) {
              ctx.addIssue({
                code: "custom",
                message:
                  "As senhas são iguais, insira uma senha diferente para alterar",
                path: ["newConfirmationPassword"],
              });
            }

            if (confirmConfirmationPassword !== newConfirmationPassword) {
              ctx.addIssue({
                code: "custom",
                message: "As senhas não coincidem, verifique e tente novamente",
                path: ["confirmConfirmationPassword"],
              });
            }
          },
        ),
    )
    .mutation(async (opts) => {
      const { actualConfirmationPassword, newConfirmationPassword } =
        opts.input;
      const { id } = opts.ctx.admin;

      const admin = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!admin) {
        return { error: true, message: "Usuário não encontrado" };
      }

      const isPasswordCorrect = await bcrypt.compare(
        actualConfirmationPassword,
        admin.confirmationPassword!,
      );

      if (!isPasswordCorrect) {
        return { error: true, message: "Senha inválida" };
      }

      const salt = await bcrypt.genSalt(10);
      const confirmationPasswordHash = await bcrypt.hash(
        newConfirmationPassword,
        salt,
      );

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          confirmationPassword: confirmationPasswordHash,
        },
      });

      return {
        error: false,
        message: "Senha de confirmação atualizada com sucesso",
      };
    }),
  getCoupons: adminProcedure.query(async () => {
    const coupons = await prisma.coupon.findMany();

    return { coupons };
  }),
  createCoupon: adminProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Nome do cupom é obrigatório")
          .min(4, "O nome precisa ter no mínimo 4 caracteres"),
        percentage: z.coerce
          .number()
          .gte(0, "Valor precisa ser maior ou igual à zero")
          .lte(100, "Valor precisa ser menor ou igual á cem"),
        monthly: z.enum(["once", "forever"], { message: "Valor inválido" }),
      }),
    )
    .mutation(async (opts) => {
      const { name, percentage, monthly } = opts.input;

      const newCoupon = await stripe.coupons.create({
        duration: monthly,
        name,
        percent_off: percentage,
      });

      await prisma.coupon.create({
        data: {
          stripeCouponId: newCoupon.id,
          duration: monthly,
          name,
          percentage,
        },
      });

      return { message: "Cupom criado com sucesso!" };
    }),
  deleteCoupon: adminProcedure
    .input(
      z.object({
        couponId: z.string().min(1, "ID do cupom é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { couponId } = opts.input;

      await stripe.coupons.del(couponId);

      await prisma.coupon.delete({
        where: {
          stripeCouponId: couponId,
        },
      });

      return { message: "Cupom deletado com sucesso" };
    }),
  addDiscount: adminProcedure
    .input(
      z.object({
        subscriptionId: z.string().min(1, "ID da assinatura é obrigatória"),
        couponId: z.string().min(1, "ID do cupom é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { subscriptionId, couponId } = opts.input;

      const coupon = await prisma.coupon.findUnique({
        where: {
          stripeCouponId: couponId,
        },
      });

      if (!coupon) {
        return {
          error: true,
          message: "Cupom não encontrado",
        };
      }

      await stripe.subscriptions.update(subscriptionId, {
        discounts: [{ coupon: couponId }],
      });

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        data: {
          coupon: {
            connect: {
              id: coupon.id,
            },
          },
        },
      });

      return {
        error: false,
        message: "Desconto aplicado com sucesso",
      };
    }),
  getSubscriptionCoupon: adminProcedure
    .input(
      z.object({
        subscriptionId: z.string().min(1, "ID da assinatura é obrigatória"),
      }),
    )
    .query(async (opts) => {
      const { subscriptionId } = opts.input;

      const subscription = await prisma.subscription.findUnique({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        include: {
          coupon: true,
        },
      });

      if (!subscription || !subscription.coupon) {
        return {
          couponId: "",
        };
      }

      return {
        couponId: subscription.coupon.stripeCouponId,
      };
    }),
  removeDiscount: adminProcedure
    .input(
      z.object({
        stripeSubscriptionId: z
          .string()
          .min(1, "ID da assinatura da Stripe é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { stripeSubscriptionId } = opts.input;

      await stripe.subscriptions.deleteDiscount(stripeSubscriptionId);

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId,
        },
        data: {
          couponId: null,
        },
      });

      return {
        message: "Desconto removido com sucesso",
      };
    }),
  cancelPlan: adminProcedure
    .input(
      z.object({
        stripeSubscriptionId: z
          .string()
          .min(1, "ID da assinatura da Stripe é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { stripeSubscriptionId } = opts.input;

      const devEmailUser = process.env.EMAIL_DEV_USER!;
      const devEmailPass = process.env.EMAIL_DEV_PASS!;
      const emailUser = process.env.EMAIL_USER!;
      const emailPass = process.env.EMAIL_PASS!;
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.BASE_URL_DEV!
          : process.env.BASE_URL!;
      const devConfig = {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: devEmailUser,
          pass: devEmailPass,
        },
      };
      const prodConfig = {
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      };

      const subscription = await stripe.subscriptions.retrieve(
        stripeSubscriptionId! as string,
      );
      const prodId = subscription.items.data[0].price.product;
      const product = await stripe.products.retrieve(prodId as string);
      const userSub = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId,
        },
        include: {
          user: true,
        },
      });

      if (!userSub) {
        return new Response("Usuário não encontrado", { status: 404 });
      }

      await prisma.subscription.delete({
        where: {
          stripeSubscriptionId,
        },
      });
      await prisma.user.update({
        where: {
          id: userSub.user.id,
        },
        data: {
          planId: null,
        },
      });

      const emailHtml = await render(
        PlanCancelledNotification({
          productName: product.name,
          url: `${baseUrl}/dashboard/conta/plano`,
          cancelDate: format(new Date(subscription.canceled_at!), "dd/MM/yyyy"),
        }),
      );

      const options = {
        from: '"Zuro" suporte.zuro@gmail.com',
        to: userSub!.user.email!,
        subject: "Seu Plano Foi Encerrado - Zuro",
        html: emailHtml,
      };

      if (process.env.NODE_ENV === "development") {
        const transporter = nodemailer.createTransport(devConfig);

        await transporter.sendMail(options);
      } else {
        const transporter = nodemailer.createTransport(prodConfig);

        await transporter.sendMail(options);
      }

      return {
        message: "Plano cancelado com sucesso",
      };
    }),
});
