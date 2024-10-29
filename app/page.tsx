"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .string({
      required_error: "E-mail é obrigatório",
      invalid_type_error: "O valor enviado para e-mail é invalido",
    })
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string({
      required_error: "Senha é obrigatória",
      invalid_type_error: "O valor enviado para senha é invalida",
    })
    .min(1, "Senha é obrigatória"),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <main className="w-screen h-full flex items-center justify-center bg-skin-primary">
      <div className="w-full flex flex-col items-center gap-6 bg-white rounded-3xl mx-6 p-6">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain object-center"
        />

        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center text-slate-800">
            Entre na sua conta
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <div className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">
                        E-mail
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Insira o seu e-mail"
                          className="text-slate-800"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full flex items-center justify-between">
                        <FormLabel className="text-slate-600 font-bold">
                          Senha
                        </FormLabel>

                        <Link
                          href="/recuperar-senha"
                          className="text-slate-500 text-sm transition hover:text-skin-primary"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>

                      <FormControl>
                        <Input
                          placeholder="Insira a sua senha"
                          className="text-slate-800"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="xl" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
