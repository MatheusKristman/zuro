"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VacationModePage() {
  const [vacationMode, setVacationMode] = useState<boolean>(false);

  const router = useRouter();
  const trpcUtils = trpc.useUtils();

  const { data, isPending } = trpc.userRouter.getVacationMode.useQuery();
  const { mutate: handleVacationMode, isPending: isChangingVacationMode } =
    trpc.userRouter.handleVacationMode.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
        }

        toast.success(res.message);
        trpcUtils.userRouter.getVacationMode.invalidate();

        router.push("/dashboard/conta");
      },
      onError: (err) => {
        console.error(err);

        toast.error(
          "Ocorreu um erro ao atualizar o modo férias da sua conta, tente novamente mais tarde",
        );
      },
    });

  const pending = isPending || isChangingVacationMode;

  useEffect(() => {
    if (data !== undefined && data.vacationMode !== null) {
      setVacationMode(data.vacationMode);
    }
  }, [data]);

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Configurar Modo Férias
        </h2>

        <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-10 my-10">
          <p className="text-lg text-muted-foreground">
            Ative o Modo Férias para pausar temporariamente os agendamentos.
            Enquanto esse modo estiver ativo, novos agendamentos não poderão ser
            realizados, mas você poderá gerenciar os existentes. Quando estiver
            pronto para voltar, basta desativar o modo para reabrir sua agenda.
          </p>

          {isPending ? (
            <div className="w-full flex items-center justify-center">
              <Loader2
                strokeWidth={1.5}
                className="animate-spin size-10 text-muted-foreground"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <span
                className={cn(
                  "bg-muted rounded-xl py-2 px-4 text-muted-foreground font-semibold",
                  {
                    "bg-green-400 text-green-700": data?.vacationMode,
                  },
                )}
              >
                {data?.vacationMode !== null && data?.vacationMode
                  ? "Ligado"
                  : "Desligado"}
              </span>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="vacationMode"
                  className="text-lg font-bold text-slate-600"
                >
                  Modo Férias:
                </Label>

                <Switch
                  id="vacationMode"
                  disabled={pending}
                  checked={vacationMode}
                  onCheckedChange={setVacationMode}
                />
              </div>
            </div>
          )}

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
              onClick={() => handleVacationMode({ vacationMode })}
              disabled={pending || vacationMode === data?.vacationMode}
            >
              {isChangingVacationMode && <Loader2 className="animate-spin" />}
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
