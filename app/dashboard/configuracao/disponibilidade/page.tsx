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

  // TODO: alterar para o novo formato do dayoff em array, para funcionar com o availability
  // useEffect(() => {
  //   if (data) {
  //     if (data.user.dayOff) {
  //       setDayOff(data.user.dayOff);
  //     }
  //
  //     if (data.user.availability.length > 0) {
  //       data.user.availability.forEach((newItem) => {
  //         const original = availability.find((item) => item.dayOfWeek === newItem.dayOfWeek);
  //
  //         if (original) {
  //           setAvailability(newItem.dayOfWeek, "startTime", newItem.startTime);
  //           setAvailability(newItem.dayOfWeek, "endTime", newItem.endTime);
  //           setAvailability(newItem.dayOfWeek, "hasInterval", newItem.hasInterval);
  //           setAvailability(
  //             newItem.dayOfWeek,
  //             "startIntervalTime",
  //             newItem.startIntervalTime ? newItem.startIntervalTime : ""
  //           );
  //           setAvailability(
  //             newItem.dayOfWeek,
  //             "endIntervalTime",
  //             newItem.endIntervalTime ? newItem.endIntervalTime : ""
  //           );
  //         }
  //       });
  //     }
  //   }
  // }, [data, setAvailability, setDayOff]);

  // function handleSubmit() {
  //   let dayOffErrorMessage = "";
  //   const availabilityErrorMessage: string[] = [];
  //
  //   if (!dayOff) {
  //     dayOffErrorMessage = "Selecione uma das opções para prosseguir!";
  //   }
  //
  //   const daysOfWeek = [
  //     { day: "Sunday", label: "Domingo" },
  //     { day: "Monday", label: "Segunda" },
  //     { day: "Tuesday", label: "Terça" },
  //     { day: "Wednesday", label: "Quarta" },
  //     { day: "Thursday", label: "Quinta" },
  //     { day: "Friday", label: "Sexta" },
  //     { day: "Saturday", label: "Sábado" },
  //   ];
  //
  //   daysOfWeek.forEach((dayObj, index) => {
  //     const { day, label } = dayObj;
  //
  //     if (
  //       (dayOff === "Weekend" && (day === "Saturday" || day === "Sunday")) ||
  //       dayOff === day
  //     ) {
  //       return;
  //     }
  //
  //     const {
  //       startTime,
  //       endTime,
  //       hasInterval,
  //       startIntervalTime,
  //       endIntervalTime,
  //     } = availability[index];
  //
  //     if (startTime === "") {
  //       availabilityErrorMessage.push(
  //         `O campo "Horário de início" na aba "${label}" precisa ter uma opção selecionada`,
  //       );
  //     }
  //
  //     if (endTime === "") {
  //       availabilityErrorMessage.push(
  //         `O campo "Horário de término" na aba "${label}" precisa ter uma opção selecionada`,
  //       );
  //     }
  //
  //     if (hasInterval) {
  //       if (startIntervalTime === "") {
  //         availabilityErrorMessage.push(
  //           `O campo "Horário de início do intervalo" na aba "${label}" precisa ter uma opção selecionada`,
  //         );
  //       }
  //
  //       if (endIntervalTime === "") {
  //         availabilityErrorMessage.push(
  //           `O campo "Horário de término do intervalo" na aba "${label}" precisa ter uma opção selecionada`,
  //         );
  //       }
  //     }
  //   });
  //
  //   if (dayOffErrorMessage !== "" || availabilityErrorMessage.length !== 0) {
  //     setConfigurationError({
  //       ...configurationError,
  //       dayOff: dayOffErrorMessage,
  //       availability: availabilityErrorMessage,
  //     });
  //
  //     return;
  //   }
  //
  //   resetConfigurationError();
  //
  //   submitAvailability({ availability, dayOff });
  //
  //   return;
  // }

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
            // onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
      </div>
    </main>
  );
}
