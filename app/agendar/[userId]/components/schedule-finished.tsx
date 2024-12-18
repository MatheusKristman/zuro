import { Skeleton } from "@/components/ui/skeleton";
import { ScheduleStore } from "@/stores/schedule-store";
import { Service } from "@prisma/client";
import { format } from "date-fns";
import { Check } from "lucide-react";

interface ScheduleFinishedProps {
  professionalName: string | null | undefined;
  services: Service[] | null | undefined;
}

export function ScheduleFinished({
  professionalName,
  services,
}: ScheduleFinishedProps) {
  const { time, date, service } = ScheduleStore();

  if (
    !professionalName ||
    !time ||
    date === undefined ||
    !service ||
    !services
  ) {
    return (
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
        <div className="w-full flex flex-col items-center gap-12">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />

              <Skeleton className="h-10 w-48" />
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              <Skeleton className="h-10 w-36" />

              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-16 w-full" />
          </div>

          {/* TODO: confirmar se tem como salvar o agendamento no google calendar de graça */}
          {/* <Button size="xl" className="w-full"> */}
          {/*   Salvar no Google Agenda */}
          {/* </Button> */}
        </div>
      </div>
    );
  }

  const serviceName = services.filter((serv) => serv.id === service)[0].name;

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
      <div className="w-full flex flex-col items-center gap-12">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-skin-primary flex items-center justify-center">
              <Check size={70} color="#FFF" />
            </div>

            <h2 className="text-3xl font-semibold text-skin-primary text-center">
              Seu agendamento foi realizado com sucesso!
            </h2>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold text-center text-slate-600">
              Resumo do agendamento
            </h3>

            <div className="relative w-full flex flex-col items-center gap-4 bg-black/10 rounded-xl p-4 sm:grid sm:grid-cols-[1fr_1px_1fr_1px_1fr]">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center text-slate-600">
                  Profissional
                </span>

                <span className="text-2xl font-bold text-center capitalize text-slate-800">
                  {professionalName}
                </span>
              </div>

              <div className="w-full h-px bg-foreground/10 flex sm:w-px sm:h-full sm:shrink-0" />

              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center text-slate-600">
                  Data e horário do agendamento
                </span>

                <span className="text-2xl font-bold text-center text-slate-800">
                  {format(date, "dd/MM/yyyy")} às {time}
                </span>
              </div>

              <div className="w-full h-px bg-foreground/10 flex sm:w-px sm:h-full sm:shrink-0" />

              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center text-slate-600">
                  Serviço
                </span>

                <span className="text-2xl font-bold text-center capitalize text-slate-800">
                  {serviceName}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full p-4 rounded-xl bg-amber-100">
            <span className="font-semibold text-amber-600 text-center w-full block">
              Pode fechar a aba
            </span>
          </div>
        </div>

        {/* TODO: confirmar se tem como salvar o agendamento no google calendar de graça */}
        {/* <Button size="xl" className="w-full"> */}
        {/*   Salvar no Google Agenda */}
        {/* </Button> */}
      </div>
    </div>
  );
}
