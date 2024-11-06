import Image from "next/image";
import Link from "next/link";
import { AlignJustify, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function MobileHeader() {
  return (
    <>
      <Link
        href="/dashboard"
        className="relative overflow-hidden size-10 rounded-sm shadow-lg shadow-black/25 sm:size-16"
      >
        <Image src="/logo.svg" alt="Logo" fill className="object-contain object-center " />
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <AlignJustify className="!size-7 text-white sm:!size-10" strokeWidth={1.5} />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader className="mb-6">
            <SheetTitle className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center size-24 bg-skin-primary rounded-full">
                <UserRound color="#FFF" className="size-12" />
              </div>

              <span className="text-xl font-bold text-skin-primary">Nome Teste</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
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
        </SheetContent>
      </Sheet>
    </>
  );
}

export function DashboardHeader() {
  return (
    <header className="bg-skin-primary w-full px-6 py-4 flex items-center justify-between sm:px-16 sm:py-6 lg:hidden">
      <MobileHeader />
    </header>
  );
}
