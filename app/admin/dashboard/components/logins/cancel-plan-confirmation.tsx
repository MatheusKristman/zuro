"use client";

import { useState } from "react";
import { toast } from "sonner";

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

import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CancelPlanConfirmationProps {
  stripeSubscriptionId: string;
  handleGetUsers: () => void;
}

export function CancelPlanConfirmation({
  stripeSubscriptionId,
  handleGetUsers,
}: CancelPlanConfirmationProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: cancelPlan, isPending } =
    trpc.adminRouter.cancelPlan.useMutation({
      onSuccess: (res) => {
        toast.success(res.message);

        handleGetUsers();
        setIsOpen(false);
      },
      onError: (err) => {
        console.log(err);

        toast.error("Ocorreu um erro ao cancelar o plano");
      },
    });

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger
        onClick={() => setIsOpen(true)}
        className={cn(
          buttonVariants({ size: "xl", variant: "destructive" }),
          "w-full",
        )}
      >
        Cancelar plano
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">
            Tem certeza que deseja cancelar o plano?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-600">
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setIsOpen(false)}
            className={cn(buttonVariants({ size: "xl", variant: "outline" }))}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={() => cancelPlan({ stripeSubscriptionId })}
            className={cn(
              buttonVariants({ size: "xl", variant: "destructive" }),
            )}
          >
            Confirmar
            {isPending && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
