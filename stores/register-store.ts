import { create } from "zustand";

interface RegisterStoreInter {
  isRegistered: boolean;
  setRegistered: (value: boolean) => void;
}

export const RegisterStore = create<RegisterStoreInter>((set) => ({
  isRegistered: false,
  setRegistered: (value) => set({ isRegistered: value }),
}));
