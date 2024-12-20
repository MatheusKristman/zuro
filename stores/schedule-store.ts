import { create } from "zustand";

type errorType = {
  date: string;
  service: string;
  time: string;
  fullName: string;
  cpf: string;
  email: string;
  tel: string;
};

interface ScheduleStoreInter {
  service: string;
  setService: (value: string) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  time: string;
  setTime: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  tel: string;
  setTel: (value: string | undefined) => void;
  message: string;
  setMessage: (value: string) => void;
  isConclude: boolean;
  setIsConclude: (value: boolean) => void;
  error: errorType;
  setError: (value: errorType) => void;
  resetError: () => void;
}

export const ScheduleStore = create<ScheduleStoreInter>((set) => ({
  service: "",
  setService: (value) => set({ service: value }),
  date: new Date(),
  setDate: (value) => set({ date: value }),
  time: "",
  setTime: (value) => set({ time: value }),
  fullName: "",
  setFullName: (value) => set({ fullName: value }),
  cpf: "",
  setCpf: (value) => set({ cpf: value }),
  email: "",
  setEmail: (value) => set({ email: value }),
  tel: "",
  setTel: (value) => set({ tel: value }),
  message: "",
  setMessage: (value) => set({ message: value }),
  isConclude: false,
  setIsConclude: (value) => set({ isConclude: value }),
  error: {
    date: "",
    service: "",
    time: "",
    fullName: "",
    cpf: "",
    email: "",
    tel: "",
  },
  setError: (value) => set({ error: value }),
  resetError: () =>
    set({
      error: {
        date: "",
        service: "",
        time: "",
        fullName: "",
        cpf: "",
        email: "",
        tel: "",
      },
    }),
}));
