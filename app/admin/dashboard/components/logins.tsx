"use client";

import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Search, UserRound, UserRoundSearch, UserRoundX } from "lucide-react";
import { DateRange } from "react-day-picker";
import Image from "next/image";
import { User } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";

export function Logins() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersFiltered, setUsersFiltered] = useState<User[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 60),
  });

  const { mutate: getUsers, isPending } = trpc.adminRouter.getUsers.useMutation({
    onSuccess: (res) => {
      setUsers(res.users);
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao resgatar os logins, tente novamente mais tarde");
    },
  });

  useEffect(() => {
    if (date && date?.from !== undefined && date?.to !== undefined) {
      getUsers({ from: date.from, to: date.to });
    }
  }, [date, date?.from, date?.to, getUsers]);

  useEffect(() => {
    if (category === "name" && searchValue.length > 3 && users.length > 0) {
      const filter = users.filter((user) =>
        user.name
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
            searchValue
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          )
      );

      setUsersFiltered(filter);
    }

    if (category === "email" && searchValue.length > 3 && users.length > 0) {
      const filter = users.filter((user) =>
        user.email
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
            searchValue
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          )
      );

      setUsersFiltered(filter);
    }
  }, [searchValue, category, users]);

  return (
    <div className="w-full bg-white rounded-3xl px-4 py-3 flex flex-col gap-6">
      <div className="w-full flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="xl" className={cn("w-full sm:w-fit", !date && "text-muted-foreground")}>
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="xl" variant="outline">
              <Search />
              Pesquisar
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col gap-4 rounded-2xl">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pesquisa" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                {/* <SelectItem value="cpf">CPF</SelectItem> */}
                <SelectItem value="email">E-mail</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Faça a sua pesquisa"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {isPending ? (
        <div className="w-full flex flex-col items-center gap-2">
          <Loader2 size={50} strokeWidth={1.5} className="animate-spin text-skin-primary" />

          <span className="text-skin-primary text-xl font-semibold text-center">Carregando contas...</span>
        </div>
      ) : searchValue.length > 3 && usersFiltered.length === 0 ? (
        <div className="w-full flex flex-col items-center gap-2">
          <UserRoundSearch size={50} strokeWidth={1.5} className="text-skin-primary opacity-60" />

          <span className="text-skin-primary text-xl font-semibold text-center opacity-60">
            Nenhuma conta encontrada
          </span>
        </div>
      ) : searchValue.length > 3 && usersFiltered.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {usersFiltered.map((user) => (
            <AccordionItem value={user.id} key={user.id} className="border-0 bg-skin-primary rounded-2xl">
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "relative w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center",
                      "bg-white"
                    )}
                  >
                    {user.image ? (
                      <Image src={user.image} alt="Foto de perfil" fill className="object-center object-cover" />
                    ) : (
                      <UserRound className="text-skin-primary" />
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <h4 className="text-lg font-semibold text-white">{user.name}</h4>

                    <div className="h-[2px] w-full bg-white/50" />

                    <span className="text-base font-semibold text-white">
                      {format(new Date(user.createdAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4">
                  {/* <div className="flex items-center gap-2"> */}
                  {/*   <span className="text-base text-white font-bold">CPF:</span> */}
                  {/**/}
                  {/*   <span className="text-base text-white">123.123.123-12</span> */}
                  {/* </div> */}

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">E-mail:</span>

                    <span className="text-base text-white">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">Data de cadastro:</span>

                    <span className="text-base text-white">
                      {format(new Date(user.createdAt), "dd/MM/yyyy - HH:mm")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">Plano:</span>

                    <span className="text-base text-white">30 dias</span>

                    <span className="bg-green-500 p-1 rounded-sm text-white text-center font-semibold">Ativo</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button size="xl" variant="confirm" className="w-full">
                    Aplicar desconto
                  </Button>

                  <Button size="xl" variant="destructive" className="w-full">
                    Cancelar plano
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : users.length === 0 ? (
        <div className="w-full flex flex-col items-center gap-2">
          <UserRoundX size={50} strokeWidth={1.5} className="text-skin-primary opacity-60" />

          <span className="text-skin-primary text-xl font-semibold text-center opacity-60">
            Nenhuma conta cadastrada no momento
          </span>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {users.map((user) => (
            <AccordionItem value={user.id} key={user.id} className="border-0 bg-skin-primary rounded-2xl">
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "relative w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center",
                      "bg-white"
                    )}
                  >
                    {user.image ? (
                      <Image src={user.image} alt="Foto de perfil" fill className="object-center object-cover" />
                    ) : (
                      <UserRound className="text-skin-primary" />
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <h4 className="text-lg font-semibold text-white">{user.name}</h4>

                    <div className="h-[2px] w-full bg-white/50" />

                    <span className="text-base font-semibold text-white">
                      {format(new Date(user.createdAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4">
                  {/* <div className="flex items-center gap-2"> */}
                  {/*   <span className="text-base text-white font-bold">CPF:</span> */}
                  {/**/}
                  {/*   <span className="text-base text-white">123.123.123-12</span> */}
                  {/* </div> */}

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">E-mail:</span>

                    <span className="text-base text-white">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">Data de cadastro:</span>

                    <span className="text-base text-white">
                      {format(new Date(user.createdAt), "dd/MM/yyyy - HH:mm")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base text-white font-bold">Plano:</span>

                    <span className="text-base text-white">30 dias</span>

                    <span className="bg-green-500 p-1 rounded-sm text-white text-center font-semibold">Ativo</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button size="xl" variant="confirm" className="w-full">
                    Aplicar desconto
                  </Button>

                  <Button size="xl" variant="destructive" className="w-full">
                    Cancelar plano
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
