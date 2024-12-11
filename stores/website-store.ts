import { create } from "zustand";

interface WebsiteStoreInterface {
  color: string;
  setColor: (value: string) => void;
}

export const WebsiteStore = create<WebsiteStoreInterface>((set) => ({
  color: "#5171E1",
  setColor: (value) => set({ color: value }),
}));
