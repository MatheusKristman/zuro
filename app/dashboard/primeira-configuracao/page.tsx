"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PaymentPreference } from "@/app/dashboard/components/payment-preference";

import { cn } from "@/lib/utils";

export default function FirstConfigurationPage() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  return (
    <main className="h-full lg:absolute lg:top-0 lg:left-[450px] lg:w-[calc(100%-450px)]">
      <div className="w-full h-full max-w-4xl mx-auto flex flex-col justify-between px-6 pt-6 pb-16">
        <div className="flex flex-col items-center gap-2 mt-10">
          <h2 className="text-3xl font-bold text-center text-white">Configure a sua conta</h2>

          <div className="w-full flex items-center justify-between gap-2 max-w-[250px]">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "size-6 rounded-full border-2 border-white/50 flex items-center justify-center",
                      "border-white"
                    )}
                  >
                    <div className="bg-white size-4 rounded-full" />
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center")}>
                    {/* <div className="bg-white size-4 rounded-full" /> */}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center")}>
                    {/* <div className="bg-white size-4 rounded-full" /> */}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center")}>
                    {/* <div className="bg-white size-4 rounded-full" /> */}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center")}>
                    {/* <div className="bg-white size-4 rounded-full" /> */}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className={cn("size-6 rounded-full border-2 border-white/50 flex items-center justify-center")}>
                    {/* <div className="bg-white size-4 rounded-full" /> */}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-skin-primary text-lg font-semibold rounded-xl">
                  Preferencia de pagamento
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-grow mt-24">
          <PaymentPreference />
        </div>

        <div className="w-full flex justify-end mt-12">
          <Button variant="secondary" size="xl">
            Próximo
          </Button>
        </div>
      </div>
    </main>
  );
}
