import { Button } from "@/components/ui/button";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

export function DashboardNav() {
  return (
    <nav className="w-[450px] min-h-screen p-6 hidden lg:fixed lg:top-0 lg:left-0 lg:flex lg:flex-col">
      <div className="bg-black/30 rounded-2xl p-6 w-full flex-grow flex flex-col justify-between">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center size-24 bg-skin-primary rounded-full">
              <UserRound color="#FFF" className="size-12" />
            </div>

            <span className="text-xl font-bold text-white">Nome Teste</span>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Button size="xl" asChild>
              <Link href="/dashboard/agenda">Agenda</Link>
            </Button>

            <Button size="xl" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao">Configuração</Link>
            </Button>

            <Button size="xl" asChild>
              <Link href="/dashboard/link-de-compartilhamento">Link</Link>
            </Button>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta">Conta</Link>
            </Button>
          </div>
        </div>

        <Button size="xl" variant="secondary" className="flex items-center gap-2">
          Sair <LogOut />
        </Button>
      </div>
    </nav>
  );
}
