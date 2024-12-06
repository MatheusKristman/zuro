"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  actualColor: z.string().min(1, "Cor atual obrigatório").max(7, "Cor inválida"),
  newColor: z.string().min(1, "Código da cor nova obrigatória").max(7, "Cor inválida"),
});

export function ChangeColor() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actualColor: "#5171e1",
      newColor: "",
    },
  });

  function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, "");

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
  }

  function updatePrimaryColor(hex: string) {
    const root = document.documentElement;
    const rgb = hexToRgb(hex);
    root.style.setProperty("--color-primary", rgb);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: comentar com o cliente sobre o problema e se ele quiser manter, adicionar função de salvar o valor no banco de dados e atualizar a cor ao carregar a página
    updatePrimaryColor(values.newColor);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-6 flex flex-col gap-12">
        <div className="w-full flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="actualColor"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-1">
                <FormLabel>Cor Principal Atual</FormLabel>

                <FormControl>
                  <Input disabled {...field} className={cn("bg-skin-primary disabled:opacity-100")} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newColor"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col gap-1">
                <FormLabel>Código da cor nova</FormLabel>

                <FormControl>
                  <Input maxLength={7} placeholder="Insira o código da cor nova" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button size="xl">Atualizar</Button>
      </form>
    </Form>
  );
}
