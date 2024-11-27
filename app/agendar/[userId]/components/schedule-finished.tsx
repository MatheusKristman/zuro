import { Check } from "lucide-react";

export function ScheduleFinished() {
  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
      <div className="w-full flex flex-col items-center gap-12">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-skin-primary flex items-center justify-center">
              <Check size={70} color="#FFF" />
            </div>

            <h2 className="text-3xl font-semibold text-skin-primary text-center">
              Seu agendamento foi realizado com sucesso!
            </h2>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <h3 className="text-xl font-semibold text-center">
              Resumo do agendamento
            </h3>

            <div className="w-full flex flex-col items-center gap-4 bg-black/10 rounded-xl p-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center">
                  Profissional
                </span>

                <span className="text-2xl font-bold text-center">
                  Nome teste
                </span>
              </div>

              <div className="w-full h-px bg-foreground/10" />

              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center">
                  Data e horário do agendamento
                </span>

                <span className="text-2xl font-bold text-center">
                  23/10/2024 às 10:30
                </span>
              </div>

              <div className="w-full h-px bg-foreground/10" />

              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-center">Serviço</span>

                <span className="text-2xl font-bold text-center">
                  Manutenção
                </span>
              </div>
            </div>
          </div>

          <div className="w-full p-4 rounded-xl bg-amber-100">
            <span className="font-semibold text-amber-600 text-center w-full block">
              Pode fechar a aba
            </span>
          </div>
        </div>

        {/* TODO: confirmar se tem como salvar o agendamento no google calendar de graça */}
        {/* <Button size="xl" className="w-full"> */}
        {/*   Salvar no Google Agenda */}
        {/* </Button> */}
      </div>
    </div>
  );
}
