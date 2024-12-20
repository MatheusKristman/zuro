"use client";

import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCookie, setCookie } from "cookies-next/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TermsAndConditionsAlert() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const cookieValue = getCookie("acceptedTerms");

    setIsOpen(cookieValue !== "true");
  }, []);

  function acceptTerms() {
    setCookie("acceptedTerms", "true", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    setIsOpen(false);
  }

  function refuseTerms() {
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="terms-and-conditions"
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="max-w-[500px] w-full fixed bottom-6 right-6 z-50"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Termos e Condições</CardTitle>

              <CardDescription>
                Para continuar, é necessário aceitar os nossos Termos e
                Condições de Uso. Esses termos detalham como utilizamos os seus
                dados e como você pode usar nossos serviços.
              </CardDescription>

              <CardDescription>
                Ao clicar em &quot;Aceitar Termos&quot;, você declara que leu e
                concorda com nossos{" "}
                <a
                  href="https://zuroagenda.com/termos-de-uso/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline text-skin-primary"
                >
                  Termos e Condições
                </a>{" "}
                e nossa{" "}
                <a
                  href="https://zuroagenda.com/politicas-de-privacidade/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline text-skin-primary"
                >
                  Política de Privacidade
                </a>
                .
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-end gap-4">
              <Button onClick={refuseTerms} size="xl" variant="outline">
                Recusar
              </Button>

              <Button onClick={acceptTerms} size="xl">
                Aceitar Termos
                <CheckCheck />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
