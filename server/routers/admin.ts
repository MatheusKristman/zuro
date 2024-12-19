import { z } from "zod";
import { Role, ScheduleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

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
          subscription: true,
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
    const coupons = await stripe.coupons.list();

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

      await stripe.coupons.create({
        duration: monthly,
        name,
        percent_off: percentage,
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

      return { message: "Cupom deletado com sucesso" };
    }),
  addDiscount: adminProcedure
    .input(
      z.object({
        subscriptionId: z.string().min(1, "ID da assinatura é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { subscriptionId } = opts.input;

      // const subscriptionId
    }),
});
