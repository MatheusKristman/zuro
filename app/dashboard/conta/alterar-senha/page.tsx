"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type passwordErrorType = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<passwordErrorType>({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const router = useRouter();

  useEffect(() => {
    console.log({ password, newPassword, confirmNewPassword });
  }, [password, newPassword, confirmNewPassword]);

  const { mutate: submitChangePassword, isPending } =
    trpc.userRouter.submitChangePassword.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        router.push("/dashboard/conta");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  function onSubmit() {
    let passwordError = "";
    let newPasswordError = "";
    let confirmNewPasswordError = "";

    if (!password) {
      passwordError = 'Campo "Senha Atual" é obrigatório';
    }

    if (!newPassword) {
      newPasswordError = 'Campo "Nova Senha" é obrigatório';
    }

    if (!confirmNewPassword) {
      confirmNewPasswordError = 'Campo "Confirmar Senha" é obrigatório';
    }

    if (newPassword.length < 6) {
      newPasswordError = "É preciso ter no mínimo 6 caracteres";
    }

    if (confirmNewPassword !== newPassword) {
      confirmNewPasswordError =
        "A confirmação da senha precisa ser igual a senha criada";
    }

    if (passwordError || newPasswordError || confirmNewPasswordError) {
      setError({
        password: passwordError,
        newPassword: newPasswordError,
        confirmNewPassword: confirmNewPasswordError,
      });

      return;
    }

    setError({ password: "", newPassword: "", confirmNewPassword: "" });

    submitChangePassword({ password, newPassword, confirmNewPassword });
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Alterar Senha
        </h2>

        <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-10 my-10">
          <div className="w-full flex flex-col gap-4 xl:flex-row">
            <div className="space-y-2 w-full">
              <Label className="text-slate-600 font-bold" htmlFor="password">
                Senha Atual
              </Label>

              <Input
                id="password"
                placeholder="Insira a sua senha atual"
                value={password}
                disabled={isPending}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />

              {error.password && (
                <span className="text-sm text-destructive">
                  {error.password}
                </span>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label className="text-slate-600 font-bold" htmlFor="newPassword">
                Nova Senha
              </Label>

              <Input
                id="newPassword"
                placeholder="Insira a sua nova senha"
                value={newPassword}
                disabled={isPending}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />

              {error.newPassword && (
                <span className="text-sm text-destructive">
                  {error.newPassword}
                </span>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label
                className="text-slate-600 font-bold"
                htmlFor="confirmNewPassword"
              >
                Confirmar Senha
              </Label>

              <Input
                id="confirmNewPassword"
                placeholder="Confirme a sua nova senha"
                value={confirmNewPassword}
                disabled={isPending}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />

              {error.confirmNewPassword && (
                <span className="text-sm text-destructive">
                  {error.confirmNewPassword}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Button
              size="xl"
              variant="outline"
              className="w-full"
              disabled={isPending}
              asChild
            >
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            <Button
              size="xl"
              className="w-full"
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
