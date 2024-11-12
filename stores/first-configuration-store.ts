import { create } from "zustand";

interface FirstConfigurationStoreInter {
  paymentPreference: "before_after" | "before" | "after";
  setPaymentPreference: (value: "before_after" | "before" | "after") => void;
  pixKey: string;
  setPixKey: (value: string) => void;
  configurationError: {
    paymentPreference: string;
    pixKey: string;
  };
  setConfigurationError: (value: {
    paymentPreference: string;
    pixKey: string;
  }) => void;
  resetConfigurationError: () => void;
}

export const FirstConfigurationStore = create<FirstConfigurationStoreInter>(
  (set) => ({
    paymentPreference: "before_after",
    setPaymentPreference: (value) => set({ paymentPreference: value }),
    pixKey: "",
    setPixKey: (value) => set({ pixKey: value }),
    configurationError: {
      paymentPreference: "",
      pixKey: "",
    },
    setConfigurationError: (value) => set({ configurationError: value }),
    resetConfigurationError: () =>
      set({ configurationError: { paymentPreference: "", pixKey: "" } }),
  }),
);
