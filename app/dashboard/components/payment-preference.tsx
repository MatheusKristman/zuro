import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      <div className="w-full flex flex-col gap-4 md:flex-row md:items-end lg:flex-col lg:items-start xl:flex-row xl:items-end">
        <div
          className={cn("w-full flex flex-col gap-2", {
            "w-full md:w-[calc(50%-8px)] lg:w-full xl:w-[calc(50%-8px)]":
              paymentPreference === "after" ||
              paymentPreference === "no_payment",
          })}
        >
          <h4 className="text-xl font-semibold text-slate-600">
            Quando pretende receber os pagamentos
          </h4>

          <Select
            value={paymentPreference}
            onValueChange={(value) =>
              setPaymentPreference(
                value as "before_after" | "before" | "after" | "no_payment",
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione como deseja receber os pagamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="before_after">
                Receber Antes ou Depois
              </SelectItem>
              <SelectItem value="before">Receber Antes</SelectItem>
              <SelectItem value="after">Receber Depois</SelectItem>
              <SelectItem value="no_payment">Não Receber Pagamento</SelectItem>
            </SelectContent>
          </Select>

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
          <div className="w-full flex flex-col gap-2">
            <Label
              className="text-xl font-semibold text-slate-600"
              htmlFor="pixCode"
            >
              Chave Pix
            </Label>

            <Input
              id="pixCode"
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
    </div>
  );
}
