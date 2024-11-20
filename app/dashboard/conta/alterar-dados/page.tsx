"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangeAccountDataPage() {
  // TODO: adicionar função de editar nome
  // TODO: adicionar função de editar e-mail
  // TODO: adicionar e-mail profissional para enviar mensagem e código para alteração do e-mail da conta
  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Alterar Dados</h2>

        <div className="w-full flex flex-col gap-10 mt-10 mb-6">
          <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-12 sm:flex-row sm:items-end sm:gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Nome</Label>

              <Input id="name" placeholder="Insira o novo nome" />
            </div>

            <Button size="xl">Salvar</Button>
          </div>

          <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-12">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2 w-full">
                  <Label htmlFor="email">E-mail</Label>

                  <Input id="email" placeholder="Insira o e-mail que deseja trocar" />
                </div>

                <Button size="xl">Enviar código</Button>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="confirmationCode">Código de confirmação</Label>

                <Input id="confirmationCode" placeholder="Insira o código que foi enviado no e-mail acima" />
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 sm:flex-row">
              <Button size="xl" variant="outline" className="w-full" asChild>
                <Link href="/dashboard/conta">Voltar</Link>
              </Button>

              <Button size="xl" className="w-full">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
