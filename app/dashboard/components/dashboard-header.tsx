"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AlignJustify, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { signOut } from "next-auth/react";

function MobileHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  return (
    <>
      <Link
        href="/dashboard"
        className="relative overflow-hidden size-10 rounded-sm shadow-lg shadow-black/25 sm:size-16"
      >
        <Image src="/logo.svg" alt="Logo" fill className="object-contain object-center " />
      </Link>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending} onClick={() => setIsOpen(true)}>
            <AlignJustify className="!size-7 text-white sm:!size-10" strokeWidth={1.5} />
          </Button>
        </SheetTrigger>

        <SheetContent className="h-full max-h-[600px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center size-24 bg-skin-primary rounded-full overflow-hidden">
                {data && data.user.image ? (
                  <Image src={data.user.image} alt="Foto Perfil" fill className="object-center object-cover" />
                ) : (
                  <UserRound color="#FFF" className="size-12" />
                )}
              </div>

              <span className="text-xl font-bold text-skin-primary">{data?.user.name}</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <Button
              size="xl"
              disabled={pathname === "/dashboard/agenda"}
              className={cn({
                "bg-skin-primary/70 text-white disabled:bg-skin-primary/70 hover:bg-skin-primary/70":
                  pathname === "/dashboard/agenda",
              })}
              onClick={() => setIsOpen(false)}
              asChild
            >
              {pathname === "/dashboard/agenda" ? <span>Agenda</span> : <Link href="/dashboard/agenda">Agenda</Link>}
            </Button>

            <Button
              size="xl"
              disabled={pathname === "/dashboard"}
              className={cn({
                "bg-skin-primary/70 text-white disabled:bg-skin-primary/70 hover:bg-skin-primary/70":
                  pathname === "/dashboard",
              })}
              onClick={() => setIsOpen(false)}
              asChild
            >
              {pathname === "/dashboard" ? <span>Dashboard</span> : <Link href="/dashboard">Dashboard</Link>}
            </Button>

            <Button
              size="xl"
              disabled={pathname === "/dashboard/configuracao"}
              className={cn({
                "bg-skin-primary/70 text-white disabled:bg-skin-primary/70 hover:bg-skin-primary/70":
                  pathname === "/dashboard/configuracao",
              })}
              onClick={() => setIsOpen(false)}
              asChild
            >
              {pathname === "/dashboard/configuracao" ? (
                <span>Configuração</span>
              ) : (
                <Link href="/dashboard/configuracao">Configuração</Link>
              )}
            </Button>

            <Button
              size="xl"
              disabled={pathname === "/dashboard/link-de-compartilhamento"}
              className={cn({
                "bg-skin-primary/70 text-white disabled:bg-skin-primary/70 hover:bg-skin-primary/70":
                  pathname === "/dashboard/link-de-compartilhamento",
              })}
              onClick={() => setIsOpen(false)}
              asChild
            >
              {pathname === "/dashboard/link-de-compartilhamento" ? (
                <span>Link</span>
              ) : (
                <Link href="/dashboard/link-de-compartilhamento">Link</Link>
              )}
            </Button>

            <Button
              size="xl"
              className={cn({
                "bg-skin-primary/70 text-white disabled:bg-skin-primary/70 hover:bg-skin-primary/70":
                  pathname === "/dashboard/conta",
              })}
              onClick={() => setIsOpen(false)}
              asChild
            >
              {pathname === "/dashboard/conta" ? <span>Conta</span> : <Link href="/dashboard/conta">Conta</Link>}
            </Button>
          </div>

          <Button
            onClick={() => signOut({ redirectTo: "/" })}
            size="xl"
            variant="outline"
            className="w-full mt-10 flex items-center gap-2"
          >
            Sair <LogOut />
          </Button>
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
