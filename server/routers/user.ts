import { z } from "zod";
import bcrypt from "bcryptjs";
import { generate } from "generate-password";
import { TRPCError } from "@trpc/server";

import { isUserAuthedProcedure, publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";

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
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { email, name } = input;

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

      const generatedPassword = generate({
        length: 10,
        numbers: true,
      });

      const salt = await bcrypt.genSalt(10);
      const pwHash = await bcrypt.hash(generatedPassword, salt);

      // TODO: enviar no e-mail a senha para o usuário
      console.log(generatedPassword);

      await prisma.user.create({
        data: {
          name,
          email,
          password: pwHash,
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
});
