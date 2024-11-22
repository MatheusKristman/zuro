"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { trpc } from "@/lib/trpc-client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();

  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  if (isPending) {
    return (
      <nav className="w-[450px] min-h-screen p-6 hidden lg:fixed lg:top-0 lg:left-0 lg:flex lg:flex-col">
        <div className="bg-black/30 rounded-2xl p-6 w-full flex-grow flex flex-col justify-between">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center size-24 shrink-0 rounded-full overflow-hidden">
                <Skeleton className="w-full h-full bg-skin-primary" />
              </div>

              <Skeleton className="h-7 w-40 bg-skin-primary" />
            </div>

            <div className="w-full flex flex-col gap-4">
              <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />

              <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />

              <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />

              <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />

              <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />
            </div>
          </div>

          <Skeleton className="w-full h-12 bg-skin-primary rounded-xl" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-[450px] min-h-screen p-6 hidden lg:fixed lg:top-0 lg:left-0 lg:flex lg:flex-col">
      <div className="bg-black/30 rounded-2xl p-6 w-full flex-grow flex flex-col justify-between">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center size-24 shrink-0 bg-skin-primary rounded-full overflow-hidden">
              {data && data.user.image ? (
                <Image src={data.user.image} alt="Foto Perfil" fill className="object-center object-cover" />
              ) : (
                <UserRound color="#FFF" className="size-12" />
              )}
            </div>

            <span className="text-xl font-bold text-white">{data?.user.name}</span>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Button
              size="xl"
              disabled={pathname === "/dashboard/agenda"}
              className={cn({
                "bg-white text-skin-primary disabled:bg-white hover:bg-white": pathname === "/dashboard/agenda",
              })}
              asChild
            >
              {pathname === "/dashboard/agenda" ? <span>Agenda</span> : <Link href="/dashboard/agenda">Agenda</Link>}
            </Button>

            <Button
              size="xl"
              disabled={pathname === "/dashboard"}
              className={cn({
                "bg-white text-skin-primary disabled:bg-white hover:bg-white": pathname === "/dashboard",
              })}
              asChild
            >
              {pathname === "/dashboard" ? <span>Dashboard</span> : <Link href="/dashboard">Dashboard</Link>}
            </Button>

            <Button
              size="xl"
              disabled={pathname === "/dashboard/configuracao"}
              className={cn({
                "bg-white text-skin-primary disabled:bg-white hover:bg-white": pathname === "/dashboard/configuracao",
              })}
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
                "bg-white text-skin-primary disabled:bg-white hover:bg-white":
                  pathname === "/dashboard/link-de-compartilhamento",
              })}
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
                "bg-white text-skin-primary disabled:bg-white hover:bg-white": pathname === "/dashboard/conta",
              })}
              asChild
            >
              {pathname === "/dashboard/conta" ? <span>Conta</span> : <Link href="/dashboard/conta">Conta</Link>}
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
