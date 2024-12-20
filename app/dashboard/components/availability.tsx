"use client";

import { useEffect, useState } from "react";
import ReactSelect from "react-select";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import { dayOffType, FirstConfigurationStore } from "@/stores/first-configuration-store";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type setTabType = "" | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

type dayOffOptions = {
  label: string;
  value: string;
};

interface DayScheduleProps {
  dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  isPending: boolean;
}

const dayOffOptions: dayOffType[] = [
  { value: "Monday", label: "Segunda-feira" },
  { value: "Tuesday", label: "Terça-feira" },
  { value: "Wednesday", label: "Quarta-feira" },
  { value: "Thursday", label: "Quinta-feira" },
  { value: "Friday", label: "Sexta-feira" },
  { value: "Saturday", label: "Sábado" },
  { value: "Sunday", label: "Domingo" },
];

interface AvailabilityProps {
  isPending: boolean;
}

function DaySchedule({ dayOfWeek, isPending }: DayScheduleProps) {
  const { setAvailability, addAvailableTime, removeAvailableTime, availability, configurationError } =
    FirstConfigurationStore();

  const selectedAvailability = availability.find((item) => item.dayOfWeek === dayOfWeek);

  return (
    <>
      {selectedAvailability?.availableTimes.map((time, index) => (
        <div
          key={`availableTime-${index}`}
          className="w-full flex flex-col items-center gap-y-4 mt-6 sm:flex-row sm:items-end sm:gap-x-2"
        >
          <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
            <Label className="text-slate-600 font-bold">Horário de início</Label>

            <Select
              value={time?.startTime}
              onValueChange={(value) => setAvailability(dayOfWeek, index, "startTime", value)}
            >
              <SelectTrigger disabled={isPending}>
                <SelectValue placeholder="Selecione o horário de início" />
              </SelectTrigger>

              <SelectContent className="max-h-52">
                <SelectItem value="01:00">01:00</SelectItem>
                <SelectItem value="02:00">02:00</SelectItem>
                <SelectItem value="03:00">03:00</SelectItem>
                <SelectItem value="04:00">04:00</SelectItem>
                <SelectItem value="05:00">05:00</SelectItem>
                <SelectItem value="06:00">06:00</SelectItem>
                <SelectItem value="07:00">07:00</SelectItem>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="09:00">09:00</SelectItem>
                <SelectItem value="10:00">10:00</SelectItem>
                <SelectItem value="11:00">11:00</SelectItem>
                <SelectItem value="12:00">12:00</SelectItem>
                <SelectItem value="13:00">13:00</SelectItem>
                <SelectItem value="14:00">14:00</SelectItem>
                <SelectItem value="15:00">15:00</SelectItem>
                <SelectItem value="16:00">16:00</SelectItem>
                <SelectItem value="17:00">17:00</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="19:00">19:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
                <SelectItem value="21:00">21:00</SelectItem>
                <SelectItem value="22:00">22:00</SelectItem>
                <SelectItem value="23:00">23:00</SelectItem>
                <SelectItem value="00:00">00:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
            <Label className="text-slate-600 font-bold">Horário de término</Label>

            <Select
              value={time?.endTime}
              onValueChange={(value) => setAvailability(dayOfWeek, index, "endTime", value)}
            >
              <SelectTrigger disabled={isPending}>
                <SelectValue placeholder="Selecione o horário de término" />
              </SelectTrigger>

              <SelectContent className="max-h-52">
                <SelectItem value="01:00">01:00</SelectItem>
                <SelectItem value="02:00">02:00</SelectItem>
                <SelectItem value="03:00">03:00</SelectItem>
                <SelectItem value="04:00">04:00</SelectItem>
                <SelectItem value="05:00">05:00</SelectItem>
                <SelectItem value="06:00">06:00</SelectItem>
                <SelectItem value="07:00">07:00</SelectItem>
                <SelectItem value="08:00">08:00</SelectItem>
                <SelectItem value="09:00">09:00</SelectItem>
                <SelectItem value="10:00">10:00</SelectItem>
                <SelectItem value="11:00">11:00</SelectItem>
                <SelectItem value="12:00">12:00</SelectItem>
                <SelectItem value="13:00">13:00</SelectItem>
                <SelectItem value="14:00">14:00</SelectItem>
                <SelectItem value="15:00">15:00</SelectItem>
                <SelectItem value="16:00">16:00</SelectItem>
                <SelectItem value="17:00">17:00</SelectItem>
                <SelectItem value="18:00">18:00</SelectItem>
                <SelectItem value="19:00">19:00</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
                <SelectItem value="21:00">21:00</SelectItem>
                <SelectItem value="22:00">22:00</SelectItem>
                <SelectItem value="23:00">23:00</SelectItem>
                <SelectItem value="00:00">00:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className={cn("w-full shrink-0 h-12 sm:w-12 rounded-xl", index === 0 && "!opacity-0")}
            disabled={index === 0}
            size="icon"
            variant="destructive"
            onClick={() => removeAvailableTime(dayOfWeek, index)}
          >
            <Trash2 size={24} />
          </Button>
        </div>
      ))}

      <Button size="xl" variant="outline" className="mt-6" onClick={() => addAvailableTime(dayOfWeek)}>
        Adicionar novos horários
      </Button>

      {configurationError.availability.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {configurationError.availability.map((error, index) => (
            <li className="text-sm text-destructive" key={`error-${index}`}>
              - {error}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function Availability({ isPending }: AvailabilityProps) {
  const [tab, setTab] = useState<setTabType>("");
  const [hydrated, setHydrated] = useState<boolean>(false);

  const { dayOff, setDayOff, resetAvailableTime, configurationError } = FirstConfigurationStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    days.forEach((day) => {
      if (dayOff.find((d) => d.value === day) !== undefined) {
        resetAvailableTime(day as "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday");
      }
    });
  }, [dayOff, resetAvailableTime]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">Disponibilidade</h3>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold text-slate-600">Quais dias irá folgar?</h4>

        <ReactSelect
          isMulti
          value={dayOff}
          onChange={(selectedOptions) => setDayOff(selectedOptions as dayOffType[])}
          options={dayOffOptions}
          classNames={{
            control: () =>
              "!flex !py-[5px] !w-full !items-center !justify-between !rounded-xl !border !border-skin-primary/40 !bg-background !outline-none !transition focus:!border-skin-primary disabled:!cursor-not-allowed disabled:!opacity-50",
            multiValue: () => "!bg-skin-primary !text-white",
            multiValueLabel: () => "!text-white",
          }}
        />

        <span
          className={cn("text-sm text-destructive hidden", {
            block: configurationError.dayOff !== "",
          })}
        >
          {configurationError.dayOff !== "" && configurationError.dayOff}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold text-slate-600">Selecione os horários que trabalha</h4>

        <Tabs defaultValue="" value={tab} onValueChange={(value) => setTab(value as setTabType)} className="w-full">
          <TabsList className="w-full flex flex-col h-fit sm:flex-row">
            <TabsTrigger
              value="Sunday"
              disabled={isPending || dayOff.find((d) => d.value === "Sunday") !== undefined}
              className="w-full basis-full"
            >
              Domingo
            </TabsTrigger>

            <TabsTrigger
              value="Monday"
              disabled={isPending || dayOff.find((d) => d.value === "Monday") !== undefined}
              className="w-full basis-full"
            >
              Segunda
            </TabsTrigger>

            <TabsTrigger
              value="Tuesday"
              disabled={isPending || dayOff.find((d) => d.value === "Tuesday") !== undefined}
              className="w-full basis-full"
            >
              Terça
            </TabsTrigger>

            <TabsTrigger
              value="Wednesday"
              disabled={isPending || dayOff.find((d) => d.value === "Wednesday") !== undefined}
              className="w-full basis-full"
            >
              Quarta
            </TabsTrigger>

            <TabsTrigger
              value="Thursday"
              disabled={isPending || dayOff.find((d) => d.value === "Thursday") !== undefined}
              className="w-full basis-full"
            >
              Quinta
            </TabsTrigger>

            <TabsTrigger
              value="Friday"
              disabled={isPending || dayOff.find((d) => d.value === "Friday") !== undefined}
              className="w-full basis-full"
            >
              Sexta
            </TabsTrigger>

            <TabsTrigger
              value="Saturday"
              disabled={isPending || dayOff.find((d) => d.value === "Saturday") !== undefined}
              className="w-full basis-full"
            >
              Sábado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Sunday">
            <DaySchedule dayOfWeek="Sunday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Monday">
            <DaySchedule dayOfWeek="Monday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Tuesday">
            <DaySchedule dayOfWeek="Tuesday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Wednesday">
            <DaySchedule dayOfWeek="Wednesday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Thursday">
            <DaySchedule dayOfWeek="Thursday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Friday">
            <DaySchedule dayOfWeek="Friday" isPending={isPending} />
          </TabsContent>

          <TabsContent value="Saturday">
            <DaySchedule dayOfWeek="Saturday" isPending={isPending} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
