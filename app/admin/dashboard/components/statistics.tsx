"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Roboto_Flex } from "next/font/google";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, formatPrice } from "@/lib/utils";

const RobotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: "600",
});

export function Statistics() {
  const today = new Date();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [clientsPaying, setClientsPaying] = useState<number>(0);
  const [clientsCancelled, setClientsCancelled] = useState<string>("");
  const [favoritePlan, setFavoritePlan] = useState<string>("");
  const [totalSchedules, setTotalSchedules] = useState<number>(0);
  const [clientsAccessTime, setClientsAccessTime] = useState<string>("");

  const hasDate = date && date.from !== undefined && date.to !== undefined;

  return (
    <div className="w-full bg-white rounded-3xl px-4 py-3 flex flex-col gap-6">
      <div className="w-full p-4 rounded-2xl bg-skin-primary flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <span className="text-2xl text-white font-semibold text-center">
          Resumo do Mês
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className={cn(!date && "text-skin-primary/70")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date && date.from && date.to ? (
                `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
              ) : (
                <span>Mudar mês</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar mode="range" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full mt-10">
        <div className="w-full flex flex-col items-center gap-6">
          <span className="text-3xl uppercase tracking-wider text-skin-primary text-center">
            {date && date.from
              ? format(date.from, "MMMM | yyyy", { locale: ptBR })
              : "Selecione o período que deseja visualizar"}
          </span>

          <span
            className={cn(
              "text-6xl uppercase text-skin-primary font-bold",
              RobotoFlex.className,
            )}
          >
            <small className="text-base text-skin-primary font-bold">R$</small>{" "}
            {hasDate
              ? formatPrice(totalEarned).substring(3)
              : formatPrice(0).substring(3)}
          </span>
        </div>

        <div className="w-full grid grid-cols-1 gap-4 mt-10 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
            <span className="text-lg font-semibold text-white text-center">
              Clientes Pagantes
            </span>

            <span className="text-2xl font-bold text-white text-center">
              {hasDate && clientsPaying ? clientsPaying : "Sem clientes"}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
            <span className="text-lg font-semibold text-white text-center">
              Clientes Cancelados
            </span>

            <span className="text-2xl font-bold text-white text-center capitalize">
              {hasDate && clientsCancelled ? clientsCancelled : "Sem Serviço"}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
            <span className="text-lg font-semibold text-white text-center">
              Plano Preferido
            </span>

            <span className="text-2xl font-bold text-white text-center capitalize">
              {hasDate && favoritePlan
                ? format(favoritePlan, "EEEE", { locale: ptBR })
                : "Sem data"}
            </span>
          </div>

          <div className="w-full flex flex-col gap-4 sm:flex-row sm:col-span-3">
            <div className="flex flex-col items-center justify-between gap-2 bg-skin-primary p-4 rounded-xl sm:w-1/2 sm:col-span-2">
              <span className="text-lg font-semibold text-white text-center">
                Agendamentos Realizados
              </span>

              <span className="text-2xl font-bold text-white text-center capitalize">
                {hasDate && favoritePlan
                  ? format(favoritePlan, "EEEE", { locale: ptBR })
                  : "Sem data"}
              </span>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 bg-skin-primary p-4 rounded-xl sm:w-1/2 sm:col-span-2">
              <span className="text-lg font-semibold text-white text-center">
                Tempo Médio dos Clientes Na Plataforma
              </span>

              <span className="text-2xl font-bold text-white text-center capitalize">
                {hasDate && favoritePlan
                  ? format(favoritePlan, "EEEE", { locale: ptBR })
                  : "Sem data"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
