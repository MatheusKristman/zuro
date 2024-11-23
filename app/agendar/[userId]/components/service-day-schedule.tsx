import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { formatPrice } from "@/lib/utils";
import { ScheduleStore } from "@/stores/schedule-store";
import { trpc } from "@/lib/trpc-client";
import { format } from "date-fns";
import { Availability, Schedule, Service, User } from "@prisma/client";
import { setEnvironmentData } from "worker_threads";

interface ServiceDayScheduleProps {
  user: (User & { services: Service[]; availability: Availability[]; schedules: Schedule[] }) | undefined;
}

export function ServiceDaySchedule({ user }: ServiceDayScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { service, setService, time, setTime } = ScheduleStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.scheduleRouter.getDaySchedule.useQuery({
    date: format(date!, "dd/MM/yyyy"),
    serviceId: service,
  });

  const pending = isPending;

  useEffect(() => {
    function generateAvailableSlots() {
      const dateSelected = format(date!, "EEEE");
      const availabilitySelected = user?.availability.filter((avail) => avail.dayOfWeek === dateSelected)[0];
      const serviceSelected = user?.services.filter((serv) => serv.id === service)[0];
      const startHour = availabilitySelected?.startTime;
      const endHour = availabilitySelected?.endTime;
      const interval = serviceSelected?.minutes;

      // TODO: criar função para gerar os horários
    }

    if (service) {
      util.scheduleRouter.getDaySchedule.invalidate({ date: format(date!, "dd/MM/yyyy"), serviceId: service });
    }
  }, [service]);

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-skin-primary">Selecione o dia e o serviço</h2>

      <div className="w-full flex flex-col items-center gap-12 mt-10">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={pending}
          className="rounded-md border w-full sm:w-fit lg:sticky lg:top-16"
        />

        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="service" className="font-semibold">
              Serviço
            </Label>

            <Select value={service} onValueChange={setService} disabled={pending}>
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
          </div>

          <div className="flex flex-col gap-2 sm:w-full">
            <Label htmlFor="time" className="font-semibold">
              Horário disponível
            </Label>

            <Select value={time} onValueChange={setTime} disabled={service === "" || pending}>
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
