"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PaymentPreference } from "@/app/dashboard/components/payment-preference";
import { Availability } from "../components/availability";
import { Services } from "../components/services";
import { FinishConfigurationMessage } from "../components/finish-configuration-message";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { FirstConfigurationStore } from "@/stores/first-configuration-store";

export default function FirstConfigurationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get("step");

  const {
    redirection,
    setRedirection,
    paymentPreference,
    setPaymentPreference,
    pixKey,
    setPixKey,
    dayOff,
    setDayOff,
    availability,
    setAvailability,
    services,
    setDefaultServices,
    setConfigurationError,
    configurationError,
    resetConfigurationError,
  } = FirstConfigurationStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  function handleRedirect() {
    if (redirection.previous && step) {
      setRedirection({ previous: false, next: false });

      if (parseInt(step) !== 0) {
        router.push(`/dashboard/primeira-configuracao?step=${parseInt(step) - 1}`);
      }
    }

    if (redirection.next && step) {
      setRedirection({ previous: false, next: false });

      if (parseInt(step) !== 3) {
        router.push(`/dashboard/primeira-configuracao?step=${parseInt(step) + 1}`);
      }
    }
  }

  const { mutate: submitPaymentPreference, isPending: isPaymentPreferencePending } =
    trpc.userRouter.submitPaymentPreference.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        util.userRouter.getUser.invalidate();
        handleRedirect();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const { mutate: submitAvailability, isPending: isAvailabilityPending } =
    trpc.userRouter.submitAvailability.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        util.userRouter.getUser.invalidate();
        handleRedirect();
      },
    });
  const { mutate: submitServices, isPending: isServicesPending } = trpc.userRouter.submitServices.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      util.userRouter.getUser.invalidate();
      handleRedirect();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const pending: boolean = isPending || isPaymentPreferencePending || isAvailabilityPending || isServicesPending;

  useEffect(() => {
    if (data) {
      if (data.user.paymentPreference) {
        setPaymentPreference(data.user.paymentPreference);
      }

      if (data.user.pixKey) {
        setPixKey(data.user.pixKey);
      }

      if (data.user.dayOff) {
        setDayOff(data.user.dayOff);
      }

      if (data.user.availability.length > 0) {
        data.user.availability.forEach((newItem) => {
          const original = availability.find((item) => item.dayOfWeek === newItem.dayOfWeek);

          if (original) {
            setAvailability(newItem.dayOfWeek, "startTime", newItem.startTime);
            setAvailability(newItem.dayOfWeek, "endTime", newItem.endTime);
            setAvailability(newItem.dayOfWeek, "hasInterval", newItem.hasInterval);
            setAvailability(
              newItem.dayOfWeek,
              "startIntervalTime",
              newItem.startIntervalTime ? newItem.startIntervalTime : ""
            );
            setAvailability(
              newItem.dayOfWeek,
              "endIntervalTime",
              newItem.endIntervalTime ? newItem.endIntervalTime : ""
            );
          }
        });
      }

      if (data.user.services.length > 0) {
        const newServices = data.user.services.map((service) => ({
          name: service.name,
          minutes: service.minutes,
          price: service.price,
        }));

        setDefaultServices(newServices);
      }
    }
  }, [data, setPaymentPreference, setPixKey]);

  function handleSubmit() {
    if (step === "0") {
      let paymentPreferenceErrorMessage = "";
      let pixKeyErrorMessage = "";

      if (!paymentPreference) {
        paymentPreferenceErrorMessage = "Selecione uma das opções para prosseguir";
      }

      if ((!paymentPreference || paymentPreference === "before_after" || paymentPreference === "before") && !pixKey) {
        pixKeyErrorMessage = "O campo não pode estar vazio";
      }

      if (pixKeyErrorMessage !== "" || paymentPreferenceErrorMessage !== "") {
        setConfigurationError({
          ...configurationError,
          pixKey: pixKeyErrorMessage,
          paymentPreference: paymentPreferenceErrorMessage,
        });
        return;
      }

      resetConfigurationError();

      submitPaymentPreference({ paymentPreference, pixKey });

      return;
    }

    if (step === "1") {
      let dayOffErrorMessage = "";
      const availabilityErrorMessage: string[] = [];

      if (!dayOff) {
        dayOffErrorMessage = "Selecione uma das opções para prosseguir!";
      }

      const daysOfWeek = [
        { day: "Sunday", label: "Domingo" },
        { day: "Monday", label: "Segunda" },
        { day: "Tuesday", label: "Terça" },
        { day: "Wednesday", label: "Quarta" },
        { day: "Thursday", label: "Quinta" },
        { day: "Friday", label: "Sexta" },
        { day: "Saturday", label: "Sábado" },
      ];

      daysOfWeek.forEach((dayObj, index) => {
        const { day, label } = dayObj;

        if ((dayOff === "Weekend" && (day === "Saturday" || day === "Sunday")) || dayOff === day) {
          return;
        }

        const { startTime, endTime, hasInterval, startIntervalTime, endIntervalTime } = availability[index];

        if (startTime === "") {
          availabilityErrorMessage.push(
            `O campo "Horário de início" na aba "${label}" precisa ter uma opção selecionada`
          );
        }

        if (endTime === "") {
          availabilityErrorMessage.push(
            `O campo "Horário de término" na aba "${label}" precisa ter uma opção selecionada`
          );
        }

        if (hasInterval) {
          if (startIntervalTime === "") {
            availabilityErrorMessage.push(
              `O campo "Horário de início do intervalo" na aba "${label}" precisa ter uma opção selecionada`
            );
          }

          if (endIntervalTime === "") {
            availabilityErrorMessage.push(
              `O campo "Horário de término do intervalo" na aba "${label}" precisa ter uma opção selecionada`
            );
          }
        }
      });

      if (dayOffErrorMessage !== "" || availabilityErrorMessage.length !== 0) {
        setConfigurationError({
          ...configurationError,
          dayOff: dayOffErrorMessage,
          availability: availabilityErrorMessage,
        });

        return;
      }

      resetConfigurationError();

      submitAvailability({ availability, dayOff });

      return;
    }

    if (step === "2") {
      let servicesError = "";

      if (services.length === 0) {
        servicesError = "É preciso ter ao menos um serviço cadastrado";
      }

      if (servicesError !== "") {
        setConfigurationError({
          ...configurationError,
          services: servicesError,
        });

        return;
      }

      resetConfigurationError();

      submitServices({ services });
    }
  }

  function handleBack() {
    if (step === "0") {
      return;
    }

    if (step === "3") {
      router.push(`/dashboard/primeira-configuracao?step=${parseInt(step) - 1}`);

      return;
    }

    setRedirection({ previous: true, next: false });

    handleSubmit();
  }

  function handleNext() {
    if (step === "3") {
      router.push("/dashboard");

      return;
    }

    setRedirection({ previous: false, next: true });

    handleSubmit();
  }

  return (
    <main className="h-full px-6 pt-6 overflow-auto lg:absolute lg:top-0 lg:left-[450px] lg:w-[calc(100%-450px)]">
      <div className="w-full h-full max-w-4xl mx-auto flex flex-col justify-between ">
        <div className="flex flex-col items-center gap-2 mt-10">
          <h2 className="text-3xl font-bold text-center text-white">Configure a sua conta</h2>

          <div className="w-full flex items-center justify-between gap-2 max-w-[250px]">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger disabled={pending}>
                  <div
                    className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                      "border-white": data && data.user.firstConfigurationStep >= 0,
                    })}
                  >
                    {step === "0" && <div className="bg-white size-4 rounded-full" />}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
                  <div
                    className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                      "border-white": data && data.user.firstConfigurationStep >= 1,
                    })}
                  >
                    {step === "1" && <div className="bg-white size-4 rounded-full" />}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Disponibilidade
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
                  <div
                    className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                      "border-white": data && data.user.firstConfigurationStep >= 2,
                    })}
                  >
                    {step === "2" && <div className="bg-white size-4 rounded-full" />}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Serviços
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
                  <div
                    className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center", {
                      "border-white": data && data.user.firstConfigurationStep >= 3,
                    })}
                  >
                    {step === "3" && <div className="bg-white size-4 rounded-full" />}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Conclusão
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-grow mt-24">
          {step === "0" && <PaymentPreference isPending={pending} />}
          {step === "1" && <Availability />}
          {step === "2" && <Services />}
          {step === "3" && <FinishConfigurationMessage />}
        </div>

        <div className="w-full flex justify-between mt-12 pb-12">
          <Button
            variant="secondary"
            size="xl"
            disabled={step === "0" || pending}
            className={cn(step === "0" && "!opacity-0")}
            onClick={handleBack}
          >
            Voltar
          </Button>

          <Button variant="secondary" size="xl" disabled={pending} onClick={handleNext}>
            {step === "3" ? <>Ir para dashboard</> : <>Próximo</>}
          </Button>
        </div>
      </div>
    </main>
  );
}
