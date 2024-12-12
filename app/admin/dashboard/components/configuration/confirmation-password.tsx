"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { trpc } from "@/lib/trpc-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CreateConfirmationPasswordProps {
  setHasConfirmationPassword: Dispatch<SetStateAction<boolean>>;
}

const changeConfirmationPasswordSchema = z
  .object({
    actualConfirmationPassword: z.string().min(1, "Atual senha de confirmação obrigatória"),
    newConfirmationPassword: z.string().min(1, "Nova senha de confirmação obrigatória"),
    confirmConfirmationPassword: z.string().min(1, "Confirma senha de confirmação obrigatória"),
  })
  .superRefine(({ actualConfirmationPassword, newConfirmationPassword, confirmConfirmationPassword }, ctx) => {
    if (actualConfirmationPassword === newConfirmationPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas são iguais, insira uma senha diferente para alterar",
        path: ["newConfirmationPassword"],
      });
    }

    if (confirmConfirmationPassword !== newConfirmationPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem, verifique e tente novamente",
        path: ["confirmConfirmationPassword"],
      });
    }
  });

const createConfirmationPasswordSchema = z
  .object({
    confirmationPassword: z.string().min(1, "Senha de confirmação é obrigatória"),
    confirmConfirmationPassword: z.string().min(1, "Confirmar senha de confirmação é obrigatória"),
  })
  .superRefine(({ confirmationPassword, confirmConfirmationPassword }, ctx) => {
    if (confirmConfirmationPassword !== confirmationPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem, verifique e tente novamente",
        path: ["confirmConfirmationPassword"],
      });
    }
  });

function CreateConfirmationPassword({ setHasConfirmationPassword }: CreateConfirmationPasswordProps) {
  const form = useForm<z.infer<typeof createConfirmationPasswordSchema>>({
    resolver: zodResolver(createConfirmationPasswordSchema),
    defaultValues: {
      confirmationPassword: "",
      confirmConfirmationPassword: "",
    },
  });

  const { mutate: createConfirmationPassword, isPending } = trpc.adminRouter.createConfirmationPassword.useMutation({
    onSuccess: (res) => {
      toast.success(res.message);

      setHasConfirmationPassword(true);
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao criar a senha de confirmação");
    },
  });

  function onSubmit(values: z.infer<typeof createConfirmationPasswordSchema>) {
    createConfirmationPassword(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-12 sm:gap-6 md:items-end">
        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <FormField
            control={form.control}
            name="confirmationPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha de confirmação</FormLabel>

                <FormControl>
                  <Input disabled={isPending} type="password" placeholder="Insira a senha de confirmação" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmConfirmationPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha de confirmação</FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Insira a confirmação da senha de confirmação"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="xl" className="md:w-fit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Criar
        </Button>
      </form>
    </Form>
  );
}

function ChangeConfirmationPassword() {
  const form = useForm<z.infer<typeof changeConfirmationPasswordSchema>>({
    resolver: zodResolver(changeConfirmationPasswordSchema),
    defaultValues: {
      actualConfirmationPassword: "",
      newConfirmationPassword: "",
      confirmConfirmationPassword: "",
    },
  });

  const { mutate: changeConfirmationPassword, isPending } = trpc.adminRouter.changeConfirmationPassword.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao alterar a senha de confirmação");
    },
  });

  function onSubmit(values: z.infer<typeof changeConfirmationPasswordSchema>) {
    changeConfirmationPassword(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-6 flex flex-col gap-12 sm:gap-6 md:items-end">
        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="actualConfirmationPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha de confirmação atual</FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Insira a senha de confirmação atual"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newConfirmationPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha de confirmação</FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Insira a nova senha de confirmação"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmConfirmationPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha de confirmação</FormLabel>

                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Insira a confirmação da senha de confirmação"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="xl" className="md:w-fit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar
        </Button>
      </form>
    </Form>
  );
}

export function ConfirmationPassword() {
  const [hasConfirmationPassword, setHasConfirmationPassword] = useState<boolean>(false);

  const { data, isPending } = trpc.userRouter.getUser.useQuery();

  useEffect(() => {
    if (data !== undefined) {
      if (data.user.confirmationPassword) {
        setHasConfirmationPassword(true);
      } else {
        setHasConfirmationPassword(false);
      }
    }
  }, [data]);

  return (
    <>
      {isPending ? (
        <div className="w-full flex items-center justify-center">
          <Loader2 className="size-12 text-skin-primary animate-spin" />
        </div>
      ) : hasConfirmationPassword ? (
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-skin-primary">Alterar senha de confirmação</h2>

          <ChangeConfirmationPassword />
        </div>
      ) : (
        <div className="w-full mt-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-skin-primary">Criar senha de confirmação</h2>

          <CreateConfirmationPassword setHasConfirmationPassword={setHasConfirmationPassword} />
        </div>
      )}
    </>
  );
}
