import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { Toaster } from "@/components/ui/sonner";
import TRPCProvider from "@/providers/TRPCProvider";
import { ThemeProvider } from "./components/theme-provider";
import { NextAuthSessionProvider } from "@/providers/sessionProvider";
import { TermsAndConditionsAlert } from "./components/terms-and-conditions-alert";

import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zuro",
  description:
    "Zuro - Plataforma inteligente de agendamento de horários. Simplifique reservas e otimize sua gestão com funcionalidades modernas e intuitivas para empresas e profissionais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.className} overflow-x-hidden antialiased`}>
        <NextAuthSessionProvider>
          <TRPCProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ThemeProvider>
              <TermsAndConditionsAlert />
              {children}
            </ThemeProvider>
          </TRPCProvider>
        </NextAuthSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
