"use client";

import { useSession } from "next-auth/react";

import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();

  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  useEffect(() => {
    if (isPending) {
      console.log("Carregando com skeletons");
    }
  }, [isPending]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/");
    }

    if (data && !data.user.emailVerified) {
      router.replace("/nova-senha");
    }

    if (data && !data.user.firstAccess) {
      router.replace("/dashboard/primeira-configuracao?step=0");
    }
  }, [session, data, router]);

  console.log({ data });

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
}
