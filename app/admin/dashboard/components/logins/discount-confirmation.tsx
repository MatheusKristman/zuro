import { toast } from "sonner";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DiscountConfirmationProps {
  subscriptionId: string;
  handleGetUsers: () => void;
}

export function DiscountConfirmation({
  subscriptionId,
  handleGetUsers,
}: DiscountConfirmationProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [couponId, setCouponId] = useState<string>("");

  const {
    data: subscriptionCouponId,
    isPending: isGettingSubscriptionCouponId,
  } = trpc.adminRouter.getSubscriptionCoupon.useQuery({
    subscriptionId: subscriptionId,
  });
  const { data, isPending } = trpc.adminRouter.getCoupons.useQuery();
  const { mutate: addDiscount, isPending: isAddingDiscount } =
    trpc.adminRouter.addDiscount.useMutation({
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message);

          return;
        }

        toast.success(res.message);

        handleGetUsers();

        setIsOpen(false);
      },
      onError: (err) => {
        console.log(err);

        toast.error("Ocorreu um erro ao adicionar o desconto no plano");
      },
    });

  const loading = isPending || isGettingSubscriptionCouponId;

  // NOTE: checa se o valor mudou para habilitar o botão de submit
  const couponChange = couponId === subscriptionCouponId?.couponId;

  function handleCouponId(id: string) {
    if (!isAddingDiscount) {
      if (couponId === id) {
        setCouponId("");
      } else {
        setCouponId(id);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "xl", variant: "confirm" }),
          "w-full",
        )}
      >
        Aplicar desconto
      </DialogTrigger>

      <DialogContent className="h-full sm:h-fit">
        <DialogHeader>
          <DialogTitle className="text-skin-primary font-bold text-xl sm:text-2xl">
            Cupons disponiveis
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="w-full flex flex-col items-center">
            <Loader2
              strokeWidth={1.5}
              className="animate-spin size-16 text-skin-primary"
            />
          </div>
        ) : (
          <ScrollArea className="w-full max-h-[300px] overflow-y-auto">
            <div className="w-full flex flex-col gap-4">
              {data && data.coupons.length > 0 ? (
                data.coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    role="button"
                    onClick={() => handleCouponId(coupon.stripeCouponId)}
                    className="bg-skin-primary rounded-xl p-3 flex items-center justify-between gap-6"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="bg-black/20 p-2 rounded-lg text-white font-semibold text-sm">
                        {coupon.duration === "once"
                          ? "Primeira mens."
                          : "Todas mens."}
                      </span>

                      <span className="text-white text-lg font-bold">
                        {coupon.name}
                      </span>

                      <span className="text-sm text-white/70 font-semibold">
                        Desconto: {coupon.percentage}%
                      </span>
                    </div>

                    <div className="size-8 bg-black/20 rounded-lg flex items-center justify-center">
                      {couponId === coupon.stripeCouponId && (
                        <Check color="#FFF" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-center text-skin-primary/70 text-lg font-bold">
                    Nenhum cupom disponível
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="w-full flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            onClick={() => setIsOpen(false)}
            variant="destructive"
            size="xl"
            disabled={loading || isAddingDiscount}
          >
            Cancelar
          </Button>

          {/* TODO: adicionar verificação para disabilitar quando o valor do couponId for diferente do cupom que já esta habilitado ou caso não tenha */}
          <Button
            disabled={loading || couponChange}
            variant="confirm"
            size="xl"
            onClick={() => addDiscount({ subscriptionId, couponId })}
          >
            Aplicar
            {isAddingDiscount && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
