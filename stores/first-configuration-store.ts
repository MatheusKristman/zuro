import { create } from "zustand";

export type dayOffType =
  | ""
  | "Weekend"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
type availabilityType = {
  dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  hasInterval: boolean;
  startIntervalTime: string;
  endIntervalTime: string;
};

interface FirstConfigurationStoreInter {
  paymentPreference: "" | "before_after" | "before" | "after";
  setPaymentPreference: (value: "before_after" | "before" | "after") => void;
  pixKey: string;
  setPixKey: (value: string) => void;
  dayOff: dayOffType;
  setDayOff: (value: dayOffType) => void;
  availability: availabilityType[];
  setAvailability: (
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
    field: string,
    value: string | boolean
  ) => void;
  configurationError: {
    paymentPreference: string;
    pixKey: string;
    dayOff: string;
    availability: string[];
  };
  setConfigurationError: (value: {
    paymentPreference: string;
    pixKey: string;
    dayOff: string;
    availability: string[];
  }) => void;
  resetConfigurationError: () => void;
}

export const FirstConfigurationStore = create<FirstConfigurationStoreInter>((set) => ({
  paymentPreference: "",
  setPaymentPreference: (value) => set({ paymentPreference: value }),
  pixKey: "",
  setPixKey: (value) => set({ pixKey: value }),
  dayOff: "",
  setDayOff: (value) => set({ dayOff: value }),
  availability: [
    {
      dayOfWeek: "Sunday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Monday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Tuesday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Wednesday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Thursday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Friday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
    {
      dayOfWeek: "Saturday",
      startTime: "",
      endTime: "",
      hasInterval: false,
      startIntervalTime: "",
      endIntervalTime: "",
    },
  ],
  setAvailability: (dayOfWeek, field, value) =>
    set((state) => ({
      availability: state.availability.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day)),
    })),
  configurationError: {
    paymentPreference: "",
    pixKey: "",
    dayOff: "",
    availability: [],
  },
  setConfigurationError: (value) => set({ configurationError: value }),
  resetConfigurationError: () =>
    set({ configurationError: { paymentPreference: "", pixKey: "", dayOff: "", availability: [] } }),
}));
