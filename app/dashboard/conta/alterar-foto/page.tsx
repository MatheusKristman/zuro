"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { UploadButton } from "@/lib/uploadthing";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

export default function ChangeProfilePhotoPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  const pending = isSubmitting || isPending;

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between mb-12">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Alterar Foto</h2>

        <div className="w-full mt-10 bg-white rounded-3xl p-6 flex flex-col gap-12">
          <div className="w-full flex flex-col items-center gap-4">
            <p className="bg-muted p-3 rounded-xl block text-base font-medium text-muted-foreground text-center w-full max-w-md">
              A foto selecionada será exibida para os clientes no momento do agendamento, ajudando a identificar seu
              perfil de forma personalizada.
            </p>

            <div className="relative w-36 h-36 shrink-0 rounded-full bg-skin-primary overflow-hidden flex items-center justify-center">
              {data && data.user.image ? (
                <Image src={data.user.image} alt="Imagem selecionada" fill className="object-center object-cover" />
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
              disabled={pending}
              endpoint="updateProfilePhoto"
              input={{ id: data?.user.id ?? "" }}
              onClientUploadComplete={() => {
                setIsSubmitting(false);
                util.userRouter.getUser.invalidate();
                toast.success("Foto atualizada com sucesso");
              }}
              onUploadError={(error: Error) => {
                setIsSubmitting(false);
                toast.error("Ocorreu um erro!");
                console.error(`UPLOADTHING ERROR! ${error.message}`);
              }}
              onBeforeUploadBegin={(files) => {
                setIsSubmitting(true);

                return files.map((f) => new File([f], f.name, { type: f.type }));
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
              className={cn("w-full sm:max-w-md", pending && "opacity-50")}
              disabled={pending}
              asChild
            >
              {pending ? (
                <span className="pointer-events-none">Voltar</span>
              ) : (
                <Link href="/dashboard/conta">Voltar</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
