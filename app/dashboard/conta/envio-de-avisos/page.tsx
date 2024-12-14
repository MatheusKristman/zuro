"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc-client";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

function GoogleLoginButton() {
  const trpcUtils = trpc.useUtils();

  const { mutate: generateGoogleToken, isPending } = trpc.userRouter.generateGoogleToken.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);

      trpcUtils.userRouter.getGoogleClientToken.invalidate();
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao vincular a conta");
    },
  });

  const signInGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if (codeResponse.code) {
        console.log(codeResponse);
        generateGoogleToken({ code: codeResponse.code });
      }
    },
    scope: "https://www.googleapis.com/auth/calendar",
    flow: "auth-code",
  });

  return (
    <Button onClick={() => signInGoogle()} disabled={isPending} size="xl" variant="outline" className="w-fit">
      Vincular Conta
      <FcGoogle />
    </Button>
  );
}

export default function AlertConfigurationPage() {
  const [hasToken, setHasToken] = useState<boolean>(false);

  const trpcUtils = trpc.useUtils();

  const { data, isPending } = trpc.userRouter.getGoogleClientToken.useQuery();
  const { mutate: unbindGoogleToken, isPending: isUnbindingGoogleToken } =
    trpc.userRouter.unbindGoogleToken.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);

          return;
        }

        toast.success(res.message);

        trpcUtils.userRouter.getGoogleClientToken.invalidate();
      },
      onError: (err) => {
        console.log(err);

        toast.error("Ocorreu um erro ao desvincular a conta");
      },
    });

  const clientId = data?.clientId ?? "";
  const pending = isPending || isUnbindingGoogleToken;

  useEffect(() => {
    if (data !== undefined) {
      if (data.refreshToken) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    }
  }, [data]);

  if (isPending) {
    return null;
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Alerta de Avisos</h2>

        <div className="w-full my-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col gap-4">
              <h5 className="text-xl text-skin-primary font-semibold">
                Receba os agendamentos na sua conta do Google Agenda
              </h5>

              {hasToken ? (
                <div className="w-1/2 flex items-end justify-between gap-4">
                  <div className="p-4 flex flex-col items-center gap-2 border border-input rounded-xl">
                    <FcGoogle size={26} />

                    <span className="text-skin-primary text-base font-semibold">Google Agenda Conectado</span>

                    <Button
                      onClick={() => unbindGoogleToken()}
                      disabled={isUnbindingGoogleToken}
                      size="xl"
                      variant="destructive"
                      className="w-full"
                    >
                      Desvincular
                      {isUnbindingGoogleToken ? <Loader2 className="animate-spin" /> : <LogOut />}
                    </Button>
                  </div>
                </div>
              ) : (
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLoginButton />
                </GoogleOAuthProvider>
              )}
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="w-full h-px bg-muted" />

              <div className="flex flex-col gap-2">
                <Label htmlFor="email-notification" className="font-semibold">
                  Notificação por e-mail
                </Label>

                <Switch id="email-notification" />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="xl" className="w-full" disabled={pending}>
                  Novo agendamento
                </Button>

                <Button size="xl" className="w-full" disabled={pending}>
                  Agenda do dia
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Button size="xl" variant="outline" className="w-full" disabled={pending} asChild>
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            <Button size="xl" className="w-full" disabled={pending}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
