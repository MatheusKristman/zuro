import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function AlertConfigurationPage() {
  // TODO: configurar ou verificar com o cliente sobre essa configuração

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Alerta de Avisos</h2>

        <div className="w-full my-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email-notification" className="font-semibold">
                Notificação por e-mail
              </Label>

              <Switch id="email-notification" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="xl" className="w-full">
                Novo agendamento
              </Button>

              <Button size="xl" className="w-full">
                Agenda do dia
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 sm:flex-row">
            <Button size="xl" variant="outline" className="w-full" asChild>
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            <Button size="xl" className="w-full">
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
