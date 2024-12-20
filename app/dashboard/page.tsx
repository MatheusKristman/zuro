"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DateRange } from "react-day-picker";
import { Roboto_Flex } from "next/font/google";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { trpc } from "@/lib/trpc-client";
import { cn, formatPrice } from "@/lib/utils";

const RobotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: "600",
});

export default function Dashboard() {
  const today = new Date();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });
  const [clientsAttended, setClientsAttended] = useState<number>(0);
  const [mostFrequentService, setMostFrequentService] = useState<string>("");
  const [mostFrequentDate, setMostFrequentDate] = useState<string>("");
  const [totalEarned, setTotalEarned] = useState<number>(0);

  const session = useSession();
  const router = useRouter();

  const { data, isPending } = trpc.userRouter.getUser.useQuery();
  const { mutate: getPeriodStatistics, isPending: isGetSchedulesPending } =
    trpc.userRouter.getPeriodStatistics.useMutation({
      onSuccess: (res) => {
        console.log(res);
        setClientsAttended(res.clientsAttended);
        setMostFrequentService(res.mostFrequentService);
        setMostFrequentDate(res.mostFrequentDate);
        setTotalEarned(res.totalEarned);
      },
      onError: (err) => {
        console.error(err);
      },
    });

  const pending = isPending || isGetSchedulesPending;
  const hasDate = date && date.from !== undefined && date.to !== undefined;

  useEffect(() => {
    if (pending) {
      console.log("Carregando com skeletons");
    }
  }, [pending]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/");
    }

    if (data && data.user.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }

    if (data && data.user.role === "USER" && !data.user.firstAccess) {
      router.replace("/dashboard/primeira-configuracao?step=0");
    }

    if (data && data.user.role === "USER" && !data.user.passwordVerified) {
      router.replace("/nova-senha");
    }
  }, [session, data, router]);

  useEffect(() => {
    console.log({ from: date?.from, to: date?.to });

    if (date && date.from !== undefined && date.to !== undefined) {
      getPeriodStatistics({
        from: format(date.from, "yyyy-MM-dd"),
        to: format(date.to, "yyyy-MM-dd"),
      });
    }
  }, [date?.from, date?.to, getPeriodStatistics]);

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Dashboard</h2>

        <div className="w-full bg-white rounded-3xl p-6 mt-10 mb-12">
          <div className="w-full p-4 rounded-2xl bg-skin-primary flex flex-col items-center gap-2 sm:gap-6 sm:flex-row sm:justify-between">
            <span className="text-2xl text-white font-semibold text-center">Resumo do Mês</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" className={cn(!date && "text-skin-primary/70")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date && date.from && date.to ? (
                    `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                  ) : (
                    <span>Mudar mês</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar mode="range" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full mt-10">
            <div className="w-full flex flex-col items-center gap-6">
              <span className="text-3xl uppercase tracking-wider text-skin-primary text-center">
                {date && date.from
                  ? format(date.from, "MMMM | yyyy", { locale: ptBR })
                  : "Selecione o período que deseja visualizar"}
              </span>

              <span className={cn("text-6xl uppercase text-skin-primary font-bold", RobotoFlex.className)}>
                <small className="text-base text-skin-primary font-bold">R$</small>{" "}
                {hasDate ? formatPrice(totalEarned).substring(3) : formatPrice(0).substring(3)}
              </span>
            </div>

            <div className="w-full grid grid-cols-1 gap-4 mt-10 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
                <span className="text-lg font-semibold text-white text-center">Clientes Atendidos</span>

                <span className="text-2xl font-bold text-white text-center">
                  {hasDate && clientsAttended ? clientsAttended : "Sem clientes"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
                <span className="text-lg font-semibold text-white text-center">Serviço Preferido</span>

                <span className="text-2xl font-bold text-white text-center capitalize">
                  {hasDate && mostFrequentService ? mostFrequentService : "Sem Serviço"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 bg-skin-primary p-4 rounded-xl">
                <span className="text-lg font-semibold text-white text-center">Dia mais agendado</span>

                <span className="text-2xl font-bold text-white text-center capitalize">
                  {hasDate && mostFrequentDate ? format(mostFrequentDate, "EEEE", { locale: ptBR }) : "Sem data"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
