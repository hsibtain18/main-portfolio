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
import { Trash2, Clock } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Coin } from "@/app/constant/experienceData";
import { apiDelete, apiGet } from "@/lib/apis";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

const ITEMS_PER_PAGE = 10;

export default function WishlistTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { subID, CoinList, setFavorites, Favorites } = usePreferenceStore();

  const totalPages = Math.ceil(Favorites.length / ITEMS_PER_PAGE);
  const currentData = Favorites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const reloadFavorites = async () => {
    if (!subID) return;
    try {
      const favIds: string[] = await apiGet(`wishlist/${subID}`, subID);
      const favCoins = CoinList.filter((coin) => favIds.includes(coin.id));
      setFavorites(favCoins);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  const handleDelete = async (coinId: string) => {
    if (!subID) return;
    try {
      await apiDelete(`wishlist/${subID}/${coinId}`, subID);
      setFavorites((prev) => prev.filter((coin) => coin.id !== coinId));
    } catch (err) {
      console.error("Failed to delete item from wishlist:", err);
    }
  };

  useEffect(() => {
    reloadFavorites();
  }, [subID]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Wishlist</h2>
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
            <TableHead>Rank</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((coin) => (
            <TableRow key={coin.id}>
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
                {coin.market_cap.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
              <TableCell>
                {coin.current_price.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(coin.id)}
                >
                  <Trash2 className="text-red-500" size={16} />
                </Button>
              </TableCell>
            </TableRow>
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
