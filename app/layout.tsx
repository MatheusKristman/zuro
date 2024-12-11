import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { NextAuthSessionProvider } from "@/providers/sessionProvider";
import TRPCProvider from "@/providers/TRPCProvider";
import { Toaster } from "@/components/ui/sonner";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

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
            <ThemeProvider>{children}</ThemeProvider>
          </TRPCProvider>
        </NextAuthSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
