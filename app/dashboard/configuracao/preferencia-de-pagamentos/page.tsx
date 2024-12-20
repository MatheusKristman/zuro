"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { PaymentPreference } from "../../components/payment-preference";

import { trpc } from "@/lib/trpc-client";
import { FirstConfigurationStore } from "@/stores/first-configuration-store";

export default function PaymentPreferencePage() {
  const router = useRouter();
  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  const {
    paymentPreference,
    setPaymentPreference,
    pixKey,
    setPixKey,
    setConfigurationError,
    configurationError,
    resetConfigurationError,
  } = FirstConfigurationStore();

  const { mutate: submitPaymentPreference, isPending: isPaymentPreferencePending } =
    trpc.userRouter.submitPaymentPreference.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        util.userRouter.getUser.invalidate();
        router.push("/dashboard/configuracao");
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

  function handleSubmit() {
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

  return (
    <main className="dashboard-main">
      <div className="dashboard-container min-h-[calc(100vh-72px-24px)] flex flex-col justify-between sm:min-h-[calc(100vh-112px-24px)] lg:min-h-[calc(100vh-24px)]">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Configurações</h2>

        <div className="flex-grow mt-24">
          <PaymentPreference isPending={pending} />
        </div>

        <div className="w-full flex justify-between mt-12 pb-12">
          <Button variant="secondary" size="xl" disabled={pending} asChild>
            <Link href="/dashboard/configuracao">Voltar</Link>
          </Button>

          <Button variant="secondary" size="xl" disabled={pending} onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      </div>
    </main>
  );
}
