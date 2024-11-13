"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
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
import { FirstConfigurationStore } from "@/stores/first-configuration-store";

export default function FirstConfigurationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get("step");

  const {
    paymentPreference,
    setPaymentPreference,
    pixKey,
    setPixKey,
    setConfigurationError,
    configurationError,
    resetConfigurationError,
  } = FirstConfigurationStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();
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
      router.push("/dashboard/primeira-configuracao?step=1");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const pending: boolean = isPending || isPaymentPreferencePending;

  useEffect(() => {
    if (data) {
      if (data.user.paymentPreference) {
        setPaymentPreference(data.user.paymentPreference);
      }

      if (data.user.pixKey) {
        setPixKey(data.user.pixKey);
      }
    }
  }, [data, setPaymentPreference, setPixKey]);

  function handleBack() {
    if (step) {
      router.push(
        `/dashboard/primeira-configuracao?step=${parseInt(step) - 1}`,
      );
    }
  }

  function handleNext() {
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
    }
  }

  return (
    <main className="h-full lg:absolute lg:top-0 lg:left-[450px] lg:w-[calc(100%-450px)]">
      <div className="w-full h-full max-w-4xl mx-auto flex flex-col justify-between px-6 pt-6 pb-16">
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
          {step === "1" && <Availability />}
          {step === "2" && <Services />}
          {step === "3" && <FinishConfigurationMessage />}
        </div>

        <div className="w-full flex justify-between mt-12">
          <Button
            variant="secondary"
            size="xl"
            disabled={step === "0" || pending}
            className={cn(step === "0" && "!opacity-0")}
            onClick={handleBack}
          >
            Voltar
          </Button>

          <Button
            variant="secondary"
            size="xl"
            disabled={pending}
            onClick={handleNext}
          >
            Próximo
          </Button>
        </div>
      </div>
    </main>
  );
}
