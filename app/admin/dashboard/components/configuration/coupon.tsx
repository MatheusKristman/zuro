"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { trpc } from "@/lib/trpc-client";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do cumpom é obrigatório")
    .min(4, "O nome precisa ter no mínimo 4 caracteres"),
  percentage: z.coerce
    .number()
    .gte(0, "Valor precisa ser maior ou igual à zero")
    .lte(100, "Valor precisa ser menor ou igual á cem"),
  monthly: z.enum(["once", "forever"], { message: "Valor inválido" }),
});

interface CouponItemProps {
  id: string;
  name: string;
  percentage: number;
  duration: string;
}

function CouponItem({ id, name, percentage, duration }: CouponItemProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  const trpcUtils = trpc.useUtils();

  const { mutate: deleteCoupon, isPending: isDeletingCoupon } =
    trpc.adminRouter.deleteCoupon.useMutation({
      onSuccess: (res) => {
        toast.success(res.message);

        setDeleteConfirmation(false);
        trpcUtils.adminRouter.getCoupons.invalidate();
      },
      onError: (error) => {
        console.error(error);

        toast.error("Ocorreu um erro ao deletar o cupom");
      },
    });

  return (
    <div className="bg-skin-primary rounded-xl p-3 flex items-end justify-between gap-6">
      <div className="flex flex-col gap-2">
        <span className="bg-black/20 p-2 rounded-lg text-white font-semibold text-sm">
          {duration === "once" ? "Primeira mens." : "Todas mens."}
        </span>

        <span className="text-white text-lg font-bold">{name}</span>

        <span className="text-sm text-white/70 font-semibold">
          Desconto: {percentage}%
        </span>
      </div>

      <AlertDialog open={deleteConfirmation}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isDeletingCoupon}
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => setDeleteConfirmation(true)}
          >
            <Trash2 color="#FFF" className="!size-5" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esse cupom?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Esta ação não pode ser desfeita, e o cupom será removido
              permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className={buttonVariants({ size: "xl", variant: "outline" })}
              disabled={isDeletingCoupon}
              onClick={() => setDeleteConfirmation(false)}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              className={buttonVariants({ size: "xl", variant: "destructive" })}
              disabled={isDeletingCoupon}
              onClick={() => deleteCoupon({ couponId: id })}
            >
              Deletar
              {isDeletingCoupon && <Loader2 className="animate-spin" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Coupon() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      percentage: 0,
      monthly: "once",
    },
  });

  const trpcUtils = trpc.useUtils();
  const { data } = trpc.adminRouter.getCoupons.useQuery();
  const { mutate: createCoupon, isPending: isCreatingCoupon } =
    trpc.adminRouter.createCoupon.useMutation({
      onSuccess: (res) => {
        trpcUtils.adminRouter.getCoupons.invalidate();

        toast.success(res.message);
      },
      onError: (err) => {
        console.log(err);

        toast.error("Ocorreu um erro ao criar o cupom");
      },
    });

  const pending = isCreatingCoupon;

  console.log({ coupons: data?.coupons });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCoupon(values);
  }

  return (
    <div className="w-full mt-6 flex flex-col gap-12 md:flex-row md:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-3 rounded-xl bg-black/10 flex flex-col gap-8"
        >
          <div className="w-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Nome do Cupom</FormLabel>

                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder="Insira o nome do cupom"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Porcentagem do Cupom</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Insira a porcentagem do cupom"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      disabled={pending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthly"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Aplicação do cupom</FormLabel>

                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending}
                      className="w-full flex flex-col gap-2 sm:flex-row md:flex-col"
                    >
                      <ToggleGroupItem
                        variant="outline"
                        value="once"
                        className="w-full h-12 rounded-xl"
                      >
                        Primeira Mensalidade
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        variant="outline"
                        value="forever"
                        className="w-full h-12 rounded-xl"
                      >
                        Todas as Mensalidades
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={pending} size="xl" type="submit">
            Criar
          </Button>
        </form>
      </Form>

      <div className="w-full flex flex-col gap-2">
        <h4 className="text-2xl font-bold text-skin-primary">
          Cupons cadastrados
        </h4>

        {data !== undefined ? (
          <div className="w-full flex flex-col gap-4">
            {data.coupons.map((coupon) => (
              <CouponItem
                key={coupon.id}
                id={coupon.id}
                name={coupon.name}
                percentage={coupon.percentage}
                duration={coupon.duration}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
}
