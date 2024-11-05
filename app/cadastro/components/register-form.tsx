import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";

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
import { RegisterStore } from "@/stores/register-store";
import { trpc } from "@/lib/trpc-client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "O valor enviado para nome é invalido",
    })
    .min(1, "Nome é obrigatório")
    .min(4, "Nome precisa ter no mínimo 4 caracteres"),
  email: z
    .string({
      required_error: "E-mail é obrigatório",
      invalid_type_error: "O valor enviado para e-mail é invalido",
    })
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
});

const animation = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export function RegisterForm() {
  const { setRegistered } = RegisterStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { mutate: register, isPending } = trpc.userRouter.register.useMutation({
    onSuccess: () => {
      setRegistered(true);
    },
    onError: (error) => {
      console.error(error);

      if (error.data && error.data.code === "CONFLICT") {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro ao criar a conta");
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    register(values);
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={animation}
      className="w-full flex flex-col items-center gap-6"
    >
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Faça o seu cadastro
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">
                    Nome
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Insira o seu nome completo"
                      className="text-slate-800"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <Button
            type="submit"
            size="xl"
            className="w-full flex items-center gap-2"
          >
            Cadastrar
            {isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
