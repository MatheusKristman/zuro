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

  if (session.status === "unauthenticated") {
    router.replace("/");
  }

  if (data && !data.user.emailVerified) {
    router.replace("/nova-senha");
  }

  if (data && !data.user.firstAccess) {
    router.replace("/dashboard/primeira-configuracao?step=0");
  }

  console.log({ data });

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
}
