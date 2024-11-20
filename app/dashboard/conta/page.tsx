import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Configuração da conta</h2>

        <div className="mt-24 w-full flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Alterar senha</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/alterar-senha">Alterar</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Alterar nome ou e-mail</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/alterar-dados">Alterar</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Alterar foto</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/alterar-foto">Alterar</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Plano</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/plano">Informações</Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Envio de avisos</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/envio-de-avisos">Configurar</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
