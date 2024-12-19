"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaymentPreference } from "@/app/dashboard/components/payment-preference";
import { Availability } from "../components/availability";
import { Services } from "../components/services";
import { FinishConfigurationMessage } from "../components/finish-configuration-message";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import {
  dayOffType,
  FirstConfigurationStore,
} from "@/stores/first-configuration-store";

function FirstConfigurationComponent() {
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
    setDefaultAvailability,
  } = FirstConfigurationStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  useEffect(() => {
    if (step === null) {
      router.push("/dashboard");
    }
  }, [step]);

  function handleRedirect() {
    if (redirection.next && step) {
      setRedirection({ previous: false, next: false });

      if (parseInt(step) !== 3) {
        router.push(
          `/dashboard/primeira-configuracao?step=${parseInt(step) + 1}`,
        );
      }
    }
  }

  useEffect(() => {
    if (redirection.previous && step) {
      setRedirection({ previous: false, next: false });

      if (parseInt(step) !== 0) {
        router.push(
          `/dashboard/primeira-configuracao?step=${parseInt(step) - 1}`,
        );
      }
    }
  }, [redirection, step, router, setRedirection]);

  const {
    mutate: submitPaymentPreference,
    isPending: isPaymentPreferencePending,
  } = trpc.userRouter.submitPaymentPreference.useMutation({
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
  const { mutate: submitServices, isPending: isServicesPending } =
    trpc.userRouter.submitServices.useMutation({
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

  const pending: boolean =
    isPending ||
    isPaymentPreferencePending ||
    isAvailabilityPending ||
    isServicesPending;

  useEffect(() => {
    if (data) {
      if (data.user.paymentPreference) {
        setPaymentPreference(data.user.paymentPreference);
      }

      if (data.user.pixKey) {
        setPixKey(data.user.pixKey);
      }

      if (data.user.dayOff) {
        const newDayOffs: dayOffType[] = [];

        data.user.dayOff.forEach((day) => {
          switch (day) {
            case "Sunday":
              newDayOffs.push({ value: "Sunday", label: "Domingo" });
              break;
            case "Monday":
              newDayOffs.push({ value: "Monday", label: "Segunda-Feira" });
              break;
            case "Tuesday":
              newDayOffs.push({ value: "Tuesday", label: "Terça-Feira" });
              break;
            case "Wednesday":
              newDayOffs.push({ value: "Wednesday", label: "Quarta-Feira" });
              break;
            case "Thursday":
              newDayOffs.push({ value: "Thursday", label: "Quinta-Feira" });
              break;
            case "Friday":
              newDayOffs.push({ value: "Friday", label: "Sexta-Feira" });
              break;
            case "Saturday":
              newDayOffs.push({ value: "Saturday", label: "Sábado" });
              break;
          }
        });

        setDayOff(newDayOffs);
      }

      if (data.user.availability.length > 0) {
        data.user.availability.forEach((newItem) => {
          const original = availability.find(
            (item) => item.dayOfWeek === newItem.dayOfWeek,
          );

          if (original) {
            setDefaultAvailability(newItem.dayOfWeek, newItem.availableTimes);
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
  }, [
    data,
    setPaymentPreference,
    setPixKey,
    setAvailability,
    setDayOff,
    setDefaultServices,
  ]);

  function handleSubmit() {
    if (step === "0") {
      let paymentPreferenceErrorMessage = "";
      let pixKeyErrorMessage = "";

      if (!paymentPreference) {
        paymentPreferenceErrorMessage =
          "Selecione uma das opções para prosseguir";
      }

      if (
        (!paymentPreference ||
          paymentPreference === "before_after" ||
          paymentPreference === "before") &&
        !pixKey
      ) {
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

        if (dayOff.find((d) => d.value === day) !== undefined) {
          return;
        }

        const { availableTimes } = availability[index];

        availableTimes.forEach((time, idx) => {
          if (time.startTime === "") {
            availabilityErrorMessage.push(
              `O campo "Horário de início - ${idx}" na aba "${label}" precisa ter uma opção selecionada`,
            );
          }

          if (time.endTime === "") {
            availabilityErrorMessage.push(
              `O campo "Horário de término - ${idx}" na aba "${label}" precisa ter uma opção selecionada`,
            );
          }
        });

        const sortedTimes = [...availableTimes].sort(
          (a, b) =>
            parseInt(a.startTime.replace(":", ""), 10) -
            parseInt(b.startTime.replace(":", ""), 10),
        );

        for (let i = 0; i < sortedTimes.length - 1; i++) {
          const currentEndTime = parseInt(
            sortedTimes[i].endTime.replace(":", ""),
            10,
          );
          const nextStartTime = parseInt(
            sortedTimes[i + 1].startTime.replace(":", ""),
            10,
          );

          if (currentEndTime > nextStartTime) {
            availabilityErrorMessage.push(
              `Os horários "${sortedTimes[i].startTime} - ${sortedTimes[i].endTime}" e "${
                sortedTimes[i + 1].startTime
              } - ${sortedTimes[i + 1].endTime}" na aba "${label}" estão sobrepostos.`,
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

      submitAvailability({
        availability,
        dayOff: dayOff.map((d) => d.value) as Array<
          | "Sunday"
          | "Monday"
          | "Tuesday"
          | "Wednesday"
          | "Thursday"
          | "Friday"
          | "Saturday"
        >,
      });

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
      router.push(
        `/dashboard/primeira-configuracao?step=${parseInt(step) - 1}`,
      );

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
    <main className="dashboard-main">
      <div className="dashboard-container min-h-[calc(100vh-72px-24px)] flex flex-col justify-between sm:min-h-[calc(100vh-112px-24px)] lg:min-h-[calc(100vh-24px)]">
        <div className="flex flex-col items-center gap-2 mt-10">
          <h2 className="text-3xl font-bold text-center text-white">
            Configure a sua conta
          </h2>

          <div className="w-full flex items-center justify-between gap-2 max-w-[250px]">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger disabled={pending}>
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
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
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
                  Disponibilidade
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
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
                  Serviços
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={pending}>
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
                  Conclusão
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-grow mt-24">
          {step === "0" && <PaymentPreference isPending={pending} />}
          {step === "1" && <Availability isPending={pending} />}
          {step === "2" && <Services isPending={pending} />}
          {step === "3" && <FinishConfigurationMessage />}
        </div>

        <div className="w-full flex justify-between mt-12 pb-12">
          <Button
            type="button"
            variant="secondary"
            size="xl"
            disabled={step === "0" || pending}
            className={cn(step === "0" && "!opacity-0")}
            onClick={handleBack}
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="xl"
            disabled={pending}
            onClick={handleNext}
          >
            {step === "3" ? <>Ir para dashboard</> : <>Próximo</>}
          </Button>
        </div>
      </div>
    </main>
  );
}

// TODO: remover cursor-pointer quando fizer um hover nas bolinhas dos steps
export default function FirstConfigurationPage() {
  return (
    <Suspense>
      <FirstConfigurationComponent />
    </Suspense>
  );
}
