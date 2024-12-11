"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", { ...values, redirect: false });

      if (!res?.error) {
        router.replace("/dashboard");
      } else {
        if (res.error === "Configuration") {
          console.log("E-mail ou Senha inválidos");

          toast.error("E-mail ou Senha inválidos");
        } else {
          console.log("Ocorreu um erro, tente novamente mais tarde");

          toast.error("Ocorreu um erro, tente novamente mais tarde");
        }
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-background py-12 px-6">
      <div className="w-full flex flex-col items-center gap-6 bg-white rounded-3xl p-6 max-w-[450px]">
        <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain object-center" />

        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center text-slate-800">Entre na sua conta</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
              <div className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">E-mail</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Insira o seu e-mail"
                          className="text-slate-800"
                          disabled={isSubmitting}
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
                        <FormLabel className="text-slate-600 font-bold">Senha</FormLabel>

                        <Link
                          href="/recuperar-senha"
                          className="text-slate-500 text-sm transition hover:text-skin-primary"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Insira a sua senha"
                          className="text-slate-800"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button disabled={isSubmitting} type="submit" size="xl" className="w-full flex items-center gap-2">
                Entrar
                {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
