"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Services } from "../../components/services";

import { FirstConfigurationStore } from "@/stores/first-configuration-store";
import { trpc } from "@/lib/trpc-client";

export default function ServicesPage() {
  const router = useRouter();

  const { services, setDefaultServices, setConfigurationError, configurationError, resetConfigurationError } =
    FirstConfigurationStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  const { mutate: submitServices, isPending: isServicesPending } = trpc.userRouter.submitServices.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      util.userRouter.getUser.invalidate();
      router.push("/dashboard/configuracao");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const pending: boolean = isPending || isServicesPending;

  useEffect(() => {
    if (data) {
      if (data.user.services.length > 0) {
        const newServices = data.user.services.map((service) => ({
          name: service.name,
          minutes: service.minutes,
          price: service.price,
        }));

        setDefaultServices(newServices);
      }
    }
  }, [data, setDefaultServices]);

  function handleSubmit() {
    let servicesError = "";

    if (services.length === 0) {
      servicesError = "É preciso ter ao menos um serviço cadastrado";
    }

    if (servicesError !== "") {
      setConfigurationError({
        ...configurationError,
        services: servicesError,
      });

      return;
    }

    resetConfigurationError();

    submitServices({ services });

    return;
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container min-h-[calc(100vh-72px-24px)] flex flex-col justify-between sm:min-h-[calc(100vh-112px-24px)] lg:min-h-[calc(100vh-24px)]">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Configurações</h2>

        <div className="flex-grow mt-24">
          <Services isPending={pending} />
        </div>

        <div className="w-full flex justify-between mt-12 pb-12">
          <Button variant="secondary" size="xl" disabled={pending} asChild>
            <Link href="/dashboard/configuracao">Voltar</Link>
          </Button>

          <Button variant="secondary" size="xl" disabled={pending} onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      </div>
    </main>
  );
}
