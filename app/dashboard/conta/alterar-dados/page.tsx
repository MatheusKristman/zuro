"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc-client";
import { Form, FormField, FormLabel, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const changeEmailSchema = z.object({
  newEmail: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
});

export default function ChangeAccountDataPage() {
  const [newName, setNewName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const util = trpc.useUtils();
  const { mutate: updateName, isPending: isNameUpdating } = trpc.userRouter.updateName.useMutation({
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.message);

        return;
      }

      util.userRouter.getUser.invalidate();
      setNewName("");
      toast.success(res.message);
    },
    onError: (err) => {
      console.error(err);

      toast.error("Ocorreu um erro ao atualizar o nome da conta");
    },
  });
  const { mutate: sendConfirmationCodeToMail, isPending: isSendingConfirmationCode } =
    trpc.userRouter.sendConfirmationCodeToMail.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);

          return;
        }

        toast.success(res.message);

        setCode("");
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao enviar o código no e-mail cadastrado");
      },
    });
  const { mutate: confirmChangeEmailCode, isPending: isConfirmingCode } =
    trpc.userRouter.confirmChangeEmailCode.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);

          return;
        }

        toast.success(res.message);
        signOut({ redirectTo: "/" });
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao atualizar o e-mail da conta");
      },
    });

  const pending = isNameUpdating || isSendingConfirmationCode || isConfirmingCode;

  function onSubmit(values: z.infer<typeof changeEmailSchema>) {
    sendConfirmationCodeToMail(values);
  }

  function handleUpdateName() {
    if (newName.length <= 4) {
      if (newName.length === 0) {
        setNameError("Nome é obrigatório");

        return;
      } else {
        setNameError("Nome precisa ter no mínimo 4 caracteres");

        return;
      }
    }

    setNameError("");

    updateName({ newName });
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container flex flex-col justify-between mb-12">
        <h2 className="text-3xl font-bold text-center text-white mt-10">Alterar Dados</h2>

        <div className="w-full flex flex-col gap-10 mt-10">
          <div className="w-full bg-white rounded-3xl p-6 ">
            <div className="space-y-2 w-full">
              <div className="w-full flex flex-col gap-12 sm:flex-row sm:items-end sm:gap-4">
                <div className="space-y-2 w-full">
                  <Label className="text-slate-600 font-bold" htmlFor="name">
                    Nome
                  </Label>

                  <Input
                    id="name"
                    placeholder="Insira o novo nome"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={pending}
                  />
                </div>

                <Button size="xl" disabled={pending} onClick={handleUpdateName}>
                  {pending && <Loader2 className="animate-spin" />}
                  Salvar
                </Button>
              </div>

              {nameError && <span className="text-sm text-destructive">{nameError}</span>}
            </div>
          </div>

          <div className="w-full bg-white rounded-3xl p-6 flex flex-col gap-12">
            <div className="w-full flex flex-col gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-4 sm:flex-row sm:items-end"
                >
                  <FormField
                    control={form.control}
                    name="newEmail"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-600 font-bold">E-mail</FormLabel>

                        <FormControl>
                          <Input disabled={pending} placeholder="Insira o e-mail que deseja trocar" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={pending}
                    size="xl"
                    className={cn(form.formState.errors.newEmail && "sm:mb-[28px]")}
                  >
                    Enviar código
                    {isSendingConfirmationCode && <Loader2 className="animate-spin" />}
                  </Button>
                </form>
              </Form>

              <div className="space-y-2 w-full">
                <Label className="text-slate-600 font-bold" htmlFor="confirmationCode">
                  Código de confirmação
                </Label>

                <Input
                  disabled={pending}
                  id="confirmationCode"
                  placeholder="Insira o código que foi enviado no e-mail acima"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 sm:flex-row">
              <Button disabled={pending} size="xl" variant="outline" className="w-full" asChild>
                {pending ? <span>Voltar</span> : <Link href="/dashboard/conta">Voltar</Link>}
              </Button>

              <Button
                disabled={code.length < 6 || pending}
                onClick={() => confirmChangeEmailCode({ code })}
                size="xl"
                className="w-full"
              >
                Salvar
                {isConfirmingCode && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
