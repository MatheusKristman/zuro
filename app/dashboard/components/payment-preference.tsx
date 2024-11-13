import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import { FirstConfigurationStore } from "@/stores/first-configuration-store";

interface PaymentPreferenceProps {
  isPending: boolean;
}

export function PaymentPreference({ isPending }: PaymentPreferenceProps) {
  const {
    configurationError,
    setPixKey,
    pixKey,
    paymentPreference,
    setPaymentPreference,
  } = FirstConfigurationStore();

  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">
        Preferência de Pagamento
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">
          Quando pretende receber os pagamentos
        </h4>

        <div className="grid grid-cols-1 grid-rows-[auto] gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Button
            variant={
              paymentPreference === "before_after" ? "default" : "outline"
            }
            size="xl"
            onClick={() => setPaymentPreference("before_after")}
            disabled={isPending}
          >
            Receber Antes ou Depois
          </Button>

          <Button
            variant={paymentPreference === "before" ? "default" : "outline"}
            size="xl"
            onClick={() => setPaymentPreference("before")}
            disabled={isPending}
          >
            Receber Antes
          </Button>

          <Button
            variant={paymentPreference === "after" ? "default" : "outline"}
            size="xl"
            onClick={() => setPaymentPreference("after")}
            disabled={isPending}
          >
            Receber Depois
          </Button>
        </div>

        <span
          className={cn("text-sm text-destructive hidden", {
            block: configurationError.paymentPreference !== "",
          })}
        >
          {configurationError.paymentPreference !== "" &&
            configurationError.paymentPreference}
        </span>
      </div>

      {(paymentPreference === "before_after" ||
        paymentPreference === "before") && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Chave Pix</h4>

          <Input
            placeholder="Cadastre a sua chave pix"
            className={cn(
              configurationError.pixKey !== "" && "border-destructive",
            )}
            onChange={(e) => setPixKey(e.target.value)}
            value={pixKey}
            disabled={isPending}
          />

          <span
            className={cn("text-sm text-destructive hidden", {
              block: configurationError.pixKey !== "",
            })}
          >
            {configurationError.pixKey !== "" && configurationError.pixKey}
          </span>
        </div>
      )}
    </div>
  );
}
