"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPhoneNumber } from "react-phone-number-input";
import { Schedule, Service } from "@prisma/client";

import { Calendar } from "@/components/ui/calendar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { trpc } from "@/lib/trpc-client";
import { Loader2 } from "lucide-react";

type ScheduleWithService = Schedule & {
  service: Service;
};

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<ScheduleWithService[]>([]);

  const { mutate: getSchedulesByDate, isPending } =
    trpc.userRouter.getSchedulesByDate.useMutation({
      onSuccess: (res) => {
        setSchedules(res.schedules);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  const { mutate: cancelSchedule, isPending: isCancelSchedulePending } =
    trpc.userRouter.cancelSchedule.useMutation({
      onSuccess: () => {
        if (date !== undefined) {
          getSchedulesByDate({ date: format(date, "yyyy-MM-dd") });
        }
      },
      onError: (err) => {
        console.error(err);
      },
    });

  const pending = isCancelSchedulePending || isPending;

  function seeReceipt(url: string) {
    window.open(url, "_blank")?.focus();
  }

  useEffect(() => {
    if (date !== undefined) {
      getSchedulesByDate({ date: format(date, "yyyy-MM-dd") });
    }
  }, [date, getSchedulesByDate]);

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <div className="w-full flex flex-col items-center gap-12 mb-12 mt-10 lg:flex-row lg:items-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();

              today.setHours(0, 0, 0, 0);

              return date < today;
            }}
            className="rounded-md border w-full sm:w-fit lg:sticky lg:top-16"
          />

          {isPending ? (
            <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-2 items-center justify-center">
              <Loader2 size={50} className="animate-spin text-skin-primary" />

              <span className="text-lg font-semibold text-center text-skin-primary">
                Carregando agendamentos...
              </span>
            </div>
          ) : (
            date &&
            (schedules.length > 0 ? (
              <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-6">
                <h3 className="text-xl font-semibold">
                  Dia: {format(date, "PPPP", { locale: ptBR })}
                </h3>

                <div className="w-full">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col gap-6"
                  >
                    {schedules
                      .sort((a, b) => {
                        if (
                          a.status === "cancelled" &&
                          b.status !== "cancelled"
                        ) {
                          return 1;
                        }

                        if (
                          a.status !== "cancelled" &&
                          b.status === "cancelled"
                        ) {
                          return -1;
                        }

                        return 0;
                      })
                      .map((schedule, index) => (
                        <AccordionItem
                          value={`item-${index}`}
                          key={`schedule-${index}`}
                          className="border-0 bg-skin-primary rounded-2xl p-4"
                        >
                          <AccordionTrigger className="w-full">
                            <div className="flex flex-col gap-2">
                              {schedule.status === "cancelled" && (
                                <span className="w-fit text-sm bg-red-500 font-medium rounded-lg !leading-none text-white flex items-center p-2">
                                  Cancelado
                                </span>
                              )}

                              <div className="flex items-center gap-4">
                                <span className="text-xl bg-white rounded-xl text-skin-primary flex items-center justify-center p-2">
                                  {schedule.time}
                                </span>

                                <span className="text-lg font-semibold text-white">
                                  {schedule.fullName}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="border-t border-t-white/25 w-full py-4 flex flex-col gap-10">
                            <div className="w-full flex flex-col gap-4">
                              <div className="w-full flex flex-col gap-4">
                                <div className="flex gap-1">
                                  <span className="text-white font-medium text-base">
                                    Nome Completo:
                                  </span>

                                  <span className="text-white font-bold text-base">
                                    {schedule.fullName}
                                  </span>
                                </div>

                                <div className="flex gap-1">
                                  <span className="text-white font-medium text-base">
                                    Horário:
                                  </span>

                                  <span className="text-white font-bold text-base">
                                    {schedule.time}
                                  </span>
                                </div>

                                <div className="flex gap-1">
                                  <span className="text-white font-medium text-base">
                                    Serviço:
                                  </span>

                                  <span className="text-white font-bold text-base">
                                    {schedule.service.name}
                                  </span>
                                </div>

                                <div className="flex gap-1">
                                  <span className="text-white font-medium text-base">
                                    Telefone:
                                  </span>

                                  <span className="text-white font-bold text-base">
                                    {formatPhoneNumber(schedule.tel)}
                                  </span>
                                </div>

                                <div className="flex gap-1">
                                  <span className="text-white font-medium text-base">
                                    E-mail:
                                  </span>

                                  <span className="text-white font-bold text-base">
                                    {schedule.email}
                                  </span>
                                </div>
                              </div>

                              {schedule.message ? (
                                <div className="bg-black/20 w-full rounded-xl p-4 flex flex-col gap-1">
                                  <span className="text-white font-medium text-base">
                                    Mensagem:
                                  </span>

                                  {/* TODO: receber array de string para fazer os paragrafos */}
                                  <p className="text-white font-bold text-base">
                                    {schedule.message}
                                  </p>
                                </div>
                              ) : (
                                <div className="bg-black/20 w-full rounded-xl p-4 flex flex-col gap-1">
                                  <p className="text-white font-bold text-base">
                                    Sem mensagem
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="w-full flex flex-col gap-4 sm:flex-row">
                              <Button
                                size="xl"
                                variant="secondary"
                                disabled={
                                  !schedule.receiptUrl ||
                                  schedule.paymentMethod === "after" ||
                                  pending
                                }
                                className="sm:w-1/2"
                                onClick={() => seeReceipt(schedule.receiptUrl!)}
                              >
                                Baixar comprovante
                              </Button>

                              <Button
                                size="xl"
                                variant="destructive"
                                disabled={
                                  schedule.status === "cancelled" || pending
                                }
                                className="sm:w-1/2"
                                onClick={() =>
                                  cancelSchedule({ scheduleId: schedule.id })
                                }
                              >
                                Cancelar agendamento
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-6">
                <span className="text-lg font-semibold text-foreground/50">
                  Sem agendamentos
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
