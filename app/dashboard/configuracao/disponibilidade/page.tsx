"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Availability } from "../../components/availability";

import { FirstConfigurationStore } from "@/stores/first-configuration-store";
import { trpc } from "@/lib/trpc-client";

export default function AvailabilityPage() {
  const router = useRouter();

  const {
    dayOff,
    setDayOff,
    availability,
    setAvailability,
    setDefaultAvailability,
    setConfigurationError,
    configurationError,
    resetConfigurationError,
  } = FirstConfigurationStore();

  const util = trpc.useUtils();
  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  const { mutate: submitAvailability, isPending: isAvailabilityPending } =
    trpc.userRouter.submitAvailability.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        util.userRouter.getUser.invalidate();
        router.push("/dashboard/configuracao");
      },
    });

  const pending: boolean = isPending || isAvailabilityPending;

  useEffect(() => {
    if (data) {
      if (data.user.dayOff) {
        setDayOff(data.user.dayOff);
      }

      if (data.user.availability.length > 0) {
        data.user.availability.forEach((newItem) => {
          const original = availability.find(
            (item) => item.dayOfWeek === newItem.dayOfWeek,
          );

          if (original) {
            setDefaultAvailability(newItem.dayOfWeek, newItem.availableTimes);
          }
        });
      }
    }
  }, [data, setAvailability, setDayOff]);

  function handleSubmit() {
    let dayOffErrorMessage = "";
    const availabilityErrorMessage: string[] = [];

    if (!dayOff) {
      dayOffErrorMessage = "Selecione uma das opções para prosseguir!";
    }

    const daysOfWeek = [
      { day: "Sunday", label: "Domingo" },
      { day: "Monday", label: "Segunda" },
      { day: "Tuesday", label: "Terça" },
      { day: "Wednesday", label: "Quarta" },
      { day: "Thursday", label: "Quinta" },
      { day: "Friday", label: "Sexta" },
      { day: "Saturday", label: "Sábado" },
    ];

    daysOfWeek.forEach((dayObj, index) => {
      const { day, label } = dayObj;

      if (
        dayOff.includes(
          day as
            | "Sunday"
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday",
        )
      ) {
        return;
      }

      const { availableTimes } = availability[index];

      availableTimes.forEach((time, idx) => {
        if (time.startTime === "") {
          availabilityErrorMessage.push(
            `O campo "Horário de início - ${idx}" na aba "${label}" precisa ter uma opção selecionada`,
          );
        }

        if (time.endTime === "") {
          availabilityErrorMessage.push(
            `O campo "Horário de término - ${idx}" na aba "${label}" precisa ter uma opção selecionada`,
          );
        }
      });

      const sortedTimes = [...availableTimes].sort(
        (a, b) =>
          parseInt(a.startTime.replace(":", ""), 10) -
          parseInt(b.startTime.replace(":", ""), 10),
      );

      for (let i = 0; i < sortedTimes.length - 1; i++) {
        const currentEndTime = parseInt(
          sortedTimes[i].endTime.replace(":", ""),
          10,
        );
        const nextStartTime = parseInt(
          sortedTimes[i + 1].startTime.replace(":", ""),
          10,
        );

        if (currentEndTime > nextStartTime) {
          availabilityErrorMessage.push(
            `Os horários "${sortedTimes[i].startTime} - ${sortedTimes[i].endTime}" e "${sortedTimes[i + 1].startTime} - ${sortedTimes[i + 1].endTime}" na aba "${label}" estão sobrepostos.`,
          );
        }
      }
    });

    if (dayOffErrorMessage !== "" || availabilityErrorMessage.length !== 0) {
      setConfigurationError({
        ...configurationError,
        dayOff: dayOffErrorMessage,
        availability: availabilityErrorMessage,
      });

      return;
    }

    resetConfigurationError();

    submitAvailability({ availability, dayOff });

    return;
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container min-h-[calc(100vh-72px-24px)] flex flex-col justify-between sm:min-h-[calc(100vh-112px-24px)] lg:min-h-[calc(100vh-24px)]">
        <h2 className="text-3xl font-bold text-center text-white mt-10">
          Configurações
        </h2>

        <div className="flex-grow mt-24">
          <Availability isPending={pending} />
        </div>

        <div className="w-full flex justify-between mt-12 pb-12">
          <Button variant="secondary" size="xl" disabled={pending} asChild>
            <Link href="/dashboard/configuracao">Voltar</Link>
          </Button>

          <Button
            variant="secondary"
            size="xl"
            disabled={pending}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
      </div>
    </main>
  );
}
