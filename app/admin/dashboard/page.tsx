"use client";

import { useState } from "react";
import { ChartSpline, LogIn, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logins } from "./components/logins";
import { Statistics } from "./components/statistics";
import { Configuration } from "./components/configuration";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [tabSelected, setTabSelected] = useState<string>("logins");

  return (
    <main className="w-full min-h-screen bg-skin-background">
      <div className="w-full flex flex-col items-center px-6 py-10 sm:px-16 lg:max-w-4xl lg:mx-auto">
        <div className="w-full flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-end">
          <h1 className="text-3xl font-bold text-center text-white">Administração</h1>

          <Button size="xl" variant="secondary" className="hidden sm:flex" onClick={() => signOut({ redirectTo: "/" })}>
            <LogOut />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="logins" value={tabSelected} onValueChange={setTabSelected} className="w-full mt-6">
          <TabsList className="h-auto grid w-full grid-cols-3 bg-black/20 rounded-xl">
            <TabsTrigger
              value="logins"
              className="rounded-lg flex flex-col items-center gap-2 transition-none sm:transition-all sm:flex-row"
            >
              <LogIn color="#FFF" className="shrink-0" />

              <span className="font-bold text-base text-white hidden sm:block">Logins</span>
            </TabsTrigger>

            <TabsTrigger
              value="statistics"
              className="rounded-lg flex flex-col items-center gap-2 transition-none sm:transition-all sm:flex-row"
            >
              <ChartSpline color="#FFF" className="shrink-0" />

              <span className="font-bold text-base text-white hidden sm:block">Estatísticas</span>
            </TabsTrigger>

            <TabsTrigger
              value="configuration"
              className="rounded-lg flex flex-col items-center gap-2 transition-none sm:transition-all sm:flex-row"
            >
              <Settings color="#FFF" className="shrink-0" />

              <span className="font-bold text-base text-white hidden sm:block">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logins">
            <Logins />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics />
          </TabsContent>

          <TabsContent value="configuration">
            <Configuration />
          </TabsContent>
        </Tabs>
        <Button
          size="xl"
          variant="secondary"
          className="w-full mt-6 sm:hidden"
          onClick={() => signOut({ redirectTo: "/" })}
        >
          <LogOut />
          Sair
        </Button>
      </div>
    </main>
  );
}
