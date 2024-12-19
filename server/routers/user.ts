import { z } from "zod";
import bcrypt from "bcryptjs";
import { google } from "googleapis";
import { ptBR } from "date-fns/locale";
import { TRPCError } from "@trpc/server";
import { format, isAfter, parse } from "date-fns";
import { generate } from "generate-password";
import { ScheduleStatus } from "@prisma/client";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import RecoverPasswordEmail from "@/emails/recover-password-email";
import ClientScheduleCancelNotification from "@/emails/client-schedule-cancel-notification";
import ProfessionalScheduleCancelNotification from "@/emails/professional-schedule-cancel-notification";
import ConfirmationCodeNotification from "@/emails/confirmation-code-notification";

import { isUserAuthedProcedure, publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const userRouter = router({
  getUser: isUserAuthedProcedure.query(async (opts) => {
    const { user } = opts.ctx.user;
    const email = user?.email;

    if (!email) {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Usuário não encontrado",
      });
    }

    const userSelected = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        availability: {
          include: {
            availableTimes: true,
          },
        },
        services: true,
      },
    });

    if (!userSelected) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Usuário não encontrado",
      });
    }

    return { user: userSelected };
  }),
  register: publicProcedure
    .input(
      z.object({
        name: z
          .string({
            required_error: "Nome é obrigatório",
            invalid_type_error: "O valor enviado para nome é invalido",
          })
          .min(1, "Nome é obrigatório")
          .min(4, "Nome precisa ter no mínimo 4 caracteres"),
        email: z
          .string({
            required_error: "E-mail é obrigatório",
            invalid_type_error: "O valor enviado para e-mail é invalido",
          })
          .min(1, "E-mail é obrigatório")
          .email("E-mail inválido"),
        checkoutId: z
          .string({
            required_error: "ID do checkout é obrigatório",
            invalid_type_error:
              "O valor enviado para o ID do checkout é inválido",
          })
          .min(1, "ID do checkout é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { email, name, checkoutId } = input;

      const accountExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (accountExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Conta já cadastrada, utilize outro e-mail",
        });
      }

      const plan = await prisma.plan.findFirst();

      if (!plan) {
        return new Response("Plano não encontrado", { status: 404 });
      }

      const generatedPassword = generate({
        length: 10,
        numbers: true,
      });

      const salt = await bcrypt.genSalt(10);
      const pwHash = await bcrypt.hash(generatedPassword, salt);

      // TODO: enviar no e-mail a senha para o usuário
      console.log({ generatedPassword });

      const checkoutResult =
        await stripe.checkout.sessions.retrieve(checkoutId);

      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password: pwHash,
          plan: {
            connect: {
              id: plan.id,
            },
          },
        },
      });

      if (!checkoutResult.subscription) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ID da assinatura não encontrado",
        });
      }

      await prisma.subscription.create({
        data: {
          stripeSubscriptionId: checkoutResult.subscription as string,
          plan: {
            connect: {
              id: plan.id,
            },
          },
          user: {
            connect: {
              id: createdUser.id,
            },
          },
        },
      });

      return { message: "Cadastro realizado com sucesso!" };
    }),
  newPassword: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID é obrigatório"),
        password: z
          .string({
            required_error: "Este campo é obrigatória",
            invalid_type_error: "O valor enviado para este campo é invalido",
          })
          .min(1, "Este campo é obrigatório")
          .min(6, { message: "Este campo precisa ter no mínimo 6 caracteres" }),
        passwordConfirm: z
          .string({
            required_error: "Este campo é obrigatória",
            invalid_type_error: "O valor enviado para este campo é invalido",
          })
          .min(1, "Este campo é obrigatório")
          .min(6, { message: "Este campo precisa ter no mínimo 6 caracteres" }),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { id, password } = input;

      const salt = await bcrypt.genSalt(10);
      const pwHash = await bcrypt.hash(password, salt);

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: pwHash,
          emailVerified: new Date(),
        },
      });

      return { message: "Senha atualizada com sucesso" };
    }),
  submitPaymentPreference: isUserAuthedProcedure
    .input(
      z
        .object({
          paymentPreference: z.enum(
            ["", "before_after", "before", "after", "no_payment"],
            {
              message: "Dados inválidos",
            },
          ),
          pixKey: z.string(),
        })
        .superRefine(({ paymentPreference, pixKey }, ctx) => {
          if (
            (!paymentPreference ||
              paymentPreference === "before_after" ||
              paymentPreference === "before") &&
            !pixKey
          ) {
            ctx.addIssue({
              code: "custom",
              message: "Dados inválidos",
              path: ["pixKey"],
            });
          }
        }),
    )
    .mutation(async (opts) => {
      const { paymentPreference, pixKey } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!paymentPreference) {
        return {
          error: true,
          message: "Dados inválidos, verifique e tente novamente",
        };
      }

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      if (user.firstConfigurationStep === 0) {
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            firstConfigurationStep: 1,
            paymentPreference,
            pixKey,
          },
        });

        return {
          error: false,
          message: "Dados salvos com sucesso",
        };
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          paymentPreference,
          pixKey,
        },
      });

      return {
        error: false,
        message: "Dados salvos com sucesso",
      };
    }),
  submitAvailability: isUserAuthedProcedure
    .input(
      z.object({
        dayOff: z
          .enum([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ])
          .array(),
        availability: z
          .object({
            dayOfWeek: z.enum([
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ]),
            availableTimes: z
              .object({
                startTime: z.string(),
                endTime: z.string(),
              })
              .array()
              .refine(
                (times) => {
                  const sortedTimes = [...times].sort(
                    (a, b) =>
                      parseInt(a.startTime.replace(":", ""), 10) -
                      parseInt(b.startTime.replace(":", ""), 10),
                  );

                  for (let i = 0; i < sortedTimes.length - 1; i++) {
                    const currentEndTime = parseInt(
                      sortedTimes[i].endTime.replace(":", ""),
                      10,
                    );
                    const nextStartTime = parseInt(
                      sortedTimes[i + 1].startTime.replace(":", ""),
                      10,
                    );

                    if (currentEndTime > nextStartTime) {
                      return false;
                    }
                  }

                  return true;
                },
                {
                  message: "Os horários estão sobrepostos.",
                },
              ),
          })
          .array()
          .min(7, "Dados inválidos, precisa receber o dados de todos os dias"),
      }),
    )
    .mutation(async (opts) => {
      const { availability, dayOff } = opts.input;
      const { email } = opts.ctx.user.user;

      console.log(dayOff);

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          availability: true,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const availabilityFiltered = availability
        .filter((item) => !dayOff.includes(item.dayOfWeek))
        .map((item) => ({ ...item, userId: user.id }));

      if (user.firstConfigurationStep === 1) {
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            firstConfigurationStep: 2,
            dayOff,
          },
        });

        if (user.availability.length > 0) {
          const availabilityDeletePromise = user.availability.map((obj) =>
            prisma.availability.delete({
              where: {
                id: obj.id,
              },
            }),
          );

          await Promise.all(availabilityDeletePromise);
        }

        async function CreateAvailabilities() {
          for (const day of availabilityFiltered) {
            await prisma.availability.create({
              data: {
                userId: day.userId,
                dayOfWeek: day.dayOfWeek,
                availableTimes: {
                  create: day.availableTimes.map((time) => ({
                    startTime: time.startTime,
                    endTime: time.endTime,
                  })),
                },
              },
            });
          }
        }

        CreateAvailabilities().catch((err) => {
          console.error(err);

          return {
            error: true,
            message:
              "Ocorreu um erro ao registrar as disponibilidades do usuário",
          };
        });

        return {
          error: false,
          message: "Dados salvos com sucesso",
        };
      }

      if (user.availability.length > 0) {
        const availabilityDeletePromise = user.availability.map((obj) =>
          prisma.availability.delete({
            where: {
              id: obj.id,
            },
          }),
        );

        await Promise.all(availabilityDeletePromise);
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          dayOff,
        },
      });

      async function CreateAvailabilities() {
        for (const day of availabilityFiltered) {
          await prisma.availability.create({
            data: {
              userId: day.userId,
              dayOfWeek: day.dayOfWeek,
              availableTimes: {
                create: day.availableTimes.map((time) => ({
                  startTime: time.startTime,
                  endTime: time.endTime,
                })),
              },
            },
          });
        }
      }

      CreateAvailabilities().catch((err) => {
        console.error(err);

        return {
          error: true,
          message:
            "Ocorreu um erro ao registrar as disponibilidades do usuário",
        };
      });

      return {
        error: false,
        message: "Dados salvos com sucesso",
      };
    }),
  submitServices: isUserAuthedProcedure
    .input(
      z.object({
        services: z
          .array(
            z.object({
              name: z.string().min(1, "Nome é obrigatório"),
              minutes: z.number().gt(0, "Minutos inválidos"),
              price: z.number().gt(0, "Valor inválido"),
            }),
          )
          .min(1, "É preciso ter ao menos um serviço registrado"),
      }),
    )
    .mutation(async (opts) => {
      const { services } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          services: true,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const servicesFiltered = services.map((service) => ({
        ...service,
        userId: user.id,
      }));

      if (user.firstConfigurationStep === 2) {
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            firstConfigurationStep: 3,
            firstAccess: true,
          },
        });

        if (user.services.length > 0) {
          const servicesDeletePromise = user.services.map((obj) =>
            prisma.service.delete({
              where: {
                id: obj.id,
              },
            }),
          );

          await Promise.all(servicesDeletePromise);
        }

        await prisma.service.createMany({
          data: servicesFiltered,
        });

        return {
          error: false,
          message: "Dados salvos com sucesso",
        };
      }

      if (user.services.length > 0) {
        const servicesDeletePromise = user.services.map((obj) =>
          prisma.service.delete({
            where: {
              id: obj.id,
            },
          }),
        );

        await Promise.all(servicesDeletePromise);
      }

      await prisma.service.createMany({
        data: servicesFiltered,
      });

      return {
        error: false,
        message: "Dados salvos com sucesso",
      };
    }),
  submitChangePassword: isUserAuthedProcedure
    .input(
      z
        .object({
          password: z.string().min(1, "Senha é obrigatória"),
          newPassword: z
            .string()
            .min(1, "Nova Senha é obrigatória")
            .min(6, "Nova Senha precisa ter no mínimo 6 caracteres"),
          confirmNewPassword: z
            .string()
            .min(1, "Confirmar Senha é obrigatória"),
        })
        .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
          if (confirmNewPassword !== newPassword) {
            ctx.addIssue({
              code: "custom",
              message:
                "A confirmação da senha precisa ser igual a senha criada",
              path: ["confirmNewPassword"],
            });
          }
        }),
    )
    .mutation(async (opts) => {
      const { password, newPassword } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password!);

      if (!isPasswordCorrect) {
        return {
          error: true,
          message: "Senha incorreta, verifique e tente novamente",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const pwHash = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: pwHash,
        },
      });

      return {
        error: false,
        message: "Senha atualizada com sucesso",
      };
    }),
  updateName: isUserAuthedProcedure
    .input(
      z.object({
        newName: z.string().min(1, "Novo nome é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { newName } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          name: newName,
        },
      });

      return {
        error: false,
        message: "Nome atualizado com sucesso",
      };
    }),
  sendConfirmationCodeToMail: isUserAuthedProcedure
    .input(
      z.object({
        newEmail: z
          .string()
          .email("E-mail inválido")
          .min(1, "E-mail é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { newEmail } = opts.input;
      const { email } = opts.ctx.user.user;
      const devEmailUser = process.env.EMAIL_DEV_USER!;
      const devEmailPass = process.env.EMAIL_DEV_PASS!;
      const emailUser = process.env.EMAIL_USER!;
      const emailPass = process.env.EMAIL_PASS!;
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

      if (!email) {
        return {
          error: true,
          message: "E-mail não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const generateAlphanumericCode = (length: number = 6): string => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let result = "";

        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
      };

      const code = generateAlphanumericCode();

      await prisma.resetCode.create({
        data: {
          userId: user.id,
          code,
          newEmail,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      const emailHtml = await render(
        ConfirmationCodeNotification({
          code,
          name: user.name!,
        }),
      );

      const options = {
        from: '"Zuro" suporte.zuro@gmail.com',
        to: newEmail,
        subject: "Código de Confirmação para Alteração do E-mail - Zuro",
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
        error: false,
        message: "Código enviado no e-mail cadastrado",
      };
    }),
  confirmChangeEmailCode: isUserAuthedProcedure
    .input(
      z.object({
        code: z.string().min(1, "Código obrigatório").min(6, "Código inválido"),
      }),
    )
    .mutation(async (opts) => {
      const { code } = opts.input;

      const resetCode = await prisma.resetCode.findFirst({
        where: {
          code,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!resetCode) {
        return {
          error: true,
          message: "Código inválido ou expirado",
        };
      }

      await prisma.user.update({
        where: {
          id: resetCode.userId,
        },
        data: {
          email: resetCode.newEmail,
        },
      });

      await prisma.resetCode.delete({
        where: {
          id: resetCode.id,
        },
      });

      return {
        error: false,
        message: "E-mail atualizado com sucesso",
      };
    }),
  getSchedulesByDate: isUserAuthedProcedure
    .input(
      z.object({
        date: z.string().min(1, "Data é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { date } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          schedules: [],
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          schedules: [],
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const schedules = await prisma.schedule.findMany({
        where: {
          userId: user.id,
          date,
        },
        orderBy: {
          time: "asc",
        },
        include: {
          service: true,
        },
      });

      return { schedules, error: false, message: "" };
    }),
  cancelSchedule: isUserAuthedProcedure
    .input(
      z.object({
        scheduleId: z.string().min(1, "ID do agendamento é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { scheduleId } = opts.input;
      const devEmailUser = process.env.EMAIL_DEV_USER!;
      const devEmailPass = process.env.EMAIL_DEV_PASS!;
      const emailUser = process.env.EMAIL_USER!;
      const emailPass = process.env.EMAIL_PASS!;
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
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      };

      const schedule = await prisma.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          status: ScheduleStatus.cancelled,
        },
        include: {
          user: true,
          service: true,
        },
      });

      if (schedule.googleEventId) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_CLIENT_SECRET!,
          "http://localhost:3000",
        );

        oauth2Client.setCredentials({
          refresh_token: schedule.user.googleRefreshToken,
        });

        const calendar = google.calendar("v3");

        await calendar.events.delete({
          auth: oauth2Client,
          calendarId: "primary",
          eventId: schedule.googleEventId,
        });
      }

      const [year, month, day] = schedule.date.split("-").map(Number);
      const formattedDate = format(
        new Date(year, month - 1, day),
        "dd/MM/yyyy",
      );

      const professionalEmailHtml = await render(
        ProfessionalScheduleCancelNotification({
          service: schedule.service.name,
          date: formattedDate,
          name: schedule.user.name!,
          clientName: schedule.fullName,
          time: schedule.time,
        }),
      );
      const clientEmailHtml = await render(
        ClientScheduleCancelNotification({
          service: schedule.service.name,
          date: formattedDate,
          professionalName: schedule.user.name!,
          name: schedule.fullName,
          time: schedule.time,
        }),
      );

      const professionalOptions = {
        from: '"Zuro" suporte.zuro@gmail.com',
        to: schedule.user.email!,
        subject: `Confirmação de Cancelamento do Agendamento - Zuro`,
        html: professionalEmailHtml,
      };
      const clientOptions = {
        from: '"Zuro" suporte.zuro@gmail.com',
        to: schedule.email,
        subject: `Agendamento Cancelado - Zuro`,
        html: clientEmailHtml,
      };

      if (process.env.NODE_ENV === "development") {
        const transporter = nodemailer.createTransport(devConfig);

        await transporter.sendMail(professionalOptions);
        await transporter.sendMail(clientOptions);
      } else {
        const transporter = nodemailer.createTransport(prodConfig);

        await transporter.sendMail(professionalOptions);
        await transporter.sendMail(clientOptions);
      }

      return { message: "Agendamento cancelado" };
    }),
  getPeriodStatistics: isUserAuthedProcedure
    .input(
      z.object({
        from: z.string().min(1, "Data de início é obrigatório"),
        to: z.string().min(1, "Data de término é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { from, to } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          schedules: [],
          totalEarned: 0,
          clientsAttended: 0,
          mostFrequentService: "",
          mostFrequentDate: "",
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          schedules: [],
          totalEarned: 0,
          clientsAttended: 0,
          mostFrequentService: "",
          mostFrequentDate: "",
          error: true,
          message: "Usuário não encontrado",
        };
      }

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
          userId: user.id,
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

      const clientsAttended = schedulesFiltered.length;
      const totalEarned = schedulesFiltered.reduce((total, obj) => {
        return total + obj.service.price;
      }, 0);
      const serviceCount = schedulesFiltered.reduce(
        (acc: Record<string, number>, obj) => {
          const serviceName = obj.service.name;

          acc[serviceName] = (acc[serviceName] || 0) + 1;

          return acc;
        },
        {} as Record<string, number>,
      );
      const datesCount = schedulesFiltered.reduce(
        (acc: Record<string, number>, obj) => {
          acc[obj.date] = (acc[obj.date] || 0) + 1;

          return acc;
        },
        {},
      );
      const mostFrequentService = Object.entries(serviceCount).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["", 0] as [string, number],
      );
      const mostFrequentDate = Object.entries(datesCount).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["", 0] as [string, number],
      );

      return {
        schedules: schedulesFiltered,
        totalEarned,
        clientsAttended,
        mostFrequentService: mostFrequentService[0],
        mostFrequentDate: mostFrequentDate[0],
        error: false,
        message: "",
      };
    }),
  getPlanDetails: isUserAuthedProcedure.query(async (opts) => {
    const { email } = opts.ctx.user.user;

    if (!email) {
      return {
        error: true,
        message: "Usuário não encontrado",
        plan: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return {
        error: true,
        message: "Usuário não encontrado",
        plan: null,
      };
    }

    if (!user.subscription) {
      return {
        error: true,
        message: "Plano inativo",
        plan: null,
      };
    }

    const plan = await stripe.products.retrieve(
      user.subscription.plan.productId,
    );
    const price = await stripe.prices.retrieve(user.subscription.plan.priceId);
    const subscription = await stripe.subscriptions.retrieve(
      user.subscription.stripeSubscriptionId,
    );
    const hiredDate = format(
      new Date(user.subscription.createdAt),
      "dd/MM/yyyy",
    );
    const nextPayment = format(
      new Date(subscription.current_period_end * 1000),
      "dd/MM/yyyy",
    );

    return {
      error: false,
      message: "",
      plan: {
        name: plan.name,
        price: price.unit_amount as number,
        hiredDate,
        nextPayment,
        subscriptionId: user.subscription.stripeSubscriptionId,
      },
    };
  }),
  cancelPlan: isUserAuthedProcedure
    .input(
      z.object({
        subscriptionId: z.string().min(1, "ID da assinatura é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { subscriptionId } = opts.input;

      await stripe.subscriptions.cancel(subscriptionId);

      return { message: "Plano cancelado com sucesso" };
    }),
  reactivatePlan: isUserAuthedProcedure
    .input(
      z.object({
        checkoutId: z.string().min(1, "ID do checkout é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { checkoutId } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      const plan = await prisma.plan.findFirst();

      if (!plan) {
        return {
          error: true,
          message: "Plano não encontrado",
        };
      }

      const checkoutResult =
        await stripe.checkout.sessions.retrieve(checkoutId);

      if (!checkoutResult.subscription) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ID da assinatura não encontrado",
        });
      }

      await prisma.subscription.create({
        data: {
          stripeSubscriptionId: checkoutResult.subscription as string,
          plan: {
            connect: {
              id: plan.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return { error: false, message: "Plano reativado com sucesso" };
    }),
  getVacationMode: isUserAuthedProcedure.query(async (opts) => {
    const { email } = opts.ctx.user.user;

    if (!email) {
      return {
        error: true,
        message: "Usuário não encontrado",
        vacationMode: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "Usuário não encontrado",
        vacationMode: null,
      };
    }

    return {
      error: false,
      message: "",
      vacationMode: user.vacationMode,
    };
  }),
  handleVacationMode: isUserAuthedProcedure
    .input(
      z.object({
        vacationMode: z.boolean({
          invalid_type_error: "Valor inválido",
          required_error: "Valor do modo férias é obrigatório",
          message: "Valor inválido",
        }),
      }),
    )
    .mutation(async (opts) => {
      const { vacationMode } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "Usuário não encontrado",
          vacationMode: null,
        };
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          vacationMode,
        },
      });

      return {
        error: false,
        message: `Modo férias ${vacationMode ? "ativado" : "desativado"} com sucesso`,
      };
    }),
  getGoogleClientToken: isUserAuthedProcedure.query(async (opts) => {
    const { email } = opts.ctx.user.user;

    if (!email) {
      return {
        error: true,
        message: "E-mail não encontrado",
        clientId: "",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "Usuário não encontrado",
        clientId: "",
      };
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    return {
      error: false,
      message: "",
      clientId,
      refreshToken: user.googleRefreshToken,
    };
  }),
  generateGoogleToken: isUserAuthedProcedure
    .input(
      z.object({
        code: z.string().min(1, "Código é obrigatória"),
      }),
    )
    .mutation(async (opts) => {
      const { code } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "E-mail não encontrado",
        };
      }

      // TODO: verificar redirectURL para o domínio do site
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        "http://localhost:3000",
      );

      const token = await oauth2Client.getToken(code);

      if (!token.tokens.refresh_token) {
        return {
          error: true,
          message: "Erro ao gerar o token",
        };
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          googleRefreshToken: token.tokens.refresh_token,
        },
      });

      return {
        error: false,
        message: "Conta vinculada com sucesso",
      };
    }),
  unbindGoogleToken: isUserAuthedProcedure.mutation(async (opts) => {
    const { email } = opts.ctx.user.user;

    if (!email) {
      return {
        error: true,
        message: "E-mail não encontrado",
      };
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        googleRefreshToken: "",
      },
    });

    return {
      error: false,
      message: "Conta desvinculada com sucesso",
    };
  }),
  recoverPassword: publicProcedure
    .input(
      z.object({
        recoverEmail: z
          .string({
            required_error: "E-mail de recuperação é obrigatório",
            invalid_type_error:
              "O valor enviado para e-mail de recuperação é invalido",
          })
          .min(1, "E-mail de recuperação é obrigatório")
          .email("E-mail de recuperação inválido"),
      }),
    )
    .mutation(async (opts) => {
      const { recoverEmail } = opts.input;
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

      const user = await prisma.user.update({
        where: {
          email: recoverEmail,
        },
        data: {
          passwordRecoverExpire: Date.now() + 60 * 60 * 1000,
        },
      });

      const emailHtml = await render(
        RecoverPasswordEmail({
          url: `${baseUrl}/recuperar-senha?user=${user.id}`,
          name: user.name!,
        }),
      );

      const options = {
        from: '"Zuro" suporte.zuro@gmail.com',
        to: user.email!,
        subject: "Redefina sua senha - Zuro",
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
        email: user.email!,
      };
    }),
  checkRecoverPasswordExpire: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID do usuário é obrigatório"),
      }),
    )
    .query(async (opts) => {
      const { id } = opts.input;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      if (!user.passwordRecoverExpire) {
        return {
          redirect: true,
        };
      }

      const dateExpired = isAfter(
        new Date(),
        new Date(user.passwordRecoverExpire!),
      );

      if (dateExpired) {
        return { redirect: true };
      }

      return { redirect: false };
    }),
  recoverNewPassword: publicProcedure
    .input(
      z
        .object({
          id: z.string().min(1, "ID do usuário é obrigatório"),
          newPassword: z
            .string()
            .min(1, "Nova senha é obrigatória")
            .min(6, "Nova senha precisa ter no mínimo 6 caracteres"),
          newPasswordConfirmation: z
            .string()
            .min(1, "Confirmação da senha nova é obrigatória")
            .min(
              6,
              "Confirmação da senha nova precisa ter no mínimo 6 caracteres",
            ),
        })
        .superRefine(({ newPassword, newPasswordConfirmation }, ctx) => {
          if (newPasswordConfirmation !== newPassword) {
            ctx.addIssue({
              code: "custom",
              message: "As senhas não coincidem, verifique e tente novamente",
              path: ["newPasswordConfirmation"],
            });
          }
        }),
    )
    .mutation(async (opts) => {
      const { id, newPassword } = opts.input;

      const salt = await bcrypt.genSalt(10);
      const pwHash = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: pwHash,
          passwordRecoverExpire: null,
        },
      });

      return { message: "Senha atualizada com sucesso" };
    }),
  getEmailNotificationOptions: isUserAuthedProcedure.query(async (opts) => {
    const { email } = opts.ctx.user.user;

    if (!email) {
      return {
        error: true,
        message: "E-mail não encontrado",
        emailNotification: null,
        notificationNewSchedule: null,
        notificationDailySchedules: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        error: true,
        message: "Usuário não encontrado",
        emailNotification: null,
        notificationNewSchedule: null,
        notificationDailySchedules: null,
      };
    }

    return {
      error: false,
      message: "",
      emailNotification: user.emailNotification,
      notificationNewSchedule: user.notificationNewSchedule,
      notificationDailySchedules: user.notificationDailySchedules,
    };
  }),
  updateAlertsOptions: isUserAuthedProcedure
    .input(
      z.object({
        emailNotification: z.boolean({ message: "Valor inválido" }),
        notificationNewSchedule: z.boolean({ message: "Valor inválido" }),
        notificationDailySchedules: z.boolean({ message: "Valor inválido" }),
      }),
    )
    .mutation(async (opts) => {
      const {
        emailNotification,
        notificationNewSchedule,
        notificationDailySchedules,
      } = opts.input;
      const { email } = opts.ctx.user.user;

      if (!email) {
        return {
          error: true,
          message: "E-mail não encontrado",
        };
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          error: true,
          message: "Usuário não encontrado",
        };
      }

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          emailNotification,
          notificationNewSchedule,
          notificationDailySchedules,
        },
      });

      return {
        error: false,
        message: "Opções salvas com sucesso",
      };
    }),
});
