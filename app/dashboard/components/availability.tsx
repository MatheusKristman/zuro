"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DaySchedule() {
  return (
    <>
      <div className="w-full flex flex-col items-center gap-y-4 mt-6 sm:flex-row sm:gap-x-2">
        <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
          <Label>Horário de início</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário de início" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="01:00">01:00</SelectItem>
              <SelectItem value="02:00">02:00</SelectItem>
              <SelectItem value="03:00">03:00</SelectItem>
              <SelectItem value="04:00">04:00</SelectItem>
              <SelectItem value="05:00">05:00</SelectItem>
              <SelectItem value="06:00">06:00</SelectItem>
              <SelectItem value="07:00">07:00</SelectItem>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
              <SelectItem value="21:00">21:00</SelectItem>
              <SelectItem value="22:00">22:00</SelectItem>
              <SelectItem value="23:00">23:00</SelectItem>
              <SelectItem value="00:00">00:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
          <Label>Horário de término</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário de término" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="01:00">01:00</SelectItem>
              <SelectItem value="02:00">02:00</SelectItem>
              <SelectItem value="03:00">03:00</SelectItem>
              <SelectItem value="04:00">04:00</SelectItem>
              <SelectItem value="05:00">05:00</SelectItem>
              <SelectItem value="06:00">06:00</SelectItem>
              <SelectItem value="07:00">07:00</SelectItem>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
              <SelectItem value="21:00">21:00</SelectItem>
              <SelectItem value="22:00">22:00</SelectItem>
              <SelectItem value="23:00">23:00</SelectItem>
              <SelectItem value="00:00">00:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 items-center mt-6">
        <Checkbox id="break" />

        <Label htmlFor="break">Deseja colocar um período de intervalo?</Label>
      </div>

      {/* TODO: adicionar dinamicamente de acordo com o checkbox */}
      <div className="w-full bg-black/10 h-px mt-6" />

      <div className="mt-6 w-full flex flex-col gap-4 sm:flex-row sm:gap-2">
        <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
          <Label htmlFor="break-begin">Horário de início do intervalo</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário de início do intervalo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="01:00">01:00</SelectItem>
              <SelectItem value="02:00">02:00</SelectItem>
              <SelectItem value="03:00">03:00</SelectItem>
              <SelectItem value="04:00">04:00</SelectItem>
              <SelectItem value="05:00">05:00</SelectItem>
              <SelectItem value="06:00">06:00</SelectItem>
              <SelectItem value="07:00">07:00</SelectItem>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
              <SelectItem value="21:00">21:00</SelectItem>
              <SelectItem value="22:00">22:00</SelectItem>
              <SelectItem value="23:00">23:00</SelectItem>
              <SelectItem value="00:00">00:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2 sm:w-[calc(50%-4px)]">
          <Label htmlFor="break-begin">Horário de término do intervalo</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário de término do intervalo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="01:00">01:00</SelectItem>
              <SelectItem value="02:00">02:00</SelectItem>
              <SelectItem value="03:00">03:00</SelectItem>
              <SelectItem value="04:00">04:00</SelectItem>
              <SelectItem value="05:00">05:00</SelectItem>
              <SelectItem value="06:00">06:00</SelectItem>
              <SelectItem value="07:00">07:00</SelectItem>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
              <SelectItem value="21:00">21:00</SelectItem>
              <SelectItem value="22:00">22:00</SelectItem>
              <SelectItem value="23:00">23:00</SelectItem>
              <SelectItem value="00:00">00:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

export function Availability() {
  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">
        Disponibilidade
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">Quais dias irá folgar?</h4>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione os dias" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="final-de-semana">Final de Semana</SelectItem>
            <SelectItem value="domingos">Domingos</SelectItem>
            <SelectItem value="segundas">Segundas</SelectItem>
            <SelectItem value="tercas">Terças</SelectItem>
            <SelectItem value="quartas">Quartas</SelectItem>
            <SelectItem value="quintas">Quintas</SelectItem>
            <SelectItem value="sextas">Sextas</SelectItem>
            <SelectItem value="sabados">Sábados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">
          Selecione os horários que trabalha
        </h4>

        <Tabs className="w-full">
          <TabsList className="w-full flex flex-col h-fit sm:flex-row">
            <TabsTrigger value="domingo" className="w-full basis-full">
              Domingo
            </TabsTrigger>
            <TabsTrigger value="segunda" className="w-full basis-full">
              Segunda
            </TabsTrigger>
            <TabsTrigger value="terca" className="w-full basis-full">
              Terça
            </TabsTrigger>
            <TabsTrigger value="quarta" className="w-full basis-full">
              Quarta
            </TabsTrigger>
            <TabsTrigger value="quinta" className="w-full basis-full">
              Quinta
            </TabsTrigger>
            <TabsTrigger value="sexta" className="w-full basis-full">
              Sexta
            </TabsTrigger>
            <TabsTrigger value="sabado" className="w-full basis-full">
              Sábado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domingo">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="segunda">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="terca">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="quarta">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="quinta">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="sexta">
            <DaySchedule />
          </TabsContent>

          <TabsContent value="sabado">
            <DaySchedule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
