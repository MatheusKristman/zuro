"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { trpc } from "@/lib/trpc-client";

export default function ShareLinkPage() {
  const [shareLink, setShareLink] = useState<string>("");
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/");
    }

    if (data && data.user.role === "USER" && !data.user.firstAccess) {
      router.replace("/dashboard/primeira-configuracao?step=0");
    }

    if (data && data.user.id) {
      console.log("Tem dados");
      setShareLink(`${window.location.origin}/agendar/${data.user.id}`);
    }
  }, [data, session, router]);

  function copyToClipboard() {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = shareLink;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Link copiado com sucesso!");
      } catch (err) {
        console.error("Erro ao copiar o link: ", err);
        toast.error("Não foi possível copiar o link.");
      }

      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(shareLink).then(
        () => toast.success("Link copiado com sucesso!"),
        (err) => {
          console.error("Erro ao copiar o link: ", err);
          toast.error("Não foi possível copiar o link.");
        },
      );
    }
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Link de compartilhamento
        </h2>

        <div className="w-full p-4 rounded-3xl bg-white mt-10">
          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Input
              disabled
              value={shareLink}
              className="disabled:cursor-not-allowed disabled:opacity-100 pointer-events-none"
            />

            <Button size="xl" disabled={isPending} onClick={copyToClipboard}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copiar
            </Button>
          </div>

          <span className="block text-foreground/70 text-sm text-center mt-4 sm:text-left">
            Este link foi criado para facilitar o agendamento com seus clientes.
            Ao compartilhá-lo, seus clientes poderão acessar sua agenda e
            escolher o melhor horário disponível para eles, de forma prática e
            rápida.
          </span>
        </div>
      </div>
    </main>
  );
}
