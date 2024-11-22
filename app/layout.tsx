import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { NextAuthSessionProvider } from "@/providers/sessionProvider";
import TRPCProvider from "@/providers/TRPCProvider";
import { Toaster } from "@/components/ui/sonner";
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

// TODO: adicionar depois uma request para resgatar o valor definido no banco de dados
// Função para converter HEX para RGB
// function hexToRgb(hex) {
//   const bigint = parseInt(hex.slice(1), 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;
//   return `${r}, ${g}, ${b}`;
// }

// const changePrimaryColor = (newColor) => {
//     document.documentElement.style.setProperty('--color-primary', newColor);
//     setColor(newColor);
//   };

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
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
          </TRPCProvider>
        </NextAuthSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
