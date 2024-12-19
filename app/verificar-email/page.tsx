"use client";

import { trpc } from "@/lib/trpc-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function EmailVerifyComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { data, isPending } = trpc.userRouter.verifyEmail.useQuery({ id });

  useEffect(() => {
    if (data !== undefined) {
      if (data.redirect) {
        toast.success("E-mail verificado com sucesso");

        router.push("/");
      } else {
        toast.error("Ocorreu um erro ao ativar sua conta, tente novamente mais tarde");

        router.push("/");
      }
    }
  }, [data]);

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-background py-12 px-6">
      <div className="w-full flex flex-col items-center gap-2 bg-white rounded-3xl p-6 max-w-[450px]">
        <Loader2 strokeWidth={1.5} className="animate-spin text-skin-primary size-20" />

        <span className="text-skin-primary text-center text-2xl font-bold lg:text-3xl">
          {isPending ? "Aguarde um momento..." : "Redirecionando..."}
        </span>
      </div>
    </main>
  );
}

export default function EmailVerifyPage() {
  return (
    <Suspense>
      <EmailVerifyComponent />
    </Suspense>
  );
}
