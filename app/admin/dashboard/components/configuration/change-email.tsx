"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { trpc } from "@/lib/trpc-client";

const formSchema = z
  .object({
    actualEmail: z.string().email("E-mail inválido").min(1, "E-mail atual é obrigatório"),
    newEmail: z.string().email("E-mail inválido").min(1, "Novo e-mail é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória"),
  })
  .superRefine(({ actualEmail, newEmail }, ctx) => {
    if (newEmail === actualEmail) {
      ctx.addIssue({
        code: "custom",
        message: "Os e-mails não podem ser iguais",
        path: ["newEmail"],
      });
    }
  });

export function ChangeEmail() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actualEmail: "",
      newEmail: "",
      password: "",
    },
  });

  const { mutate: changeEmail, isPending } = trpc.adminRouter.changeEmail.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);

        return;
      }

      toast.success(res.message);

      signOut({ redirectTo: "/" });
    },
    onError: (err) => {
      console.log(err);

      toast.error("Ocorreu um erro ao atualizar o e-mail da conta");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    changeEmail(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-6 flex flex-col gap-12 sm:gap-6 md:items-end">
        <div className="w-full flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="actualEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail atual</FormLabel>

                <FormControl>
                  <Input disabled={isPending} type="email" placeholder="Insira o e-mail atual" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Novo e-mail</FormLabel>

                <FormControl>
                  <Input disabled={isPending} type="email" placeholder="Insira o novo e-mail" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 md:col-span-1">
                <FormLabel>Senha de confirmação</FormLabel>

                <FormControl>
                  <Input disabled={isPending} type="password" placeholder="Insira a sua senha" {...field} />
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
