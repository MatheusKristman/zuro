"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Services() {
  const [name, setName] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  function handleMinutes(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim().replace(/[^0-9]/g, "");

    setMinutes(value);
  }

  useEffect(() => {
    console.log({ name, minutes, price });
  }, [name, minutes, price]);

  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">Serviços prestados</h3>

      <div className="w-full flex flex-col gap-10">
        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="service-name">Nome do serviço</Label>

            <Input
              id="service-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Insira o nome do serviço"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="service-minutes">Tempo em Minutos</Label>

            <Input
              id="service-minutes"
              value={minutes}
              onChange={handleMinutes}
              placeholder="Insira o tempo de realização do serviço"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="service-price">Preço</Label>

            <Input
              id="service-price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Insira o preço do serviço"
            />
          </div>
        </div>

        <Button className="w-fit" size="xl">
          Adicionar
        </Button>

        {/* TODO: adicionar as boxes do serviço dinamicamente */}
        <div className="w-full h-px bg-black/10" />

        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <div className="w-full bg-skin-primary rounded-xl px-6 py-4 flex flex-col gap-2">
            <span className="text-white font-semibold text-2xl">Serviço teste</span>

            <span className="font-medium text-lg text-white">Tempo: 190Min</span>

            <span className="font-medium text-lg text-white">Valor: R$290,00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
