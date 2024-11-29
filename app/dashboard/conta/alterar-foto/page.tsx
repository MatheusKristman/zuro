"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { UploadButton } from "@/lib/uploadthing";
import { trpc } from "@/lib/trpc-client";

export default function ChangeProfilePhotoPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Alterar Foto
        </h2>

        <div className="w-full m-10 bg-white rounded-3xl p-6 flex flex-col gap-12">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="relative w-36 h-36 shrink-0 rounded-full bg-skin-primary overflow-hidden flex items-center justify-center">
              {data && data.user.image ? (
                <Image
                  src={data.user.image}
                  alt="Imagem selecionada"
                  fill
                  className="object-center object-cover"
                />
              ) : (
                <div className="flex items-center justify-center size-24 bg-skin-primary rounded-full">
                  <UserRound color="#FFF" className="size-12" />
                </div>
              )}
            </div>

            <UploadButton
              content={{
                button({ ready }) {
                  if (ready) return <div>Enviar foto</div>;

                  return "Carregando...";
                },
                allowedContent({ ready, isUploading }) {
                  if (!ready) return "Carregando...";
                  if (isUploading) return "Enviando...";
                  return "Imagem (4MB)";
                },
              }}
              disabled={isPending || isSubmitting}
              endpoint="updateProfilePhoto"
              input={{ id: data?.user.id ?? "" }}
              onClientUploadComplete={() => {
                setIsSubmitting(false);
                util.userRouter.getUser.invalidate();
                toast.success("Foto atualizada com sucesso");
              }}
              onUploadError={(error: Error) => {
                toast.error("Ocorreu um erro!");
                console.error(`UPLOADTHING ERROR! ${error.message}`);
              }}
              onBeforeUploadBegin={(files) => {
                return files.map(
                  (f) => new File([f], f.name, { type: f.type }),
                );
              }}
              onUploadBegin={() => {
                setIsSubmitting(true);
              }}
            />
          </div>

          <div className="w-full sm:flex sm:justify-center">
            <Button
              size="xl"
              variant="outline"
              className="w-full sm:max-w-md"
              disabled={isPending || isSubmitting}
              asChild
            >
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
