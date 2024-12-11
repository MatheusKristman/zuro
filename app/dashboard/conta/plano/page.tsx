import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Dot } from "lucide-react";
import Link from "next/link";

export default function PlanPage() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Informações do plano
        </h2>

        <div className="w-full mt-10 mb-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                Pagamento Mensal
              </span>

              <span className="text-xl text-white font-bold text-center">
                {formatPrice(1200)}
              </span>
            </div>

            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                Lucro Mensal
              </span>

              <span className="text-xl text-white font-bold text-center">
                {formatPrice(1000)}
              </span>
            </div>

            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                Tempo Economizado em Média Mensal
              </span>

              <span className="text-xl text-white font-bold text-center">
                1200 Hrs
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <Button size="xl" variant="outline" className="w-full" asChild>
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            {/* TODO: adicionar link do whatsapp para suporte */}
            <Button size="xl" className="w-full">
              Suporte
            </Button>

            <Button size="xl" variant="destructive" className="w-full">
              Cancelar plano
            </Button>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full h-px bg-muted" />

            <div className="w-full flex flex-col items-center justify-center sm:flex-row">
              <a
                href="https://zuroagenda.com/termos-de-uso/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-base text-center font-semibold text-skin-primary underline"
              >
                Termos de uso
              </a>

              <Dot className="text-muted-foreground" />

              <a
                href="https://zuroagenda.com/politicas-de-privacidade/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-base text-center font-semibold text-skin-primary underline"
              >
                Políticas de privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
