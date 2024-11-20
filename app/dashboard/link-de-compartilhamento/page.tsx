"use client";

// TODO: verificar se o usuário concluiu a configuração da conta para permitir acessar a página
import { useState } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ShareLinkPage() {
  // TODO: criar função para gerar o link de compartilhamento
  const [shareLink, setShareLink] = useState<string>("http://localhost:3000/dashboard/link-de-compartilhamento");

  function copyToClipboard() {
    if (!navigator.clipboard) {
      // Fallback para navegadores que não suportam o Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareLink;
      textArea.style.position = "fixed"; // Evita que o textarea afete o layout
      textArea.style.opacity = "0"; // Torna invisível
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
      // Uso moderno do Clipboard API
      navigator.clipboard.writeText(shareLink).then(
        () => toast.success("Link copiado com sucesso!"),
        (err) => {
          console.error("Erro ao copiar o link: ", err);
          toast.error("Não foi possível copiar o link.");
        }
      );
    }
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Link de compartilhamento</h2>

        <div className="w-full p-4 rounded-3xl bg-white mt-10">
          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Input
              disabled
              value={shareLink}
              className="disabled:cursor-not-allowed disabled:opacity-100 pointer-events-none"
            />

            <Button size="xl" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
              Copiar
            </Button>
          </div>

          <span className="block text-foreground/70 text-sm text-center mt-4 sm:text-left">
            Este link foi criado para facilitar o agendamento com seus clientes. Ao compartilhá-lo, seus clientes
            poderão acessar sua agenda e escolher o melhor horário disponível para eles, de forma prática e rápida.
          </span>
        </div>
      </div>
    </main>
  );
}
