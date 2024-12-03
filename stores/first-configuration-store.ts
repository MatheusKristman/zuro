import { create } from "zustand";

export type AvailableTimesType = {
  startTime: string;
  endTime: string;
};

export type dayOffType = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
type availabilityType = {
  dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  availableTimes: AvailableTimesType[];
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
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
    index: number,
    field: string,
    value: string | boolean
  ) => void;
  setDefaultAvailability: (
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
    value: AvailableTimesType[]
  ) => void;
  addAvailableTime: (
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
  ) => void;
  removeAvailableTime: (
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday",
    index: number
  ) => void;
  resetAvailableTime: (
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"
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

export const FirstConfigurationStore = create<FirstConfigurationStoreInter>((set) => ({
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
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Monday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Tuesday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Wednesday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Thursday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Friday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
    {
      dayOfWeek: "Saturday",
      availableTimes: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
  ],
  setAvailability: (dayOfWeek, index, field, value) =>
    set((state) => ({
      availability: state.availability.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              availableTimes: day.availableTimes.map((time, idx) =>
                idx === index ? { ...time, [field]: value } : time
              ),
            }
          : day
      ),
    })),
  setDefaultAvailability: (dayOfWeek, value) =>
    set((state) => ({
      availability: state.availability.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, availableTimes: value } : day
      ),
    })),
  addAvailableTime: (dayOfWeek) =>
    set((state) => ({
      availability: state.availability.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              availableTimes: [...day.availableTimes, { startTime: "", endTime: "" }],
            }
          : day
      ),
    })),
  removeAvailableTime: (dayOfWeek, index) =>
    set((state) => ({
      availability: state.availability.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              availableTimes: day.availableTimes.filter((time, idx) => idx !== index),
            }
          : day
      ),
    })),
  resetAvailableTime: (dayOfWeek) =>
    set((state) => ({
      availability: state.availability.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, availableTimes: [{ startTime: "", endTime: "" }] } : day
      ),
    })),
  services: [],
  setServices: (value) => set((state) => ({ services: [...state.services, value] })),
  setDefaultServices: (value) => set({ services: value }),
  deleteService: (value) =>
    set((state) => {
      const newServices = state.services.filter((service) => service.name !== value);

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
}));
