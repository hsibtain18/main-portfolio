"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import CryptoChart from "@/app/components/CryptoChart";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coin } from "@/app/constant/experienceData";
import { apiDelete, apiGet, apiPost } from "@/lib/apis";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ITEMS_PER_PAGE = 10;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

type SortKey =
  | "market_cap_rank"
  | "name"
  | "market_cap"
  | "price_change_percentage_1h_in_currency"
  | "price_change_percentage_24h_in_currency"
  | "price_change_percentage_7d_in_currency"
  | "current_price";

type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export default function CryptoTable() {
  const [sortState, setSortState] = useState<SortState[]>([
    { key: "market_cap_rank", direction: "asc" },
  ]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    fetchCoinList,
    fetchTrendingCoins,
    currency,
    CoinList,
    Favorites,
    setCoin,
    setFavorites,
    subID,
  } = usePreferenceStore();

  function compareValues<T>(a: T, b: T, direction: SortDirection): number {
    if (typeof a === "string" && typeof b === "string") {
      return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    }
    if (typeof a === "number" && typeof b === "number") {
      return direction === "asc" ? a - b : b - a;
    }
    return 0;
  }

const sortedData = Array.isArray(CoinList)
  ? [...CoinList].sort((a, b) => {
      for (const { key, direction } of sortState) {
        const aVal = a[key];
        const bVal = b[key];
        const result = compareValues(aVal, bVal, direction);
        if (result !== 0) return result;
      }
      return 0;
    })
  : [];

  const filteredData = sortedData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isFavorite = (coin: Coin) =>
    Favorites.some((fav) => fav.id === coin.id);

  const toggleFavorite = async (coin: Coin) => {
    if (!subID) {
      console.warn("User not logged in, cannot toggle favorite.");
      return;
    }
    const isAlreadyFavorite = isFavorite(coin);
    if (isAlreadyFavorite) {
      try {
        await apiDelete(`wishlist/${subID}/${coin.id}`, subID);
        setFavorites(Favorites.filter((fav) => fav.id !== coin.id));
      } catch (err) {
        console.error("Error deleting favorite:", err);
      }
    } else {
      try {
        await apiPost("wishlist/", subID, { itemId: coin.id, userId: subID });
        setFavorites([...Favorites, coin]);
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }
  };

  const handleSort = (key: SortKey) => {
    setSortState((prev) => {
      const existingIndex = prev.findIndex((s) => s.key === key);
      if (existingIndex >= 0) {
        const newDirection =
          prev[existingIndex].direction === "asc" ? "desc" : "asc";
        const newSort = [...prev];
        newSort[existingIndex] = { key, direction: newDirection };
        return newSort;
      } else {
        return [{ key, direction: "asc" }, ...prev];
      }
    });
    setCurrentPage(1);
  };

  const reloadData = async () => {
    await fetchCoinList(currency.code);
    await fetchTrendingCoins();

    if (subID) {
     await apiGet("wallet/" + subID, subID).then((val) => {});
      try {
        const favIds: string[] = await apiGet(`wishlist/${subID}`, subID);

        // Retry logic for fetching favCoins if CoinList is empty
        let favCoins: Coin[] = [];
        let retries = 0;
        const maxRetries = 5;
        const retryDelayMs = 1000;

        while (
          usePreferenceStore.getState().CoinList.length === 0 &&
          retries < maxRetries
        ) {
          console.log(
            `CoinList is empty, retrying in ${
              retryDelayMs / 1000
            }s... (Attempt ${retries + 1}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          retries++;
        }

        // After the loop, check if CoinList has data and then filter
        const currentCoinList = usePreferenceStore.getState().CoinList;
        if (currentCoinList.length > 0) {
          favCoins = currentCoinList.filter((coin) => favIds.includes(coin.id));
        }

        setFavorites(favCoins);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }

    setLastUpdated(new Date());
  };

  useEffect(() => {
    if (!currency.code) return;
    reloadData();

    const interval = setInterval(reloadData, REFRESH_INTERVAL_MS);
    setMounted(true);
    return () => clearInterval(interval);
  }, [currency.code, subID]);

  const handleExpand = (coinId: string) => {
    if (expandedRow === coinId) {
      setExpandedRow(null);
      return;
    }
    setCoin(coinId);
    setExpandedRow(coinId);
    setLoadingChart(true);
    setLoadingChart(false);
  };

  if (!mounted) return null;

  const renderSortableHeader = (label: string, key: SortKey) => {
    const sortIndex = sortState.findIndex((s) => s.key === key);
    const isSorted = sortIndex !== -1;
    const direction = isSorted ? sortState[sortIndex].direction : "asc";

    return (
      <TableHead>
        <button
          onClick={() => handleSort(key)}
          className="flex items-center group text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-sort={
            isSorted
              ? direction === "asc"
                ? "ascending"
                : "descending"
              : "none"
          }
          type="button"
        >
          {label}
          {isSorted ? (
            <ChevronUp
              className={`ml-1 h-4 w-4 transition-transform ${
                direction === "desc" ? "rotate-180" : ""
              }`}
            />
          ) : (
            <ChevronUp className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-40" />
          )}
          {/* {isSorted && sortState.length > 1 && (
            <span className="ml-1 text-xs text-muted-foreground select-none">
              {sortIndex + 1}
            </span>
          )} */}
        </button>
      </TableHead>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Filter coins by name or symbol..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        {lastUpdated && (
          <Badge variant="outline" className="text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {subID && <TableHead>Favorite</TableHead>}
            {renderSortableHeader("Rank", "market_cap_rank")}
            <TableHead>Icon</TableHead>
            {renderSortableHeader("Name", "name")}
            <TableHead>Symbol</TableHead>
            {renderSortableHeader("Market Cap", "market_cap")}
            {renderSortableHeader(
              "1h %",
              "price_change_percentage_1h_in_currency"
            )}
            {renderSortableHeader(
              "24h %",
              "price_change_percentage_24h_in_currency"
            )}
            {renderSortableHeader(
              "7d %",
              "price_change_percentage_7d_in_currency"
            )}
            {renderSortableHeader(`Price (${currency.code})`, "current_price")}
            <TableHead className="text-right">Expand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((coin) => (
            <React.Fragment key={coin.id}>
              <TableRow onClick={() => handleExpand(coin.id)}>
                {subID && (
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coin);
                      }}
                    >
                      {isFavorite(coin) ? (
                        <Bookmark
                          className="text-red-500 fill-red-500"
                          size={16}
                        />
                      ) : (
                        <BookmarkCheck
                          className="text-muted-foreground"
                          size={16}
                        />
                      )}
                    </Button>
                  </TableCell>
                )}
                <TableCell>{coin.market_cap_rank}</TableCell>
                <TableCell>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                </TableCell>
                <TableCell>{coin.name}</TableCell>
                <TableCell className="uppercase">{coin.symbol}</TableCell>
                <TableCell>
                  {currency.symbol} {coin.market_cap.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`font-medium ${
                    coin.price_change_percentage_1h_in_currency >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_1h_in_currency.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={`font-medium ${
                    coin.price_change_percentage_24h_in_currency >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h_in_currency.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={`font-medium ${
                    coin.price_change_percentage_7d_in_currency >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_7d_in_currency.toFixed(2)}%
                </TableCell>
                <TableCell>
                  {currency.symbol} {coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(coin.id);
                    }}
                  >
                    {expandedRow === coin.id ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRow === coin.id && (
                <TableRow key={`${coin.id}-expanded`}>
                  <TableCell colSpan={11}>
                    {loadingChart ? (
                      <div className="text-center p-4">⏳ Loading chart...</div>
                    ) : (
                      <div className="w-full h-72 my-5">
                        <CryptoChart key={`${coin.id}-chart`} />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                isActive={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                isActive={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
