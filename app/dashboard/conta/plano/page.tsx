"use client";

import { BadgeCheck, Dot, Loader2, Lock, MoveRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { trpc } from "@/lib/trpc-client";
import { formatPrice } from "@/lib/utils";

interface CancelPlanConfirmationProps {
  cancelPlan: () => void;
  isPending: boolean;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function CancelPlanConfirmation({
  cancelPlan,
  isPending,
  isOpen,
  setOpen,
}: CancelPlanConfirmationProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} size="xl" variant="destructive">
          Cancelar Plano
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja cancelar o plano?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Você está prestes a cancelar o plano atual. Ao cancelar o plano, ele
            será encerrado imediatamente, e você não será cobrado na próxima
            fatura. Caso mude de ideia, poderá contratar um novo plano a
            qualquer momento. Deseja continuar com o cancelamento?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setOpen(false)}
            className={buttonVariants({ size: "xl", variant: "outline" })}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={cancelPlan}
            className={buttonVariants({ size: "xl", variant: "destructive" })}
          >
            Confirmar
            {isPending && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PlanComponent() {
  const [isOpen, setOpen] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout");
  const trpcUtils = trpc.useUtils();

  const { data, isPending } = trpc.userRouter.getPlanDetails.useQuery();

  const { mutate: reactivatePlan, isPending: isReactivatingPlan } =
    trpc.userRouter.reactivatePlan.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
        }

        toast.success(res.message);

        router.push("/dashboard/conta/plano");
        trpcUtils.userRouter.getPlanDetails.invalidate();
      },
      onError: (err) => {
        console.error(err);

        toast.error(
          "Ocorreu um erro ao reativar o plano, entre em contato com o suporte",
        );
      },
    });
  const { mutate: cancelPlan, isPending: isCancellingPlan } =
    trpc.userRouter.cancelPlan.useMutation({
      onSuccess: (res) => {
        toast.success(res.message);

        setOpen(false);

        router.push("/dashboard/conta");
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao cancelar o plano");
      },
    });

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (checkoutId) {
      reactivatePlan({ checkoutId });
    }
  }, [checkoutId, reactivatePlan]);

  function handleCancelPlan() {
    if (data !== undefined && data.plan) {
      cancelPlan({ subscriptionId: data.plan.subscriptionId });
    } else {
      toast.error("Ocorreu um erro ao cancelar o plano");
    }
  }

  if (isReactivatingPlan) {
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <div className="w-full mt-10 flex flex-col items-center gap-4">
          <Loader2 size={100} className="animate-spin text-white" />

          <span className="text-3xl font-bold text-white text-center max-w-sm">
            Reativando plano, aguarde um momento...
          </span>
        </div>
      </div>
    </main>;
  }

  if (isPending) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-container flex flex-col justify-between">
          <h2 className="text-3xl font-bold text-center text-white mt-10">
            Informações do plano
          </h2>

          <div className="w-full mt-10 mb-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
            <div className="w-full flex flex-col items-center gap-4 md:flex-row">
              <Skeleton className="h-24 rounded-2xl w-full" />

              <Skeleton className="h-24 rounded-2xl w-full" />

              <Skeleton className="h-24 rounded-2xl w-full" />
            </div>

            <div className="w-full flex flex-col items-center gap-4 md:grid md:grid-cols-2">
              <Skeleton className="w-full h-12 rounded-xl" />

              <Skeleton className="w-full h-12 rounded-xl" />

              <Skeleton className="w-full h-12 rounded-xl md:col-span-2" />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="w-full h-px bg-muted" />

              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <a
                  href="https://zuroagenda.com/termos-de-uso/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base text-center font-semibold text-skin-primary underline"
                >
                  Termos de uso
                </a>

                <Dot className="text-muted-foreground" />

                <a
                  href="https://zuroagenda.com/politicas-de-privacidade/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base text-center font-semibold text-skin-primary underline"
                >
                  Políticas de privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NOTE: para caso de não ter plano ativo
  if (!data || !data.plan) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-container flex flex-col justify-between">
          <h2 className="text-3xl font-bold text-center text-white mt-10">
            Reative o seu plano
          </h2>

          <div className="w-full mt-10 mb-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="w-full p-4 bg-skin-primary rounded-2xl flex flex-col justify-between gap-4">
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex justify-center">
                      <div className="bg-black/20 size-20 rounded-full flex items-center justify-center">
                        <svg
                          className="size-12 fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                      <h4 className="text-2xl font-bold text-white">
                        Autônomos
                      </h4>

                      <ul className="w-full flex flex-col gap-2">
                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Agendamentos Automáticos
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Lembretes Integrados
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Dashboard Completo
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Link Personalizado para Clientes
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Configurações Flexíveis
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Acessível em Qualquer Hora
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Facilidade de Uso
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Experiencia do Cliente Elevada
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Mais Tempo Livre
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Mais Organização
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center gap-4">
                    <span className="text-sm text-white font-medium text-center">
                      de{" "}
                      <strong className="line-through font-medium">
                        R$157,90
                      </strong>{" "}
                      por apenas R$127,90
                    </span>

                    <form
                      className="w-full"
                      action="/api/reactivate-checkout-session"
                      method="POST"
                    >
                      <Button
                        type="submit"
                        role="link"
                        size="xl"
                        variant="secondary"
                        className="w-full"
                      >
                        Contratar
                      </Button>
                    </form>

                    <div className="w-full flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Lock size={14} className="text-white" />

                        <span className="text-sm text-white font-medium">
                          Compra segura
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <BadgeCheck size={14} className="text-white" />

                        <span className="text-sm text-white font-medium">
                          Satisfação garantida
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full p-4 bg-skin-primary rounded-2xl flex flex-col justify-between gap-4">
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex justify-center">
                      <div className="bg-black/20 size-20 rounded-full flex items-center justify-center">
                        <svg
                          className="size-12 fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                      <h4 className="text-2xl font-bold text-white">
                        Empresas
                      </h4>

                      <ul className="w-full flex flex-col gap-2">
                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Agendamentos Automáticos
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Lembretes Integrados
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Dashboard Completo
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Link Personalizado para Clientes
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Configurações Flexíveis
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Acessível em Qualquer Hora
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Facilidade de Uso
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Experiencia do Cliente Elevada
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Mais Tempo Livre
                          </span>
                        </li>

                        <li className="flex items-center gap-2">
                          <MoveRight color="#FFF" />

                          <span className="text-base text-white font-medium">
                            Mais Organização
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center gap-4">
                    {/* <span className="text-sm text-white font-medium text-center"> */}
                    {/*   de{" "} */}
                    {/*   <strong className="line-through font-medium"> */}
                    {/*     R$157,90 */}
                    {/*   </strong>{" "} */}
                    {/*   por apenas R$127,90 */}
                    {/* </span> */}

                    <Button size="xl" variant="secondary" className="w-full">
                      Pedir orçamento
                    </Button>

                    <div className="w-full flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Lock size={14} className="text-white" />

                        <span className="text-sm text-white font-medium">
                          Compra segura
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <BadgeCheck size={14} className="text-white" />

                        <span className="text-sm text-white font-medium">
                          Satisfação garantida
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2">
                <Button size="xl" variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/conta">Voltar</Link>
                </Button>

                <Button size="xl" className="w-full" asChild>
                  <a
                    href={process.env.NEXT_PUBLIC_WHATSAPP_LINK!}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Suporte
                  </a>
                </Button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="w-full h-px bg-muted" />

              <div className="w-full flex flex-col items-center justify-center sm:flex-row">
                <a
                  href="https://zuroagenda.com/termos-de-uso/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base text-center font-semibold text-skin-primary underline"
                >
                  Termos de uso
                </a>

                <Dot className="text-muted-foreground" />

                <a
                  href="https://zuroagenda.com/politicas-de-privacidade/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-base text-center font-semibold text-skin-primary underline"
                >
                  Políticas de privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Informações do plano
        </h2>

        <div className="w-full mt-10 mb-10 p-6 bg-white rounded-3xl flex flex-col gap-12">
          <div className="w-full flex flex-col items-center gap-4 md:flex-row">
            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                {data.plan.name}
              </span>

              <span className="text-xl text-white font-bold text-center">
                {formatPrice(data.plan.price / 100)}
              </span>
            </div>

            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                Data de contratação
              </span>

              <span className="text-xl text-white font-bold text-center">
                {data.plan.hiredDate}
              </span>
            </div>

            <div className="w-full bg-skin-primary p-4 rounded-2xl flex flex-col gap-1">
              <span className="text-lg text-white font-semibold text-center">
                Proximo pagamento
              </span>

              <span className="text-xl text-white font-bold text-center">
                {data.plan.nextPayment}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-4 md:grid md:grid-cols-2">
            <Button size="xl" variant="outline" className="w-full" asChild>
              <Link href="/dashboard/conta">Voltar</Link>
            </Button>

            <Button
              size="xl"
              className="w-full md:order-3 md:col-span-2"
              asChild
            >
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_LINK!}
                target="_blank"
                rel="noreferrer noopener"
              >
                Suporte
              </a>
            </Button>

            <CancelPlanConfirmation
              cancelPlan={handleCancelPlan}
              isPending={isCancellingPlan}
              isOpen={isOpen}
              setOpen={setOpen}
            />
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full h-px bg-muted" />

            <div className="w-full flex flex-col items-center justify-center sm:flex-row">
              <a
                href="https://zuroagenda.com/termos-de-uso/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-base text-center font-semibold text-skin-primary underline"
              >
                Termos de uso
              </a>

              <Dot className="text-muted-foreground" />

              <a
                href="https://zuroagenda.com/politicas-de-privacidade/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-base text-center font-semibold text-skin-primary underline"
              >
                Políticas de privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlanComponent />
    </Suspense>
  );
}
