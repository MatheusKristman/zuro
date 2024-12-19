"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { trpc } from "@/lib/trpc-client";

export default function AccountPage() {
  const { data } = trpc.userRouter.getUser.useQuery();

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/");
    }

    if (data && data.user.role === "USER" && !data.user.firstAccess) {
      router.replace("/dashboard/primeira-configuracao?step=0");
    }
  }, [data, session, router]);

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between mb-12">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Configuração da conta</h2>

        <div className="mt-10 w-full flex flex-col gap-6">
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

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">Modo férias</span>

            <Button size="xl" asChild>
              <Link href="/dashboard/conta/modo-ferias">Configurar</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
