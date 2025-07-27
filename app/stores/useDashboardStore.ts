import { create } from "zustand";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

type PreferenceState = {
  currency: Currency;
  theme: "light" | "dark";
  coin: string;
  days: number;
  setDays: (days: number) => void;
  setCoin: (coin: string) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: "light" | "dark") => void;
};

export const usePreferenceStore = create<PreferenceState>()((set) => ({
  currency: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "https://flagcdn.com/us.svg",
  },
  theme: "light",
  coin: "bitcoin",
  days:180,
  setDays: (days) => set({ days }),
  setCoin: (coin) => set({ coin }),
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
}));
