"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";
import {
  dayOffType,
  FirstConfigurationStore,
} from "@/stores/first-configuration-store";

type setTabType =
  | ""
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

interface DayScheduleProps {
  dayOfWeek:
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";
  isPending: boolean;
}

interface AvailabilityProps {
  isPending: boolean;
}

function DaySchedule({ dayOfWeek, isPending }: DayScheduleProps) {
  const { setAvailability, availability, configurationError } =
    FirstConfigurationStore();

  const selectedAvailability = availability.find(
    (item) => item.dayOfWeek === dayOfWeek,
  );
  const hasInterval = selectedAvailability?.hasInterval;

  return (
    <>
      <div className="w-full flex flex-col items-center gap-y-4 mt-6 sm:flex-row sm:gap-x-2">
        <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
          <Label>Horário de início</Label>

          <Select
            value={selectedAvailability?.startTime}
            onValueChange={(value) =>
              setAvailability(dayOfWeek, "startTime", value)
            }
          >
            <SelectTrigger disabled={isPending}>
              <SelectValue placeholder="Selecione o horário de início" />
            </SelectTrigger>

            <SelectContent>
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
          <Label>Horário de término</Label>

          <Select
            value={selectedAvailability?.endTime}
            onValueChange={(value) =>
              setAvailability(dayOfWeek, "endTime", value)
            }
          >
            <SelectTrigger disabled={isPending}>
              <SelectValue placeholder="Selecione o horário de término" />
            </SelectTrigger>

            <SelectContent>
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
      </div>

      <div className="flex gap-2 items-center mt-6">
        <Checkbox
          disabled={isPending}
          id="break"
          value={hasInterval ? "on" : "off"}
          defaultChecked={hasInterval}
          onCheckedChange={(checked) =>
            setAvailability(dayOfWeek, "hasInterval", checked)
          }
        />

        <Label htmlFor="break">Deseja colocar um período de intervalo?</Label>
      </div>

      {/* TODO: adicionar dinamicamente de acordo com o checkbox */}
      {hasInterval && (
        <>
          <div className="w-full bg-black/10 h-px mt-6" />

          <div className="mt-6 w-full flex flex-col gap-4 sm:flex-row sm:gap-2">
            <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
              <Label htmlFor="break-begin">
                Horário de início do intervalo
              </Label>

              <Select
                value={selectedAvailability.startIntervalTime}
                onValueChange={(value) =>
                  setAvailability(dayOfWeek, "startIntervalTime", value)
                }
              >
                <SelectTrigger disabled={isPending}>
                  <SelectValue placeholder="Selecione o horário de início do intervalo" />
                </SelectTrigger>

                <SelectContent>
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
              <Label htmlFor="break-begin">
                Horário de término do intervalo
              </Label>

              <Select
                value={selectedAvailability.endIntervalTime}
                onValueChange={(value) =>
                  setAvailability(dayOfWeek, "endIntervalTime", value)
                }
              >
                <SelectTrigger disabled={isPending}>
                  <SelectValue placeholder="Selecione o horário de término do intervalo" />
                </SelectTrigger>

                <SelectContent>
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
          </div>
        </>
      )}

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

  const {
    dayOff,
    setDayOff,
    setAvailability,
    availability,
    configurationError,
  } = FirstConfigurationStore();

  useEffect(() => {
    console.log({ availability });
  }, [availability]);

  useEffect(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    days.forEach((day) => {
      if (dayOff === "Weekend") {
        setAvailability("Sunday", "startTime", "");
        setAvailability("Sunday", "endTime", "");
        setAvailability("Sunday", "hasInterval", false);
        setAvailability("Sunday", "startIntervalTime", "");
        setAvailability("Sunday", "endIntervalTime", "");
        setAvailability("Saturday", "startTime", "");
        setAvailability("Saturday", "endTime", "");
        setAvailability("Saturday", "hasInterval", false);
        setAvailability("Saturday", "startIntervalTime", "");
        setAvailability("Saturday", "endIntervalTime", "");
      } else if (dayOff === day) {
        setAvailability(day, "startTime", "");
        setAvailability(day, "endTime", "");
        setAvailability(day, "hasInterval", false);
        setAvailability(day, "startIntervalTime", "");
        setAvailability(day, "endIntervalTime", "");
      }
    });
  }, [dayOff, setAvailability]);

  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">
        Disponibilidade
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">Quais dias irá folgar?</h4>

        <Select
          value={dayOff}
          onValueChange={(value) => {
            setDayOff(value as dayOffType);
            setTab("");
          }}
        >
          <SelectTrigger disabled={isPending}>
            <SelectValue placeholder="Selecione os dias" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Weekend">Final de Semana</SelectItem>
            <SelectItem value="Sunday">Domingos</SelectItem>
            <SelectItem value="Monday">Segundas</SelectItem>
            <SelectItem value="Tuesday">Terças</SelectItem>
            <SelectItem value="Wednesday">Quartas</SelectItem>
            <SelectItem value="Thursday">Quintas</SelectItem>
            <SelectItem value="Friday">Sextas</SelectItem>
            <SelectItem value="Saturday">Sábados</SelectItem>
          </SelectContent>
        </Select>

        <span
          className={cn("text-sm text-destructive hidden", {
            block: configurationError.dayOff !== "",
          })}
        >
          {configurationError.dayOff !== "" && configurationError.dayOff}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">
          Selecione os horários que trabalha
        </h4>

        <Tabs
          defaultValue=""
          value={tab}
          onValueChange={(value) => setTab(value as setTabType)}
          className="w-full"
        >
          <TabsList className="w-full flex flex-col h-fit sm:flex-row">
            <TabsTrigger
              value="Sunday"
              disabled={
                isPending || dayOff === "Weekend" || dayOff === "Sunday"
              }
              className="w-full basis-full"
            >
              Domingo
            </TabsTrigger>

            <TabsTrigger
              value="Monday"
              disabled={isPending || dayOff === "Monday"}
              className="w-full basis-full"
            >
              Segunda
            </TabsTrigger>

            <TabsTrigger
              value="Tuesday"
              disabled={isPending || dayOff === "Tuesday"}
              className="w-full basis-full"
            >
              Terça
            </TabsTrigger>

            <TabsTrigger
              value="Wednesday"
              disabled={isPending || dayOff === "Wednesday"}
              className="w-full basis-full"
            >
              Quarta
            </TabsTrigger>

            <TabsTrigger
              value="Thursday"
              disabled={isPending || dayOff === "Thursday"}
              className="w-full basis-full"
            >
              Quinta
            </TabsTrigger>

            <TabsTrigger
              value="Friday"
              disabled={isPending || dayOff === "Friday"}
              className="w-full basis-full"
            >
              Sexta
            </TabsTrigger>

            <TabsTrigger
              value="Saturday"
              disabled={
                isPending || dayOff === "Weekend" || dayOff === "Saturday"
              }
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
