import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DashboardConfigurationPage() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-container mb-12">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Configurações</h2>

        <div className="mt-24 w-full flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Preferência de pagamentos</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/preferencia-de-pagamentos">Alterar</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Disponibilidade</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/disponibilidade">Alterar</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Serviços prestados</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/servicos-prestados">Alterar</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
