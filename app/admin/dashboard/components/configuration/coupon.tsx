"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do cumpom é obrigatório")
    .min(4, "O nome precisa ter no mínimo 4 caracteres"),
  percentage: z.coerce
    .number()
    .gte(0, "Valor precisa ser maior ou igual à zero")
    .lte(100, "Valor precisa ser menor ou igual á cem"),
  days: z.coerce.number().gt(0, "Valor precisa ser maior que zero"),
  mounthly: z.enum(["first", "all"], { message: "Valor inválido" }),
});

function CouponItem() {
  return (
    <div className="bg-skin-primary rounded-xl p-3 flex items-end justify-between gap-6">
      <div className="flex flex-col-reverse items-center gap-2">
        <span className="text-white text-lg font-bold">Nome Cupom</span>

        <span className="bg-black/20 p-2 rounded-lg text-white font-semibold text-sm">
          15 dias restantes
        </span>
      </div>

      <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-black/20" />
    </div>
  );
}

export function Coupon() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      percentage: 0,
      days: 0,
      mounthly: "first",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
  }

  return (
    <div className="w-full mt-6 flex flex-col gap-12 md:flex-row md:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-3 rounded-xl bg-black/10 flex flex-col gap-8"
        >
          <div className="w-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Nome do Cupom</FormLabel>

                  <FormControl>
                    <Input placeholder="Insira o nome do cupom" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex flex-col gap-4 sm:flex-row md:flex-col">
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col gap-1">
                    <FormLabel>Porcentagem do Cupom</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Insira a porcentagem do cupom"
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col gap-1">
                    <FormLabel>Dias de Cupom Ativo</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Insira a quantidade de dias"
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mounthly"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Aplicação do cupom</FormLabel>

                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full flex flex-col gap-2 sm:flex-row md:flex-col"
                    >
                      <ToggleGroupItem
                        variant="outline"
                        value="first"
                        className="w-full h-12 rounded-xl"
                      >
                        Primeira Mensalidade
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        variant="outline"
                        value="all"
                        className="w-full h-12 rounded-xl"
                      >
                        Todas as Mensalidades
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button size="xl" type="submit">
            Criar
          </Button>
        </form>
      </Form>

      <div className="w-full flex flex-col gap-2">
        <h4 className="text-2xl font-bold text-skin-primary">
          Cupons cadastrados
        </h4>

        <div className="w-full flex flex-col gap-4">
          <CouponItem />
          <CouponItem />
          <CouponItem />
        </div>
      </div>
    </div>
  );
}
