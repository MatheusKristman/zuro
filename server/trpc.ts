import { Role } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { Context } from "./context";
import { prisma } from "@/lib/db";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(async function isAdmin(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.user.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const email = ctx.user.user?.email;

  if (!email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const admin = await prisma.user.findFirst({
    where: {
      email,
      role: Role.ADMIN,
    },
  });

  if (!admin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      admin,
    },
  });
});
export const isUserAuthedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;

    if (!ctx.user || !ctx.user.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  },
);
