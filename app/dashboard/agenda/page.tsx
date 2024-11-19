"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPhoneNumber } from "react-phone-number-input";

import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const SCHEDULES = [
  {
    fullName: "Ana Souza",
    time: "14:30",
    service: "Consultoria de Visto",
    tel: "+5511912341234",
    email: "ana.souza@email.com",
    message: "Gostaria de mais informações sobre o processo de solicitação.",
  },
  {
    fullName: "Carlos Lima",
    time: "10:00",
    service: "Renovação de Passaporte",
    tel: "+5511987654321",
    email: "carlos.lima@email.com",
    message: "Preciso renovar meu passaporte com urgência.",
  },
  {
    fullName: "Beatriz Silva",
    time: "16:45",
    service: "Solicitação de ESTA",
    tel: "+5511934567890",
    email: "beatriz.silva@email.com",
    message: "Tenho dúvidas sobre os requisitos para o ESTA.",
  },
  {
    fullName: "Rafael Almeida",
    time: "09:15",
    service: "Orientação para entrevista",
    tel: "+5511923456789",
    email: "rafael.almeida@email.com",
    message: "Gostaria de agendar uma orientação para a entrevista do visto.",
  },
  {
    fullName: "Juliana Costa",
    time: "13:00",
    service: "Tradução de Documentos",
    tel: "+5511998765432",
    email: "juliana.costa@email.com",
    message: "Preciso traduzir alguns documentos para o processo de visto.",
  },
  {
    fullName: "Marcos Oliveira",
    time: "11:30",
    service: "Solicitação de Visto",
    tel: "+5511976543210",
    email: "marcos.oliveira@email.com",
    message: "Gostaria de ajuda para preencher o formulário DS-160.",
  },
  {
    fullName: "Fernanda Pereira",
    time: "17:00",
    service: "Tradução de Documentos",
    tel: "+5511932187654",
    email: "fernanda.pereira@email.com",
    message: "Preciso traduzir um certificado acadêmico para inglês.",
  },
  {
    fullName: "Lucas Mendes",
    time: "08:45",
    service: "Consultoria de Visto",
    tel: "+5511992345678",
    email: "lucas.mendes@email.com",
    message: "Quais os passos para tirar um visto de turista?",
  },
  {
    fullName: "Patrícia Almeida",
    time: "15:15",
    service: "Renovação de Passaporte",
    tel: "+5511967854321",
    email: "patricia.almeida@email.com",
    message: "Meu passaporte venceu, como renovar?",
  },
  {
    fullName: "Rodrigo Nascimento",
    time: "12:00",
    service: "Orientação para entrevista",
    tel: "+5511934567891",
    email: "rodrigo.nascimento@email.com",
    message: "Preciso de dicas para a entrevista do visto de trabalho.",
  },
];

// TODO: criar uma classe no globals.css para os mains e divs
export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <div className="w-full flex flex-col items-center gap-12 mb-12 mt-10 lg:flex-row lg:items-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full sm:w-fit lg:sticky lg:top-16"
          />

          {date && (
            <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-6">
              <h3 className="text-xl font-semibold">Dia: {format(date, "PPPP", { locale: ptBR })}</h3>

              <div className="w-full">
                <Accordion type="single" collapsible className="flex flex-col gap-6">
                  {/* TODO: quando cancelado, jogar para o ultimo da lista */}

                  {SCHEDULES.map((schedule, index) => (
                    <AccordionItem
                      value={`item-${index}`}
                      key={`schedule-${index}`}
                      className="border-0 bg-skin-primary rounded-2xl p-4"
                    >
                      <AccordionTrigger className="w-full">
                        <div className="flex flex-col gap-2">
                          {index === 3 && (
                            <span className="w-fit text-sm bg-red-500 font-medium rounded-lg !leading-none text-white flex items-center p-2">
                              Cancelado
                            </span>
                          )}

                          <div className="flex items-center gap-4">
                            <span className="text-xl bg-white rounded-xl text-skin-primary flex items-center justify-center p-2">
                              {schedule.time}
                            </span>

                            <span className="text-lg font-semibold text-white">{schedule.fullName}</span>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="border-t border-t-white/25 w-full py-4 flex flex-col gap-10">
                        <div className="w-full flex flex-col gap-4">
                          <div className="w-full flex flex-col gap-4">
                            <div className="flex gap-1">
                              <span className="text-white font-medium text-base">Nome Completo:</span>

                              <span className="text-white font-bold text-base">{schedule.fullName}</span>
                            </div>

                            <div className="flex gap-1">
                              <span className="text-white font-medium text-base">Horário:</span>

                              <span className="text-white font-bold text-base">{schedule.time}</span>
                            </div>

                            <div className="flex gap-1">
                              <span className="text-white font-medium text-base">Serviço:</span>

                              <span className="text-white font-bold text-base">{schedule.service}</span>
                            </div>

                            <div className="flex gap-1">
                              <span className="text-white font-medium text-base">Telefone:</span>

                              <span className="text-white font-bold text-base">{formatPhoneNumber(schedule.tel)}</span>
                            </div>

                            <div className="flex gap-1">
                              <span className="text-white font-medium text-base">E-mail:</span>

                              <span className="text-white font-bold text-base">{schedule.email}</span>
                            </div>
                          </div>

                          <div className="bg-black/20 w-full rounded-xl p-4 flex flex-col gap-1">
                            <span className="text-white font-medium text-base">Mensagem:</span>

                            {/* TODO: receber array de string para fazer os paragrafos */}
                            <p className="text-white font-bold text-base">{schedule.message}</p>
                          </div>
                        </div>

                        <div className="w-full flex flex-col gap-4 sm:flex-row">
                          <Button size="xl" variant="secondary" disabled={false} className="sm:w-1/2">
                            Baixar comprovante
                          </Button>
                          <Button size="xl" variant="destructive" disabled={false} className="sm:w-1/2">
                            Cancelar agendamento
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
