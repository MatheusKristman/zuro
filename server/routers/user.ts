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
      })
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
      })
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
          paymentPreference: z.enum(["", "before_after", "before", "after"], {
            message: "Dados inválidos",
          }),
          pixKey: z.string(),
        })
        .superRefine(({ paymentPreference, pixKey }, ctx) => {
          if (
            (!paymentPreference || paymentPreference === "before_after" || paymentPreference === "before") &&
            !pixKey
          ) {
            ctx.addIssue({
              code: "custom",
              message: "Dados inválidos",
              path: ["pixKey"],
            });
          }
        })
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
        dayOff: z.enum(["Weekend", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
        availability: z
          .object({
            dayOfWeek: z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
            startTime: z.string(),
            endTime: z.string(),
            hasInterval: z.boolean(),
            startIntervalTime: z.string(),
            endIntervalTime: z.string(),
          })
          .array()
          .min(7, "Dados inválidos, precisa receber o dados de todos os dias"),
      })
    )
    .mutation(async (opts) => {
      const { availability, dayOff } = opts.input;
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
        .filter((item) => item.startTime !== "" || item.endTime !== "")
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
            })
          );

          await Promise.all(availabilityDeletePromise);
        }

        await prisma.availability.createMany({
          data: availabilityFiltered,
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
          })
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

      await prisma.availability.createMany({
        data: availabilityFiltered,
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
            })
          )
          .min(1, "É preciso ter ao menos um serviço registrado"),
      })
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
            })
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
          })
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
});