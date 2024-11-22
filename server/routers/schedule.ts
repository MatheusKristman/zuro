import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const scheduleRouter = router({
  getSelectedUser: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1, "ID obrigatório"),
      })
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
});
