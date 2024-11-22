import { prisma } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  updateProfilePhoto: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        id: z.string().min(1, "ID inválido"),
      })
    )
    .middleware(async ({ input }) => {
      return { userId: input.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          image: file.url,
        },
      });

      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
