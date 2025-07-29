import { create } from "zustand";
import { Coin } from "../constant/experienceData";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};
type UserCoin = {
  coin: Coin;
  qty: number;
  purchasePrice: number;
};
type WalletDetails = {
  coinCount: number;
  totalAmount:number
}
type PreferenceState = {
  currency: Currency;
  theme: "light" | "dark";
  coin: string;
  days: number;
  CoinList: Coin[];
  Favorites: Coin[];
  Trending: TrendingData;
  loading: boolean;
  error: string | null;
  WalletCoin: UserCoin[];
  WalletDetails :WalletDetails
  setTrending: (Trending: TrendingData) => void;
  setWalletDetails: (details: WalletDetails) => void;
  setWalletCoin: (WalletCoin: UserCoin[]) => void;
  setFavorites: (Favorites: Coin[]) => void;
  setCoinList: (CoinList: Coin[]) => void;
  setDays: (days: number) => void;
  setCoin: (coin: string) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: "light" | "dark") => void;
  fetchCoinList: (currencyCode: string) => Promise<void>;
  fetchTrendingCoins: () => Promise<void>;
};
export type TrendingData = {
  coins: {
    item: CoinTrendingItem;
  }[];
  nfts: NftTrendingItem[];
  categories: CategoryTrendingItem[];
};

export type CoinTrendingItem = {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: {
      [currency: string]: number;
    };
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content: {
      title: string;
      description: string;
    } | null;
  };
};

export type NftTrendingItem = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  nft_contract_id: number;
  native_currency_symbol: string;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
  data: {
    floor_price: string;
    floor_price_in_usd_24h_percentage_change: string;
    h24_volume: string;
    h24_average_sale_price: string;
    sparkline: string;
    content: null;
  };
};

export type CategoryTrendingItem = {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data: {
    market_cap: number;
    market_cap_btc: number;
    total_volume: number;
    total_volume_btc: number;
    market_cap_change_percentage_24h: {
      [currency: string]: number;
    };
    sparkline: string;
  };
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
  days: 180,
  CoinList: [],
  Favorites: [],
  Trending: {
    coins: [],
    nfts: [],
    categories: [],
  },
  loading: false,
  error: null,
  WalletCoin: [],
  WalletDetails:{
    coinCount:0,
    totalAmount:0.0
  },
  setWalletDetails:(WalletDetails)=> set({WalletDetails}),
  setWalletCoin:(WalletCoin) => set({WalletCoin}),
  setTrending: (Trending) => set({ Trending }),
  setFavorites: (Favorites) => set({ Favorites }),
  setCoinList: (CoinList) => set({ CoinList }),
  setDays: (days) => set({ days }),
  setCoin: (coin) => set({ coin }),
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),

  fetchCoinList: async (currencyCode) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(
        `/api/crypto?currency=${currencyCode.toLowerCase()}`
      );
      const json = await res.json();
      set({ CoinList: json, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch CoinList", loading: false });
    }
  },

  fetchTrendingCoins: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      const json = await res.json();
      const trending = json;
      set({ Trending: trending, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch trending coins",
        loading: false,
      });
    }
  },
}));
