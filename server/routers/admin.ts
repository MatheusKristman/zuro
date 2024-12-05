import { z } from "zod";
import { Role } from "@prisma/client";

import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";

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
      });

      return { users };
    }),
});
