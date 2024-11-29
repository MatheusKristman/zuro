import { toast } from "sonner";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Availability, Schedule, Service, User } from "@prisma/client";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { trpc } from "@/lib/trpc-client";
import { formatPrice } from "@/lib/utils";
import { ScheduleStore } from "@/stores/schedule-store";

type dayScheduleType = Schedule & {
  service: Service;
};

interface ServiceDayScheduleProps {
  user:
    | (User & {
        services: Service[];
        availability: Availability[];
        schedules: Schedule[];
      })
    | undefined;
}

export function ServiceDaySchedule({ user }: ServiceDayScheduleProps) {
  const [availableTime, setAvailableTime] = useState<Array<string>>([]);
  const [daySchedule, setDaySchedule] = useState<dayScheduleType[]>([]);

  const { service, setService, time, setTime, date, setDate, error } =
    ScheduleStore();

  const { mutate: getDaySchedule, isPending } =
    trpc.scheduleRouter.getDaySchedule.useMutation({
      onSuccess: (res) => {
        console.log({ daySchedules: res.schedules });
        setDaySchedule(res.schedules);
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const pending = isPending;

  useEffect(() => {
    console.log({ error });
  }, [error]);

  useEffect(() => {
    if (service && date !== undefined) {
      getDaySchedule({
        date: format(date!, "yyyy-MM-dd"),
        serviceId: service,
      });
    }
  }, [service, getDaySchedule, date]);

  useEffect(() => {
    function generateAvailableSlots(dateUsed: string, dayOfWeek: string) {
      const availabilitySelected = user?.availability.filter(
        (avail) => avail.dayOfWeek === dayOfWeek,
      )[0];

      if (availabilitySelected === undefined) {
        toast.error("Sem disponibilidade nesse dia");

        return [];
      }

      const startHour = Number(availabilitySelected.startTime.split(":")[0]);
      const endHour = Number(availabilitySelected.endTime.split(":")[0]);
      const interval = 30;
      const allSlots = [];

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          allSlots.push(
            `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
          );
        }
      }

      console.log({ allSlots });

      const occupiedSlots = new Set<string>();

      daySchedule.forEach(({ time, service: { minutes } }) => {
        const [startHour, startMinute] = time.split(":").map(Number);
        const totalDuration = minutes;

        for (let time = 0; time < totalDuration; time += interval) {
          const selectedDate = new Date(dateUsed);

          console.log({ selectedDate });

          selectedDate!.setHours(startHour, startMinute + time);

          const occupiedTime = selectedDate!.toTimeString().substring(0, 5);

          occupiedSlots.add(occupiedTime);
        }
      });

      console.log({ occupiedSlots });
      console.log({ allSlots });

      const availableSlots = allSlots.filter(
        (slot) => !occupiedSlots.has(slot),
      );

      console.log({ availableSlots });

      return availableSlots;
    }

    if (date !== undefined) {
      const availableSlots = generateAvailableSlots(
        format(date!, "yyyy-MM-dd"),
        format(date!, "EEEE"),
      );

      setAvailableTime(availableSlots);
      setTime("");
    }
  }, [daySchedule]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-skin-primary">
        Selecione o dia e o serviço
      </h2>

      <div className="w-full flex flex-col items-center gap-12 mt-10">
        <div className="w-full flex flex-col items-center gap-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();

              today.setHours(0, 0, 0, 0);

              return date < today || pending;
            }}
            className="rounded-md border w-full sm:w-fit lg:sticky lg:top-16"
          />

          {error.date && (
            <span className="text-sm text-destructive">{error.date}</span>
          )}
        </div>

        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="service" className="font-semibold">
              Serviço
            </Label>

            <Select
              value={service}
              onValueChange={setService}
              disabled={pending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>

              <SelectContent>
                {user && user.services.length > 0 ? (
                  user.services.map((serv) => (
                    <SelectItem key={serv.id} value={serv.id}>
                      {serv.name} - {formatPrice(serv.price)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="0">
                    Nenhum serviço disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {error.service && (
              <span className="text-sm text-destructive">{error.service}</span>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="time" className="font-semibold">
              Horário disponível
            </Label>

            <Select
              value={time}
              onValueChange={setTime}
              disabled={service === "" || pending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>

              <SelectContent>
                {availableTime.length > 0 ? (
                  availableTime.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="No-Availability"
                    value="No-Availability"
                    disabled
                  >
                    Sem horário disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {error.time && (
              <span className="text-sm text-destructive">{error.time}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
