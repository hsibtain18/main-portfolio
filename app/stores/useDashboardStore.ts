import { create } from "zustand";
import { Coin } from "../constant/experienceData";
import { apiGet, apiPut, apiPost } from "@/lib/apis";

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
  entryID?: string;
};
type WalletDetails = {
  coinCount: number;
  totalAmount: number;
};
type WalletEntryResponse = {
  userId: string;
  qty: number;
  createdAt: string;
  amount: number;
  price: number;
  description: string;
  coinId: string;
  type: string;
  entryID: string;
};
type PreferenceState = {
  currency: Currency;
  theme: "light" | "dark";
  coin: string;
  days: number;
  CoinList: Coin[];
  Favorites: Coin[];
  Trending: TrendingData;
  subID: string;
  loading: boolean;
  error: string | null;
  WalletCoin: UserCoin[];
  WalletDetails: WalletDetails;
  setTrending: (Trending: TrendingData) => void;
  setWalletDetails: (details: WalletDetails) => void;
  setWalletCoin: (WalletCoin: UserCoin[]) => void;
  setFavorites: (favorites: Coin[] | ((prev: Coin[]) => Coin[])) => void;
  setCoinList: (CoinList: Coin[]) => void;
  setDays: (days: number) => void;
  setCoin: (coin: string) => void;
  setSubID: (subID: string) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: "light" | "dark") => void;
  fetchCoinList: (currencyCode: string) => Promise<void>;
  fetchTrendingCoins: () => Promise<void>;
  addCoinToWallet: (coin: Coin, qty: number) => Promise<void>;
  recalculateWalletDetails: () => void;
  fetchWalletCoins: () => Promise<void>;
  loadAllData: () => Promise<void>;
  reloadAllData: () => Promise<void>;
  fetchPreferences: (userId: string) => Promise<{ theme: "light" | "dark"; currency: Currency } | null>;
  // Preferences Updaters
  toggleTheme: () => Promise<"light" | "dark" | null>;
  changeCurrency: (newCurrency: Currency) => Promise<void>;
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
export const usePreferenceStore = create<PreferenceState>()((set, get) => ({
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
  WalletDetails: {
    coinCount: 0,
    totalAmount: 0.0,
  },
  subID: "",
  setSubID: (subID) => set({ subID }),
  setWalletDetails: (WalletDetails) => set({ WalletDetails }),
  setWalletCoin: (WalletCoin) => set({ WalletCoin }),
  setTrending: (Trending) => set({ Trending }),
  setFavorites: (favorites) =>
    set((state) => ({
      Favorites:
        typeof favorites === "function"
          ? favorites(state.Favorites)
          : favorites,
    })),
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
  fetchWalletCoins: async () => {
    const { subID, CoinList } = get();
    if (!subID) return;

    try {
      set({ loading: true, error: null });

      const res = await apiGet(`wallet/${subID}`, subID);

      const entries = res as WalletEntryResponse[];

      const walletCoins = entries
        .map((entry) => {
          const coin = CoinList.find((c) => c.id === entry.coinId);
          if (!coin) return null;

          return {
            coin,
            qty: entry.qty,
            purchasePrice: entry.price,
            entryID: entry.entryID,
          };
        })
        .filter(Boolean) as UserCoin[]; // typecast after filtering nulls

      set({ WalletCoin: walletCoins });
      get().recalculateWalletDetails();
      set({ loading: false });
    } catch (err: any) {
      console.error("Error fetching wallet coins:", err);
      set({
        error: err.message || "Failed to fetch wallet coins",
        loading: false,
      });
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
  recalculateWalletDetails: () => {
    const { WalletCoin } = get();
    const coinCount = WalletCoin.length;
    const totalAmount = WalletCoin.reduce(
      (sum, item) => sum + item.qty * item.coin.current_price,
      0
    );
    set({ WalletDetails: { coinCount, totalAmount } });
  },

  addCoinToWallet: async (coin, qty) => {
    const { WalletCoin, subID } = get();
    const type = "purchase";
    const amount = qty * coin.current_price;
    const description = `Added ${qty} ${coin.symbol.toUpperCase()} at ${
      coin.current_price
    } ${get().currency.code}`;

    const newEntry = {
      coin,
      qty,
      purchasePrice: coin.current_price,
    };

    set(() => ({
      WalletCoin: [...WalletCoin, newEntry],
    }));
    get().recalculateWalletDetails();
    try {
      await apiPost(`wallet/`, subID, {
        amount,
        type,
        description,
        coinId: coin.id,
        qty,
        price: coin.current_price,
      });
    } catch (err) {
      console.error("Failed to sync wallet entry with backend:", err);
    }
  },
fetchPreferences: async (userId: string) => {
  try {
    const res: any = await apiGet(`preferences/${userId}`, userId);
    const preferences = res.preferences || {};

    const theme = preferences.theme || "light";
    const currency =
      preferences.currency || {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        flag: "https://flagcdn.com/us.svg",
      };

    set({ theme, currency });
    return { theme, currency }; // ✅ return for usage in UI
  } catch (err) {
    console.error("Failed to fetch preferences:", err);
    return null;
  }
},

  
toggleTheme: async () => {
  const newTheme = get().theme === "light" ? "dark" : "light";
  set({ theme: newTheme });

  try {
    await apiPost(`preferences`, '', {
      theme: newTheme,
      currency: get().currency,
      userId: get().subID,
    });

    return newTheme;  
  } catch (err) {
    console.error("Failed to update theme:", err);
    return null; 
  }
},

  // === Change Currency ===
  changeCurrency: async (newCurrency: Currency) => {
    set({ currency: newCurrency });
    try {
      await apiPost(`preferences`,'', {
        currency: newCurrency,
        theme: get().theme,
        userId: get().subID,
      });
    } catch (err) {
      console.error("Failed to update currency:", err);
    }
  },
  loadAllData: async () => {
    const subID = get().subID;
    if (!subID) return;

    try {
      // 1. Fetch user preferences first
      await get().fetchPreferences(subID);
      // 2. Fetch coin list based on loaded currency code
      const currencyCode = get().currency.code;
      await get().fetchCoinList(currencyCode);

      // 3. Fetch wallet coins now
      await get().fetchWalletCoins();
    } catch (err) {
      console.error("Error loading all data:", err);
    }
  },

  // Reload method (calls loadAllData)
  reloadAllData: async () => {
    await get().loadAllData();
  },
}));