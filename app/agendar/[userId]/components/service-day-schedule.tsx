import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { formatPrice } from "@/lib/utils";

export function ServiceDaySchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-skin-primary">Selecione o dia e o serviço</h2>

      <div className="w-full flex flex-col items-center gap-12 mt-10">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full sm:w-fit lg:sticky lg:top-16"
        />

        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="service" className="font-semibold">
              Serviço
            </Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">Manutenção - {formatPrice(150.25)}</SelectItem>

                <SelectItem value="2">Reforma - {formatPrice(125.25)}</SelectItem>

                <SelectItem value="3">Pintura - {formatPrice(100.25)}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="time" className="font-semibold">
              Horário disponível
            </Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10:00">10:00</SelectItem>

                <SelectItem value="11:00">11:00</SelectItem>

                <SelectItem value="12:00">12:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
