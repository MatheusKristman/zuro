"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import { RegisterForm } from "./components/register-form";
import { RegisterSuccessMessage } from "./components/register-success-message";
import { RegisterStore } from "@/stores/register-store";

export default function RegisterPage() {
  const { isRegistered } = RegisterStore();

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-skin-primary py-12 px-6">
      <div className="w-full flex flex-col items-center gap-6 bg-white overflow-hidden rounded-3xl p-6 max-w-[450px]">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain object-center"
        />

        <AnimatePresence initial={false} mode="wait">
          {isRegistered ? (
            <RegisterSuccessMessage key="register-success-message" />
          ) : (
            <RegisterForm key="register-form" />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
