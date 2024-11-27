import { z } from "zod";
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
          availability: true,
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
        serviceId: z.string().min(1, "ID obrigatório"),
      }),
    )
    .mutation(async (opts) => {
      const { date, serviceId } = opts.input;

      console.log({ date });

      const schedules = await prisma.schedule.findMany({
        where: {
          serviceId,
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
        paymentMethod: z.enum(["before", "after"], {
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

      await prisma.schedule.create({
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

      return {};
    }),
});
