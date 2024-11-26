import { create } from "zustand";

type errorType = {
  service: string;
  time: string;
  fullName: string;
  email: string;
  tel: string;
};

interface ScheduleStoreInter {
  service: string;
  setService: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  tel: string;
  setTel: (value: string | undefined) => void;
  message: string;
  setMessage: (value: string) => void;
  error: errorType;
  setError: (value: errorType) => void;
  resetError: () => void;
}

export const ScheduleStore = create<ScheduleStoreInter>((set) => ({
  service: "",
  setService: (value) => set({ service: value }),
  time: "",
  setTime: (value) => set({ time: value }),
  fullName: "",
  setFullName: (value) => set({ fullName: value }),
  email: "",
  setEmail: (value) => set({ email: value }),
  tel: "",
  setTel: (value) => set({ tel: value }),
  message: "",
  setMessage: (value) => set({ message: value }),
  error: {
    service: "",
    time: "",
    fullName: "",
    email: "",
    tel: "",
  },
  setError: (value) => set({ error: value }),
  resetError: () =>
    set({
      error: {
        service: "",
        time: "",
        fullName: "",
        email: "",
        tel: "",
      },
    }),
}));
