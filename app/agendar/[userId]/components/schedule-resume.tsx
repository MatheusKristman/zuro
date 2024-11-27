import { Availability, Schedule, Service, User } from "@prisma/client";
import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input";

import { formatPrice } from "@/lib/utils";
import { ScheduleStore } from "@/stores/schedule-store";

interface ScheduleResumeProps {
  user:
    | (User & {
        services: Service[];
        schedules: Schedule[];
        availability: Availability[];
      })
    | undefined;
}

export function ScheduleResume({ user }: ScheduleResumeProps) {
  const { service, time, date, fullName, email, tel } = ScheduleStore();

  if (user === undefined) {
    return <div>Skeleton</div>;
  }

  const serviceSelected = user.services.filter(
    (serv) => serv.id === service,
  )[0];

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-skin-primary text-center">
        Resumo do agendamento
      </h2>

      <div className="w-full mt-10 flex flex-col items-center gap-4 sm:grid sm:grid-cols-2">
        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Profissional
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {user.name}
          </span>
        </div>

        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Serviço
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {serviceSelected.name}
          </span>
        </div>

        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Data e horário
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {format(date ?? new Date(), "dd/MM/yyyy")} as {time}
          </span>
        </div>

        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Seu nome completo
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {fullName}
          </span>
        </div>

        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Seu e-mail
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {email}
          </span>
        </div>

        <div className="w-full p-4 rounded-xl bg-skin-primary flex flex-col gap-2">
          <span className="text-xl text-white font-medium text-center">
            Seu telefone
          </span>

          <span className="text-2xl text-white font-bold text-center">
            {formatPhoneNumber(tel)}
          </span>
        </div>
      </div>

      <div className="w-full p-4 rounded-xl bg-background border border-skin-primary flex flex-col gap-2 mt-10 sm:w-1/2 sm:mx-auto">
        <span className="text-xl text-skin-primary font-medium text-center">
          Valor do serviço
        </span>

        <span className="text-2xl text-skin-primary font-bold text-center">
          {formatPrice(serviceSelected.price)}
        </span>
      </div>

      <p className="mt-10 text-base text-foreground/70 w-full text-center max-w-prose mx-auto">
        Se ocorrer algum imprevisto no dia do seu agendamento e você precisar
        cancelar, não se preocupe! Basta entrar em contato com o profissional,
        que ele realizará o cancelamento para você. Estamos aqui para garantir a
        sua melhor experiência!
      </p>
    </div>
  );
}
