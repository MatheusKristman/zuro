"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";

interface RemoveCouponConfirmationProps {
  stripeSubscriptionId: string;
  handleGetUsers: () => void;
}

export function RemoveCouponConfirmation({
  stripeSubscriptionId,
  handleGetUsers,
}: RemoveCouponConfirmationProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: removeDiscount, isPending } =
    trpc.adminRouter.removeDiscount.useMutation({
      onSuccess: (res) => {
        toast.success(res.message);

        handleGetUsers();

        setIsOpen(false);
      },
      onError: (err) => {
        console.error(err);

        toast.error("Ocorreu um erro ao remover o desconto");
      },
    });

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger
        className={cn(buttonVariants({ size: "xl", variant: "secondary" }))}
        onClick={() => setIsOpen(true)}
      >
        Remover Desconto
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">
            Tem certeza que deseja remover o desconto?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-600">
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ size: "xl", variant: "outline" }))}
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className={cn(
              buttonVariants({ size: "xl", variant: "destructive" }),
            )}
            disabled={isPending}
            onClick={() => removeDiscount({ stripeSubscriptionId })}
          >
            Remover
            {isPending && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
