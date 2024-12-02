import { create } from "zustand";

export type dayOffType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
type availabilityType = {
  dayOfWeek:
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";
  startTime: string;
  endTime: string;
  hasInterval: boolean;
  startIntervalTime: string;
  endIntervalTime: string;
};
type serviceType = {
  name: string;
  minutes: number;
  price: number;
};

type redirectionType = {
  previous: boolean;
  next: boolean;
};

interface FirstConfigurationStoreInter {
  redirection: redirectionType;
  setRedirection: (value: redirectionType) => void;
  paymentPreference: "" | "before_after" | "before" | "after";
  setPaymentPreference: (value: "before_after" | "before" | "after") => void;
  pixKey: string;
  setPixKey: (value: string) => void;
  dayOff: dayOffType[];
  setDayOff: (value: dayOffType[]) => void;
  availability: availabilityType[];
  setAvailability: (
    dayOfWeek:
      | "Sunday"
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday",
    field: string,
    value: string | boolean,
  ) => void;
  services: serviceType[];
  setServices: (value: serviceType) => void;
  setDefaultServices: (value: serviceType[]) => void;
  deleteService: (value: string) => void;
  configurationError: {
    paymentPreference: string;
    pixKey: string;
    dayOff: string;
    availability: string[];
    serviceName: string;
    serviceMinutes: string;
    servicePrice: string;
    services: string;
  };
  setConfigurationError: (value: {
    paymentPreference: string;
    pixKey: string;
    dayOff: string;
    availability: string[];
    serviceName: string;
    serviceMinutes: string;
    servicePrice: string;
    services: string;
  }) => void;
  resetConfigurationError: () => void;
}

export const FirstConfigurationStore = create<FirstConfigurationStoreInter>(
  (set) => ({
    redirection: {
      previous: false,
      next: false,
    },
    setRedirection: (value) => set({ redirection: value }),
    paymentPreference: "",
    setPaymentPreference: (value) => set({ paymentPreference: value }),
    pixKey: "",
    setPixKey: (value) => set({ pixKey: value }),
    dayOff: [],
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
        availability: state.availability.map((day) =>
          day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day,
        ),
      })),
    services: [],
    setServices: (value) =>
      set((state) => ({ services: [...state.services, value] })),
    setDefaultServices: (value) => set({ services: value }),
    deleteService: (value) =>
      set((state) => {
        const newServices = state.services.filter(
          (service) => service.name !== value,
        );

        return { services: newServices };
      }),
    configurationError: {
      paymentPreference: "",
      pixKey: "",
      dayOff: "",
      availability: [],
      serviceName: "",
      serviceMinutes: "",
      servicePrice: "",
      services: "",
    },
    setConfigurationError: (value) => set({ configurationError: value }),
    resetConfigurationError: () =>
      set({
        configurationError: {
          paymentPreference: "",
          pixKey: "",
          dayOff: "",
          availability: [],
          serviceName: "",
          serviceMinutes: "",
          servicePrice: "",
          services: "",
        },
      }),
  }),
);
