"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { WebsiteStore } from "@/stores/website-store";

const formSchema = z.object({
  actualColor: z.string().min(1, "Cor atual obrigatório").max(7, "Cor inválida"),
  newColor: z.string().min(1, "Código da cor nova obrigatória").max(7, "Cor inválida"),
});

export function ChangeColor() {
  const [textColor, setTextColor] = useState<string>("text-white");

  const { setColor } = WebsiteStore();

  const { data, isPending: getColorPending } = trpc.websiteRouter.getColor.useQuery();
  const { mutate: updateColor, isPending: updateColorPending } = trpc.websiteRouter.updateColor.useMutation({
    onSuccess: (res) => {
      setColor(res.colorUpdated.colorCode);
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao atualizar a cor principal do site");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actualColor: data?.color ?? "#5171e1",
      newColor: "",
    },
  });

  const pending: boolean = getColorPending || updateColorPending;

  const getTextColor = (backgroundColorHex: string) => {
    const hex = backgroundColorHex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "text-foreground" : "text-white";
  };

  useEffect(() => {
    if (data !== undefined) {
      const tColor = getTextColor(data.color);

      setTextColor(tColor);
    }
  }, [data]);

  function hexToRgb(hex: string) {
    hex = hex.replace(/^#/, "");

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r} ${g} ${b}`;
  }

  function updatePrimaryColor(hex: string) {
    const root = document.documentElement;
    const rgb = hexToRgb(hex);
    root.style.setProperty("--bg-primary", rgb);
    const tColor = getTextColor(hex);

    setTextColor(tColor);
    updateColor({ colorId: data!.id, newColor: hex });
    form.setValue("actualColor", hex);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
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
                  <Input disabled {...field} className={cn("bg-skin-background disabled:opacity-100", textColor)} />
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
                  <Input maxLength={7} disabled={pending} placeholder="Insira o código da cor nova" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button size="xl" disabled={pending}>
          Atualizar
        </Button>
      </form>
    </Form>
  );
}
