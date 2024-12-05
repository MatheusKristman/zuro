import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coupon } from "./configuration/coupon";
import { ChangeEmail } from "./configuration/change-email";
import { ChangeColor } from "./configuration/change-color";

export function Configuration() {
  const [tabSelected, setTabSelected] = useState("coupon");

  return (
    <div className="w-full bg-white rounded-3xl px-4 py-3 flex flex-col gap-6">
      <Tabs
        defaultValue="coupon"
        value={tabSelected}
        onValueChange={setTabSelected}
        className="w-full"
      >
        <TabsList className="h-auto grid w-full grid-cols-1 gap-1 sm:grid-cols-3 bg-skin-primary/20 rounded-xl">
          <TabsTrigger
            value="coupon"
            className="rounded-lg flex flex-col items-center gap-2 transition-none font-bold text-base text-skin-primary data-[state=active]:text-white sm:transition-all sm:flex-row"
          >
            Gerenciar Cupom
          </TabsTrigger>

          <TabsTrigger
            value="email"
            className="rounded-lg flex flex-col items-center gap-2 transition-none font-bold text-base text-skin-primary data-[state=active]:text-white sm:transition-all sm:flex-row"
          >
            Alterar E-mail
          </TabsTrigger>

          <TabsTrigger
            value="color"
            className="rounded-lg flex flex-col items-center gap-2 transition-none font-bold text-base text-skin-primary data-[state=active]:text-white sm:transition-all sm:flex-row"
          >
            Cor da Plataforma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupon">
          <Coupon />
        </TabsContent>

        <TabsContent value="email">
          <ChangeEmail />
        </TabsContent>

        <TabsContent value="color">
          <ChangeColor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
