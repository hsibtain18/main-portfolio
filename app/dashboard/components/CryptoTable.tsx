"use client";

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
import { useEffect, useState } from "react";
import CryptoChart from "@/app/components/CryptoChart";
import React from "react";
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

export default function CryptoTable() {
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

  const filteredData = CoinList?.filter(
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

  const toggleFavorite = (coin: Coin) => {
    if (isFavorite(coin)) {
      apiDelete(`wishlist/${subID}/${coin.id}`, subID).then((val: any) => {});
      setFavorites(Favorites.filter((fav) => fav.id !== coin.id));
    } else {
      apiPost("wishlist/", subID, { coin: coin.id, SUid: subID }).then(
        (val: any) => {}
      );
      setFavorites([...Favorites, coin]);
    }
  };

  const reloadData = async () => {
    await fetchCoinList(currency.code);
    await fetchTrendingCoins();

    setTimeout(async () => {
      if (subID) {
        try {
          const favIds: string[] = await apiGet(`wishlist/${subID}`, subID);
          const favCoins = usePreferenceStore
            .getState()
            .CoinList.filter((coin) => favIds.includes(coin.id));
          setFavorites(favCoins);
        } catch (err) {
          console.error("Error fetching favorites", err);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }

      setLastUpdated(new Date());
    }, 100);
  };

  useEffect(() => {
    if (!currency.code) return;
    reloadData();

    const interval = setInterval(() => {
      reloadData();
    }, REFRESH_INTERVAL_MS);

    setMounted(true);
    return () => clearInterval(interval);
  }, [currency.code, subID]);
  const handleExpand = async (coinId: string) => {
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
            {subID && <TableHead>Favorite </TableHead>}
            <TableHead>Rank</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>1h %</TableHead>
            <TableHead>24h %</TableHead>
            <TableHead>7d %</TableHead>
            <TableHead>Price ({currency.code})</TableHead>
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
