"use client";

import { z } from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  recoverEmail: z
    .string({
      required_error: "E-mail de recuperação é obrigatório",
      invalid_type_error:
        "O valor enviado para e-mail de recuperação é invalido",
    })
    .min(1, "E-mail de recuperação é obrigatório")
    .email("E-mail de recuperação inválido"),
});

interface ForgotPasswordFormProps {
  setSendedRecoverMail: Dispatch<SetStateAction<boolean>>;
  setRecoverEmail: Dispatch<SetStateAction<string>>;
}

export function ForgotPasswordForm({
  setSendedRecoverMail,
  setRecoverEmail,
}: ForgotPasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoverEmail: "",
    },
  });

  const { mutate: recoverPassword, isPending } =
    trpc.userRouter.recoverPassword.useMutation({
      onSuccess: (res) => {
        setSendedRecoverMail(true);
        setRecoverEmail(res.email);
      },
      onError: (err) => {
        console.error(err);

        toast.error(
          "Ocorreu um erro ao enviar o e-mail para recuperar a senha",
        );
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    recoverPassword(values);
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 bg-white rounded-3xl p-6 max-w-[450px] overflow-hidden">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain object-center"
        />
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full flex flex-col items-center gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-slate-800">
          Recupere a sua senha
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              name="recoverEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="w-full flex items-center justify-between">
                    <FormLabel className="text-slate-600 font-bold">
                      E-mail de recuperação
                    </FormLabel>

                    <Link
                      href="/"
                      className="text-slate-500 text-sm transition hover:text-skin-primary"
                    >
                      Lembrou da senha?
                    </Link>
                  </div>

                  <FormControl>
                    <Input
                      placeholder="Insira o seu e-mail"
                      className="text-slate-800"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={isPending}
            >
              Enviar
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
