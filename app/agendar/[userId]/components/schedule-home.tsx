import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ScheduleHomeProps {
  userId: string;
  hasImage: boolean | undefined;
  imageSrc: string | null;
  userName: string | null | undefined;
  vacationMode: boolean | undefined;
  isLoading: boolean;
}

export function ScheduleHome({
  userId,
  hasImage,
  imageSrc,
  userName,
  vacationMode,
  isLoading,
}: ScheduleHomeProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-2xl font-semibold text-center text-skin-primary">
            Agende seu atendimento com facilidade!
          </h2>

          <div className="relative size-24 rounded-full overflow-hidden flex items-center justify-center">
            <Skeleton className="w-full h-full bg-gray-200" />
          </div>

          <Skeleton className="h-7 w-40 bg-gray-200" />
        </div>

        <span className="text-base font-medium text-foreground/70 text-center">
          Encontre o horário perfeito para você com apenas alguns cliques.
          Escolha o serviço desejado, selecione o dia e horário disponível, e
          finalize seu agendamento. Nosso sistema é rápido, simples e feito para
          garantir sua conveniência.
        </span>

        <Button size="xl" className="w-full" asChild>
          <Link href={`/agendar/${userId}?step=0`}>Iniciar agendamento</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-2xl font-semibold text-center text-skin-primary">
          Agende seu atendimento com facilidade!
        </h2>

        <div className="relative size-24 rounded-full overflow-hidden bg-skin-primary flex items-center justify-center">
          {hasImage ? (
            <Image
              src={imageSrc!}
              alt="Foto de perfil"
              fill
              className="object-cover object-center"
            />
          ) : (
            <UserRound color="#FFF" className="size-12" />
          )}
        </div>

        <span className="text-xl text-skin-primary font-semibold">
          {userName}
        </span>
      </div>

      {vacationMode ? (
        <div className="w-full p-4 rounded-xl bg-amber-100">
          <span className="font-semibold text-amber-600 text-center w-full block">
            O profissional está em período de férias no momento e não está
            aceitando novos agendamentos. Por favor, volte a acessar este link
            após o período de férias para realizar seu agendamento. Agradecemos
            pela compreensão!
          </span>
        </div>
      ) : (
        <>
          <span className="text-base font-medium text-foreground/70 text-center">
            Encontre o horário perfeito para você com apenas alguns cliques.
            Escolha o serviço desejado, selecione o dia e horário disponível, e
            finalize seu agendamento. Nosso sistema é rápido, simples e feito
            para garantir sua conveniência.
          </span>

          <Button size="xl" className="w-full" asChild>
            <Link href={`/agendar/${userId}?step=0`}>Iniciar agendamento</Link>
          </Button>
        </>
      )}
    </div>
  );
}
