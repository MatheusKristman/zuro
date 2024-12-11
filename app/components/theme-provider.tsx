"use client";

import { trpc } from "@/lib/trpc-client";
import { WebsiteStore } from "@/stores/website-store";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setColor } = WebsiteStore();

  const { data } = trpc.websiteRouter.getColor.useQuery();

  useEffect(() => {
    const updatePrimaryColor = (hex: string) => {
      setColor(hex);

      console.log({ hex });

      const hexToRgb = (hex: string) => {
        hex = hex.replace(/^#/, "");
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r} ${g} ${b}`;
      };

      // Atualiza o CSS no :root
      const root = document.documentElement;
      root.style.setProperty("--bg-primary", hexToRgb(hex));
    };

    if (data !== undefined) {
      console.log({ data });
      updatePrimaryColor(data.color);
    }
  }, [data]);

  return <>{children}</>;
}
