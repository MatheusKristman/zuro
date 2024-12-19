"use client";

import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { trpc } from "@/lib/trpc-client";

const formSchema = z
  .object({
    password: z
      .string({
        required_error: "Este campo é obrigatória",
        invalid_type_error: "O valor enviado para este campo é invalido",
      })
      .min(1, "Este campo é obrigatório")
      .min(6, { message: "Este campo precisa ter no mínimo 6 caracteres" }),
    passwordConfirm: z
      .string({
        required_error: "Este campo é obrigatória",
        invalid_type_error: "O valor enviado para este campo é invalido",
      })
      .min(1, "Este campo é obrigatório")
      .min(6, { message: "Este campo precisa ter no mínimo 6 caracteres" }),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: "custom",
        message: "As senhas não coincidem, verifique e tente novamente",
      });
    }
  });

function NewPasswordComponent() {
  const router = useRouter();

  const { mutate: newPassword, isPending } = trpc.userRouter.newPassword.useMutation({
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso");
      router.replace("/");
    },
    onError: (error) => {
      console.error(error);

      toast.error("Ocorreu um erro ao criar a conta");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    newPassword(values);
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-background py-12 px-6">
      <div className="w-full flex flex-col items-center gap-6 bg-white overflow-hidden rounded-3xl p-6 max-w-[450px]">
        <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain object-center" />

        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center text-slate-800">Crie sua nova senha</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
              <div className="space-y-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">Nova Senha</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Insira a sua nova senha"
                          className="text-slate-800"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="passwordConfirm"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">Confirmar Nova Senha</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirme sua senha nova"
                          className="text-slate-800"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="xl" className="w-full flex items-center gap-2">
                Enviar
                {isPending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense>
      <NewPasswordComponent />
    </Suspense>
  );
}
