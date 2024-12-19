"use client";

import Link from "next/link";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";

import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";

function GoogleLoginButton() {
  const trpcUtils = trpc.useUtils();

  const { mutate: generateGoogleToken, isPending } =
    trpc.userRouter.generateGoogleToken.useMutation({
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
    <Button
      onClick={() => signInGoogle()}
      disabled={isPending}
      size="xl"
      variant="outline"
      className="w-fit"
    >
      Vincular Conta
      <FcGoogle />
    </Button>
  );
}

export default function AlertConfigurationPage() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [notificationNewSchedule, setNotificationNewSchedule] =
    useState<boolean>(false);
  const [notificationDailySchedules, setNotificationDailySchedules] =
    useState<boolean>(false);

  const trpcUtils = trpc.useUtils();
  const router = useRouter();

  const { data, isPending } = trpc.userRouter.getGoogleClientToken.useQuery();
  const { data: emailNotificationOptions, isPending: isEmailOptionsPending } =
    trpc.userRouter.getEmailNotificationOptions.useQuery();
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
  const { mutate: updateAlertsOptions, isPending: isUpdatingOptions } =
    trpc.userRouter.updateAlertsOptions.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);

        trpcUtils.userRouter.getEmailNotificationOptions.invalidate();

        router.replace("/dashboard/conta");
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao salvar as opções");
      },
    });

  const clientId = data?.clientId ?? "";
  const pending =
    isPending ||
    isUnbindingGoogleToken ||
    isEmailOptionsPending ||
    isUpdatingOptions;
  const saveEnabled =
    emailNotification !== emailNotificationOptions?.emailNotification ||
    notificationNewSchedule !==
      emailNotificationOptions?.notificationNewSchedule ||
    notificationDailySchedules !==
      emailNotificationOptions?.notificationDailySchedules;

  useEffect(() => {
    if (data !== undefined) {
      if (data.refreshToken) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (emailNotificationOptions !== undefined) {
      setEmailNotification(emailNotificationOptions.emailNotification!);
      setNotificationNewSchedule(
        emailNotificationOptions.notificationNewSchedule!,
      );
      setNotificationDailySchedules(
        emailNotificationOptions.notificationDailySchedules!,
      );
    }
  }, [emailNotificationOptions]);

  if (isPending) {
    return null;
  }

  function saveOptions() {
    updateAlertsOptions({
      emailNotification,
      notificationNewSchedule,
      notificationDailySchedules,
    });
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Alerta de Avisos
        </h2>

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

                    <span className="text-skin-primary text-base font-semibold">
                      Google Agenda Conectado
                    </span>

                    <Button
                      onClick={() => unbindGoogleToken()}
                      disabled={isUnbindingGoogleToken}
                      size="xl"
                      variant="destructive"
                      className="w-full"
                    >
                      Desvincular
                      {isUnbindingGoogleToken ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <LogOut />
                      )}
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
                <Label
                  htmlFor="email-notification"
                  className="font-bold text-slate-600"
                >
                  Notificação por e-mail
                </Label>

                <Switch
                  className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-slate-400"
                  checked={emailNotification}
                  onCheckedChange={(checked) => setEmailNotification(checked)}
                  id="email-notification"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Toggle
                  variant="outline"
                  size="xl"
                  disabled={!emailNotification}
                  pressed={notificationNewSchedule}
                  onPressedChange={(pressed) =>
                    setNotificationNewSchedule(pressed)
                  }
                >
                  Novo agendamento
                </Toggle>

                <Toggle
                  variant="outline"
                  size="xl"
                  disabled={!emailNotification}
                  pressed={notificationDailySchedules}
                  onPressedChange={(pressed) =>
                    setNotificationDailySchedules(pressed)
                  }
                >
                  Agenda do dia
                </Toggle>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Button
              size="xl"
              variant="outline"
              className="w-full"
              disabled={pending}
              asChild
            >
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            <Button
              size="xl"
              className="w-full"
              disabled={pending || !saveEnabled}
              onClick={saveOptions}
            >
              Salvar
              {isUpdatingOptions && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
