import { z } from "zod";
import { Role, ScheduleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";

export const adminRouter = router({
  getUsers: adminProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      })
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
      });

      return { users };
    }),
  getPeriodStatistics: adminProcedure
    .input(
      z.object({
        from: z.string().min(1, "Data de início é obrigatório"),
        to: z.string().min(1, "Data de término é obrigatório"),
      })
    )
    .mutation(async (opts) => {
      const { from, to } = opts.input;

      const startDateFormatted = format(parse(from, "yyyy-MM-dd", new Date(), { locale: ptBR }), "yyyy-MM-dd");
      const endDateFormatted = format(parse(to, "yyyy-MM-dd", new Date(), { locale: ptBR }), "yyyy-MM-dd");

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

      const schedulesFiltered = schedules.filter((schedule) => schedule.status === ScheduleStatus.confirmed);

      const totalEarned = schedulesFiltered.reduce((total, obj) => {
        return total + obj.service.price;
      }, 0);
      const clientsConfirmed = schedules.filter((schedule) => schedule.status === ScheduleStatus.confirmed).length;
      const clientsCancelled = schedules.filter((schedule) => schedule.status === ScheduleStatus.cancelled).length;
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
          actualEmail: z.string().email("E-mail inválido").min(1, "E-mail atual é obrigatório"),
          newEmail: z.string().email("E-mail inválido").min(1, "Novo e-mail é obrigatório"),
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
        })
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

      const isPasswordCorrect = await bcrypt.compare(password, user.password!);

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
        message: "E-mail atualizado com sucesso",
      };
    }),
});
