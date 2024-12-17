"use client";

import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Suspense, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

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

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Nova senha é obrigatória")
      .min(6, "Nova senha precisa ter no mínimo 6 caracteres"),
    newPasswordConfirmation: z
      .string()
      .min(1, "Confirmação da senha nova é obrigatória")
      .min(6, "Confirmação da senha nova precisa ter no mínimo 6 caracteres"),
  })
  .superRefine(({ newPassword, newPasswordConfirmation }, ctx) => {
    if (newPasswordConfirmation !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem, verifique e tente novamente",
        path: ["newPasswordConfirmation"],
      });
    }
  });

function RecoverPasswordComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  const { data, isPending } =
    trpc.userRouter.checkRecoverPasswordExpire.useQuery({
      id: userId!,
    });
  const { mutate: recoverNewPassword, isPending: isRecoveringNewPassword } =
    trpc.userRouter.recoverNewPassword.useMutation({
      onSuccess: (res) => {
        toast.success(res.message);

        router.replace("/");
      },
      onError: (err) => {
        console.error(err);

        toast.error(
          "Ocorreu um erro ao recuperar a senha da conta, tente novamente mais tarde",
        );
      },
    });

  const pending = isPending || isRecoveringNewPassword;

  useEffect(() => {
    if (!userId) {
      router.replace("/");
    }
  }, [userId, router]);

  useEffect(() => {
    if (data !== undefined && data.redirect) {
      router.replace("/");
    }
  }, [data, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    recoverNewPassword({ ...values, id: userId! });
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-background py-12 px-6">
      <div className="w-full flex flex-col items-center gap-6 bg-white rounded-3xl p-6 max-w-[450px]">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain object-center"
        />

        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-center text-slate-800">
            Recupere a sua senha
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <div className="w-full flex flex-col gap-4">
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">
                        Nova senha
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Insira a nova senha"
                          className="text-slate-800"
                          disabled={pending}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="newPasswordConfirmation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 font-bold">
                        Confirme a nova senha
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirme a nova senha"
                          className="text-slate-800"
                          disabled={pending}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button size="xl" className="w-full" disabled={pending}>
                Enviar
                {isRecoveringNewPassword && (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default function RecoverPasswordPage() {
  return (
    <Suspense>
      <RecoverPasswordComponent />
    </Suspense>
  );
}
