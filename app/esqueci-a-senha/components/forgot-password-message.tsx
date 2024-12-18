"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ForgotPasswordMessageProps {
  recoverEmail: string;
}

export function ForgotPasswordMessage({ recoverEmail }: ForgotPasswordMessageProps) {
  return (
    <div className="w-full flex flex-col items-center gap-6 bg-white rounded-3xl p-6 max-w-[450px]">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image src="/logo.svg" alt="Logo" width={80} height={80} className="object-contain object-center" />
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full flex flex-col items-center gap-6"
      >
        <h4 className="text-2xl font-bold text-center text-slate-800">Enviamos um e-mail para {recoverEmail}</h4>

        <p className="text-slate-600 text-center font-medium">
          Verifique sua caixa de entrada (e também a pasta de spam) para encontrar o link de recuperação de senha. Caso
          não receba o e-mail em alguns minutos, tente novamente ou entre em contato com o{" "}
          <a
            href={process.env.NEXT_PUBLIC_WHATSAPP_LINK!}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            suporte
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
