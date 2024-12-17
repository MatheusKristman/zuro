"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { ForgotPasswordForm } from "./components/forgot-password-form";
import { ForgotPasswordMessage } from "./components/forgot-password-message";

export default function ForgotPasswordPage() {
  const [sendedRecoverMail, setSendedRecoverMail] = useState<boolean>(false);
  const [recoverEmail, setRecoverEmail] = useState<string>("");

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-background py-12 px-6">
      <AnimatePresence initial={false} mode="wait">
        {sendedRecoverMail ? (
          <ForgotPasswordMessage
            key="recover-password-message"
            recoverEmail={recoverEmail}
          />
        ) : (
          <ForgotPasswordForm
            key="recover-password-form"
            setSendedRecoverMail={setSendedRecoverMail}
            setRecoverEmail={setRecoverEmail}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
