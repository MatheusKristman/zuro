"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ChangeAccountDataPage() {
  const [newName, setNewName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const util = trpc.useUtils();
  const { mutate: updateName, isPending: isNameUpdating } =
    trpc.userRouter.updateName.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);

          return;
        }

        util.userRouter.getUser.invalidate();
        setNewName("");
        toast.success(res.message);
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao atualizar o nome da conta");
      },
    });

  const pending = isNameUpdating;

  function handleUpdateName() {
    if (newName.length <= 4) {
      if (newName.length === 0) {
        setNameError("Nome é obrigatório");

        return;
      } else {
        setNameError("Nome precisa ter no mínimo 4 caracteres");

        return;
      }
    }

    setNameError("");

    updateName({ newName });
  }

  // TODO: adicionar função de editar e-mail
  // TODO: adicionar e-mail profissional para enviar mensagem e código para alteração do e-mail da conta
  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Alterar Dados
        </h2>

        <div className="w-full flex flex-col gap-10 my-10">
          <div className="w-full bg-white rounded-3xl p-6 ">
            <div className="space-y-2 w-full">
              <div className="w-full flex flex-col gap-12 sm:flex-row sm:items-end sm:gap-4">
                <div className="space-y-2 w-full">
                  <Label className="text-slate-600 font-bold" htmlFor="name">
                    Nome
                  </Label>

                  <Input
                    id="name"
                    placeholder="Insira o novo nome"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={pending}
                  />
                </div>

                <Button size="xl" disabled={pending} onClick={handleUpdateName}>
                  {pending && <Loader2 className="animate-spin" />}
                  Salvar
                </Button>
              </div>

              {nameError && (
                <span className="text-sm text-destructive">{nameError}</span>
              )}
            </div>
          </div>

          <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-12">
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2 w-full">
                  <Label className="text-slate-600 font-bold" htmlFor="email">
                    E-mail
                  </Label>

                  <Input
                    id="email"
                    disabled={pending}
                    placeholder="Insira o e-mail que deseja trocar"
                  />
                </div>

                <Button disabled={pending} size="xl">
                  Enviar código
                </Button>
              </div>

              <div className="space-y-2 w-full">
                <Label
                  className="text-slate-600 font-bold"
                  htmlFor="confirmationCode"
                >
                  Código de confirmação
                </Label>

                <Input
                  disabled={pending}
                  id="confirmationCode"
                  placeholder="Insira o código que foi enviado no e-mail acima"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 sm:flex-row">
              <Button
                disabled={pending}
                size="xl"
                variant="outline"
                className="w-full"
                asChild
              >
                {pending ? (
                  <span>Voltar</span>
                ) : (
                  <Link href="/dashboard/conta">Voltar</Link>
                )}
              </Button>

              <Button disabled={pending} size="xl" className="w-full">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
