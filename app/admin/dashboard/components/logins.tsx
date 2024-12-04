"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Search, UserRound } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Logins() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 60),
  });

  return (
    <div className="w-full bg-white rounded-3xl px-4 py-3 flex flex-col gap-6">
      <div className="w-full flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="xl"
              className={cn(
                "w-full sm:w-fit",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="xl" variant="outline">
              <Search />
              Pesquisar
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col gap-4 rounded-2xl">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pesquisa" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Faça a sua pesquisa" />

            <Button size="xl">
              <Search />
              Pesquisar
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="id-1"
          className="border-0 bg-skin-primary rounded-2xl"
        >
          <AccordionTrigger className="px-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full overflow-hidden flex items-center justify-center",
                  "bg-white",
                )}
              >
                <UserRound className="text-skin-primary" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <h4 className="text-lg font-semibold text-white">John Doe</h4>

                <div className="h-[2px] w-full bg-white/50" />

                <span className="text-base font-semibold text-white">
                  {format(new Date(), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-base text-white font-bold">CPF:</span>

                <span className="text-base text-white">123.123.123-12</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base text-white font-bold">E-mail:</span>

                <span className="text-base text-white">teste@teste.com</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base text-white font-bold">
                  Data de cadastro:
                </span>

                <span className="text-base text-white">
                  {format(new Date(), "dd/MM/yyyy - HH:mm")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base text-white font-bold">Plano:</span>

                <span className="text-base text-white">30 dias</span>

                <span className="bg-green-500 p-1 rounded-sm text-white text-center font-semibold">
                  Ativo
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button size="xl" variant="confirm" className="w-full">
                Aplicar desconto
              </Button>

              <Button size="xl" variant="destructive" className="w-full">
                Cancelar plano
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
