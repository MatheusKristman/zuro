import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
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

import { RegisterStore } from "@/stores/register-store";
import { trpc } from "@/lib/trpc-client";

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
  checkoutId: z
    .string({
      required_error: "ID do checkout é obrigatório",
      invalid_type_error: "O valor enviado para o ID do checkout é inválido",
    })
    .min(1, "ID do checkout é obrigatório"),
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

function RegisterFormComponent() {
  const { setRegistered } = RegisterStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams.get("checkout");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      checkoutId: checkoutId ?? "",
    },
  });

  useEffect(() => {
    if (!checkoutId) {
      router.replace("/");

      toast.error("Acesso não autorizado");

      return;
    }

    form.setValue("checkoutId", checkoutId);
  }, [checkoutId]);

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

export function RegisterForm() {
  return (
    <Suspense>
      <RegisterFormComponent />
    </Suspense>
  );
}
