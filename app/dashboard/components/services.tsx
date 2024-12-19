"use client";

import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FirstConfigurationStore } from "@/stores/first-configuration-store";
import { formatPrice } from "@/lib/utils";

interface ServicesProps {
  isPending: boolean;
}

export function Services({ isPending }: ServicesProps) {
  const [name, setName] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [price, setPrice] = useState<string | undefined>();

  const {
    services,
    setServices,
    deleteService,
    setConfigurationError,
    resetConfigurationError,
    configurationError,
  } = FirstConfigurationStore();

  function handleMinutes(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim().replace(/[^0-9]/g, "");

    setMinutes(value);
  }

  function addService() {
    let nameError = "";
    let minutesError = "";
    let priceError = "";

    if (name === "") {
      nameError = 'Campo "Nome do serviço" é obrigatório';
    }

    if (services.find((service) => service.name === name)) {
      nameError = "Nome do serviço já registrado";
    }

    if (minutes === "") {
      minutesError = 'Campo "Tempo em Minutos" é obrigatório';
    }

    if (price === "" || price === undefined) {
      priceError = 'Campo "Preço" é obrigatório';
    }

    if (minutes === "0" || Number(minutes) < 0) {
      minutesError = "Valor inválido";
    }

    if (Number(price) < 0) {
      priceError = "Valor inválido";
    }

    if (nameError !== "" || minutesError !== "" || priceError !== "") {
      setConfigurationError({
        ...configurationError,
        serviceName: nameError,
        serviceMinutes: minutesError,
        servicePrice: priceError,
      });

      console.log({ nameError, minutesError, priceError });

      return;
    }

    resetConfigurationError();

    setServices({
      name,
      minutes: parseInt(minutes),
      price: parseFloat(price as string),
    });

    setName("");
    setMinutes("");
    setPrice(undefined);
  }

  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">
        Serviços prestados
      </h3>

      <div className="w-full flex flex-col gap-10">
        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="service-name">
              Nome do serviço
            </Label>

            <Input
              id="service-name"
              disabled={isPending}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Insira o nome do serviço"
            />

            {configurationError.serviceName && (
              <span className="text-sm text-destructive">
                {configurationError.serviceName}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label
              className="font-bold text-slate-600"
              htmlFor="service-minutes"
            >
              Tempo em Minutos
            </Label>

            <Input
              id="service-minutes"
              disabled={isPending}
              value={minutes}
              onChange={handleMinutes}
              placeholder="Insira o tempo de realização do serviço"
            />

            {configurationError.serviceMinutes && (
              <span className="text-sm text-destructive">
                {configurationError.serviceMinutes}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="service-price">
              Preço
            </Label>

            <CurrencyInput
              className="flex h-12 w-full rounded-xl border border-skin-primary/40 bg-background px-3 py-2 text-sm ring-0 ring-offset-0 outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-skin-primary disabled:cursor-not-allowed disabled:opacity-50"
              id="service-price"
              placeholder="Insira o preço do serviço"
              disabled={isPending}
              decimalsLimit={2}
              value={price}
              onValueChange={(value) => setPrice(value)}
            />

            {configurationError.servicePrice && (
              <span className="text-sm text-destructive">
                {configurationError.servicePrice}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={addService}
          disabled={isPending}
          className="w-fit"
          size="xl"
        >
          Adicionar
        </Button>

        <div className="w-full h-px bg-black/10" />

        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={`service-${index}`}
                className="relative w-full bg-skin-primary rounded-xl px-6 py-4 flex flex-col gap-2 group"
              >
                <span className="text-white font-semibold text-2xl">
                  {service.name}
                </span>

                <span className="font-medium text-lg text-white">
                  Tempo: {service.minutes}Min
                </span>

                <span className="font-medium text-lg text-white">
                  Valor: {formatPrice(service.price)}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 opacity-100 lg:opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={isPending}
                  onClick={() => deleteService(service.name)}
                >
                  <Trash2 className="size-8 shrink-0 text-white" />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center sm:col-span-2">
              <span className="text-xl font-semibold text-muted-foreground/70">
                Nenhum serviço cadastrado
              </span>
            </div>
          )}

          {configurationError.services && (
            <span className="text-sm text-center text-destructive sm:col-span-2">
              {configurationError.services}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
