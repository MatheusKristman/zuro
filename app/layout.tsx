import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { NextAuthSessionProvider } from "@/providers/sessionProvider";

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
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
