"use client";

import { useSession } from "next-auth/react";

import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();

  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  if (isPending) {
    console.log("Carregando com skeletons");
  }

  console.log(isPending);

  if (session.status === "unauthenticated") {
    router.replace("/");
  }

  if (data && !data.user.emailVerified) {
    console.log("Redirecionar para mudar senha");
    router.replace("/nova-senha");
  }

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
}
