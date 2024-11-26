"use client";

import { trpc } from "@/lib/trpc-client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { ScheduleHome } from "./components/schedule-home";
import { ServiceDaySchedule } from "./components/service-day-schedule";
import { ClientInformationForm } from "./components/client-information-form";
import { ServicePayment } from "./components/service-payment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ScheduleStore } from "@/stores/schedule-store";

const clientInformationFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(6, "Nome precisa ter no mínimo 6 caracteres"),
  email: z.string().email("E-mail inválido"),
  tel: z.string().min(14, "Telefone inválido"),
});

export default function ScheduleServicePage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const { service, time, fullName, email, tel, setError, error, resetError } =
    ScheduleStore();

  const { data, isPending } = trpc.scheduleRouter.getSelectedUser.useQuery({
    userId: params.userId,
  });

  function handleNext() {
    if (step === "0") {
      let serviceErrorMessage = "";
      let timeErrorMessage = "";

      if (!service) {
        serviceErrorMessage = "Selecione um serviço para agendar";
      }

      if (!time) {
        timeErrorMessage = "Selecione um horário para agendar";
      }

      if (serviceErrorMessage !== "" || timeErrorMessage !== "") {
        setError({
          ...error,
          service: serviceErrorMessage,
          time: timeErrorMessage,
        });

        return;
      }

      resetError();

      router.push(`/agendar/${params.userId}?step=1`);
    }

    if (step === "1") {
      const zodValidate = clientInformationFormSchema.safeParse({
        fullName,
        email,
        tel,
      });

      if (!zodValidate.success) {
        const errorFormatted = zodValidate.error.format();

        setError({
          ...error,
          fullName: errorFormatted.fullName?._errors[0] ?? "",
          email: errorFormatted.email?._errors[0] ?? "",
          tel: errorFormatted.tel?._errors[0] ?? "",
        });

        return;
      }

      resetError();

      router.push(`/agendar/${params.userId}?step=2`);
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center gap-10 bg-skin-primary py-12 px-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-center text-white">
          Agendamento
        </h1>

        <div className="w-full flex items-center justify-between gap-2 max-w-[250px]">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn(
                    "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                    {
                      "border-white":
                        data && data.user.firstConfigurationStep >= 0,
                    },
                  )}
                >
                  {step === "0" && (
                    <div className="bg-white size-4 rounded-full" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                className="text-skin-primary text-lg font-semibold rounded-xl"
              >
                Selecione o dia e o serviço
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn(
                    "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                    {
                      "border-white":
                        data && data.user.firstConfigurationStep >= 1,
                    },
                  )}
                >
                  {step === "1" && (
                    <div className="bg-white size-4 rounded-full" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                className="text-skin-primary text-lg font-semibold rounded-xl"
              >
                Preencha os dados
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn(
                    "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                    {
                      "border-white":
                        data && data.user.firstConfigurationStep >= 2,
                    },
                  )}
                >
                  {step === "2" && (
                    <div className="bg-white size-4 rounded-full" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                className="text-skin-primary text-lg font-semibold rounded-xl"
              >
                Pagamento do serviço
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn(
                    "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                    {
                      "border-white":
                        data && data.user.firstConfigurationStep >= 3,
                    },
                  )}
                >
                  {step === "3" && (
                    <div className="bg-white size-4 rounded-full" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                className="text-skin-primary text-lg font-semibold rounded-xl"
              >
                Resumo
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger disabled={false}>
                <div
                  className={cn(
                    "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                    {
                      "border-white":
                        data && data.user.firstConfigurationStep >= 3,
                    },
                  )}
                >
                  {step === "4" && (
                    <div className="bg-white size-4 rounded-full" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                className="text-skin-primary text-lg font-semibold rounded-xl"
              >
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
      {step === "1" && <ClientInformationForm />}
      {step === "2" && (
        <ServicePayment paymentPreference={data?.user.paymentPreference} />
      )}

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

          <Button onClick={handleNext} variant="secondary" size="xl">
            Próximo
          </Button>
        </div>
      )}
    </main>
  );
}
