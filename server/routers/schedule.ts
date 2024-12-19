import { z } from "zod";
import { google } from "googleapis";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import ProfessionalServiceSchedulesNotification from "@/emails/professional-service-schedule-notification";
import ClientServiceScheduleNotification from "@/emails/client-service-schedule-notification";

import { publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const scheduleRouter = router({
  getSelectedUser: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID obrigatório"),
      }),
    )
    .query(async (opts) => {
      const { userId } = opts.input;

      const userSelected = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          availability: {
            include: {
              availableTimes: true,
            },
          },
          services: true,
          schedules: true,
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
  getServices: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID obrigatório"),
      }),
    )
    .query(async (opts) => {
      const { userId } = opts.input;

      const services = await prisma.service.findMany({
        where: {
          userId,
        },
      });

      return { services };
    }),
  getDaySchedule: publicProcedure
    .input(
      z.object({
        date: z.string().min(1, "Data obrigatória"),
        userId: z.string().min(1, "ID obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { date, userId } = opts.input;

      const schedules = await prisma.schedule.findMany({
        where: {
          userId,
          date,
        },
        include: {
          service: true,
        },
      });

      return { schedules };
    }),
  submitSchedule: publicProcedure
    .input(
      z.object({
        date: z.string().min(1, "Data é obrigatória"),
        time: z.string().min(1, "Horário é obrigatório"),
        fullName: z.string().min(1, "Nome completo é obrigatório"),
        email: z.string().min(1, "E-mail é obrigatório"),
        tel: z.string().min(1, "Telefone é obrigatório"),
        message: z.string(),
        paymentMethod: z.enum(["before", "after", "no_payment"], {
          message: "Método de pagamento inválido",
        }),
        receiptUrl: z.string(),
        serviceId: z.string().min(1, "ID do serviço é obrigatório"),
        userId: z.string().min(1, "ID do profissional é obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const {
        date,
        time,
        fullName,
        email,
        tel,
        message,
        paymentMethod,
        receiptUrl,
        serviceId,
        userId,
      } = opts.input;
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
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      };

      const schedule = await prisma.schedule.create({
        data: {
          date,
          time,
          fullName,
          email,
          tel,
          message,
          paymentMethod,
          receiptUrl,
          service: {
            connect: {
              id: serviceId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          user: true,
          service: true,
        },
      });

      const celCheck = schedule.tel.slice(5).length === 9;

      if (schedule.user.googleRefreshToken) {
        // TODO: verificar redirectURL para o domínio do site
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID!,
          process.env.GOOGLE_CLIENT_SECRET!,
          "http://localhost:3000",
        );

        oauth2Client.setCredentials({
          refresh_token: schedule.user.googleRefreshToken,
        });

        const calendar = google.calendar("v3");

        const [hour, minute] = schedule.time.split(":").map(Number);
        const [year, month, day] = schedule.date.split("-").map(Number);

        let start = new Date(year, month - 1, day);

        start = setHours(start, hour);
        start = setMinutes(start, minute);

        let end = new Date(start);
        end = addMinutes(end, schedule.service.minutes);

        const event = await calendar.events.insert({
          auth: oauth2Client,
          calendarId: "primary",
          requestBody: {
            summary: `${schedule.service.name} - ${schedule.fullName}`,
            description: `Contato do cliente: (${schedule.tel.slice(3, 5)}) ${
              celCheck ? schedule.tel.slice(5, 10) : schedule.tel.slice(5, 9)
            }-${celCheck ? schedule.tel.slice(10) : schedule.tel.slice(9)}${
              schedule.message ? `\nMensagem: ${schedule.message}` : ""
            }`,
            start: {
              dateTime: start.toISOString(),
            },
            end: {
              dateTime: end.toISOString(),
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 60 },
              ],
            },
          },
        });

        if (!event.data.id) {
          console.log("[SUBMIT_SCHEDULE_ERROR]: ID do evento não encontrado");

          return {};
        }

        const eventId = event.data.id;

        await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            googleEventId: eventId,
          },
        });
      }

      const [year, month, day] = schedule.date.split("-").map(Number);
      const formattedDate = format(
        new Date(year, month - 1, day),
        "dd/MM/yyyy",
      );

      if (
        schedule.user.emailNotification &&
        schedule.user.notificationNewSchedule
      ) {
        const professionalEmailHtml = await render(
          ProfessionalServiceSchedulesNotification({
            url: `${baseUrl}/dashboard/agenda`,
            service: schedule.service.name,
            date: formattedDate,
            name: schedule.user.name!,
            clientName: schedule.fullName,
            clientContact: `(${schedule.tel.slice(3, 5)}) ${
              celCheck ? schedule.tel.slice(5, 10) : schedule.tel.slice(5, 9)
            }-${celCheck ? schedule.tel.slice(10) : schedule.tel.slice(9)}`,
            time: schedule.time,
            message: schedule.message,
          }),
        );

        const professionalOptions = {
          from: '"Zuro" suporte.zuro@gmail.com',
          to: schedule.user.email!,
          subject: `Novo agendamento recebido - Zuro`,
          html: professionalEmailHtml,
        };

        if (process.env.NODE_ENV === "development") {
          const transporter = nodemailer.createTransport(devConfig);

          await transporter
            .sendMail(professionalOptions)
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const transporter = nodemailer.createTransport(prodConfig);

          await transporter.sendMail(professionalOptions);
        }
      }

      const clientEmailHtml = await render(
        ClientServiceScheduleNotification({
          service: schedule.service.name,
          date: formattedDate,
          name: schedule.fullName,
          time: schedule.time,
          professionalName: schedule.user.name!,
        }),
      );

      const clientOptions = {
        from: emailUser,
        to: schedule.email,
        subject: `Confirmação de Agendamento - ${formattedDate} às ${schedule.time} - Zuro`,
        html: clientEmailHtml,
      };

      if (process.env.NODE_ENV === "development") {
        const transporter = nodemailer.createTransport(devConfig);

        await transporter.sendMail(clientOptions);
      } else {
        const transporter = nodemailer.createTransport(prodConfig);

        await transporter.sendMail(clientOptions);
      }

      return {};
    }),
});
