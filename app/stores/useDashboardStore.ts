import { create } from "zustand";
import { Coin } from "../constant/experienceData";

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
  CoinList: Coin[];
  setCoinList:(CoinList : Coin[])=> void;
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
  CoinList:[],
  setCoinList:(CoinList)=> set({CoinList}),
  setDays: (days) => set({ days }),
  setCoin: (coin) => set({ coin }),
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
}));
