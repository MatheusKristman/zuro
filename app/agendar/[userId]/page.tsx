"use client";

import { trpc } from "@/lib/trpc-client";

import { useParams, useSearchParams } from "next/navigation";
import { ScheduleHome } from "./components/schedule-home";
import { ServiceDaySchedule } from "./components/service-day-schedule";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ScheduleServicePage() {
  const params = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const { data, isPending } = trpc.scheduleRouter.getSelectedUser.useQuery({ userId: params.userId });

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center gap-10 bg-skin-primary py-12 px-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-center text-white">Agendamento</h1>

        <div className="w-full flex items-center justify-between gap-2 max-w-[250px]">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                    "border-white": data && data.user.firstConfigurationStep >= 0,
                  })}
                >
                  {step === "0" && <div className="bg-white size-4 rounded-full" />}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                Selecione o dia e o serviço
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                    "border-white": data && data.user.firstConfigurationStep >= 1,
                  })}
                >
                  {step === "1" && <div className="bg-white size-4 rounded-full" />}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                Preencha os dados
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                    "border-white": data && data.user.firstConfigurationStep >= 2,
                  })}
                >
                  {step === "2" && <div className="bg-white size-4 rounded-full" />}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                Pagamento do serviço
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                    "border-white": data && data.user.firstConfigurationStep >= 3,
                  })}
                >
                  {step === "3" && <div className="bg-white size-4 rounded-full" />}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                Resumo
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                    "border-white": data && data.user.firstConfigurationStep >= 3,
                  })}
                >
                  {step === "4" && <div className="bg-white size-4 rounded-full" />}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                Concluído
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!step && (
        <ScheduleHome
          userId={params.userId}
          hasImage={data && data.user.image !== null}
          imageSrc={data?.user.image ?? ""}
          userName={data?.user.name}
          isLoading={isPending}
        />
      )}

      {step === "0" && <ServiceDaySchedule user={data?.user} />}

      {!!step && (
        <div className="w-full max-w-4xl flex justify-between mt-12">
          <Button
            variant="secondary"
            size="xl"
            disabled={step === "0"}
            className={cn(step === "0" && "!opacity-0")}
            // onClick={handleBack}
          >
            Voltar
          </Button>

          <Button variant="secondary" size="xl">
            {step === "3" ? <>Ir para dashboard</> : <>Próximo</>}
          </Button>
        </div>
      )}
    </main>
  );
}
