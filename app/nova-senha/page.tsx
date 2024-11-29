"use client";

import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";

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

import { trpc } from "@/lib/trpc-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("token");

  console.log(id);

  if (!id) {
    router.replace("/");
  }

  const { mutate: newPassword, isPending } =
    trpc.userRouter.newPassword.useMutation({
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
    if (!id) {
      toast.error("ID inválido");

      return;
    }

    newPassword({ ...values, id });
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-primary py-12 px-6">
      <div className="w-full flex flex-col items-center gap-6 bg-white overflow-hidden rounded-3xl p-6 max-w-[450px]">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain object-center"
        />

        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center text-slate-800">
            Crie sua nova senha
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <div className="space-y-4">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">
                        Nova Senha
                      </FormLabel>

                      <FormControl>
                        <Input
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
                      <FormLabel className="text-slate-600 font-bold">
                        Confirmar Nova Senha
                      </FormLabel>

                      <FormControl>
                        <Input
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

              <Button
                type="submit"
                size="xl"
                className="w-full flex items-center gap-2"
              >
                Enviar
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
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
