import { prisma } from "@/lib/db";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const websiteRouter = router({
  getColor: publicProcedure.query(async () => {
    const actualColor = await prisma.primaryColor.findFirst();

    if (!actualColor) {
      return {
        id: "",
        color: "81 113 225",
      };
    }

    return { id: actualColor.id, color: actualColor.colorCode };
  }),
  updateColor: publicProcedure
    .input(
      z.object({
        colorId: z.string().min(1, "ID da cor obrigatório"),
        newColor: z.string().min(1, "Código da cor nova obrigatória").max(7, "Cor inválida"),
      })
    )
    .mutation(async (opts) => {
      const { colorId, newColor } = opts.input;

      const colorUpdated = await prisma.primaryColor.update({
        where: {
          id: colorId,
        },
        data: {
          colorCode: newColor,
        },
      });

      return { colorUpdated };
    }),
});
