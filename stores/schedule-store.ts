import { create } from "zustand";

type errorType = {
  service: string;
  time: string;
};

interface ScheduleStoreInter {
  service: string;
  setService: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  error: errorType;
  setError: (value: errorType) => void;
  resetError: () => void;
}

export const ScheduleStore = create<ScheduleStoreInter>((set) => ({
  service: "",
  setService: (value) => set({ service: value }),
  time: "",
  setTime: (value) => set({ time: value }),
  error: { service: "", time: "" },
  setError: (value) => set({ error: value }),
  resetError: () => set({ error: { service: "", time: "" } }),
}));
