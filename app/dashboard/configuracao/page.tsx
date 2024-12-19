"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc-client";

export default function DashboardConfigurationPage() {
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
      <div className="dashboard-container mb-12">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Configurações
        </h2>

        <div className="mt-24 w-full flex flex-col gap-6">
          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">
              Preferência de pagamentos
            </span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/preferencia-de-pagamentos">
                Alterar
              </Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">
              Disponibilidade
            </span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/disponibilidade">
                Alterar
              </Link>
            </Button>
          </div>

          <div className="bg-white p-4 rounded-xl w-full flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-skin-primary">
              Serviços prestados
            </span>

            <Button size="xl" asChild>
              <Link href="/dashboard/configuracao/servicos-prestados">
                Alterar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
