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
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import CryptoChart from "@/app/components/CryptoChart";
import React from "react";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap: number;
  current_price: number;
  price_change_percentage_24h: number;
};

const ITEMS_PER_PAGE = 10;

export default function CryptoTable() {
  const [data, setData] = useState<Coin[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const {setCoin} = usePreferenceStore()
  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/crypto");
      const json = await res.json();
      setData(json);
    };
    fetchData();
    setMounted(true);
  }, []);

  const handleExpand = async (coinId: string) => {
    if (expandedRow === coinId) {
      setExpandedRow(null);
      return;
    }
    setCoin(coinId)
    setExpandedRow(coinId);
    setLoadingChart(true);

    setLoadingChart(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>24h % Change</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead className="text-right">Expand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((coin) => (
            <React.Fragment key={coin.id}>
              <TableRow
                className=" "
                onClick={() => handleExpand(coin.id)}
              >
                <TableCell>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                </TableCell>
                <TableCell>{coin.name}</TableCell>
                <TableCell className="uppercase">{coin.symbol}</TableCell>
                <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
                <TableCell
                  className={`font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering row toggle
                      handleExpand(coin.id);
                    }}
                  >
                    {expandedRow === coin.id ? <ChevronUp className="cursor-none:"/> : <ChevronDown className="cursor-none:"/>}
                  </Button>
                </TableCell>
              </TableRow>

              {expandedRow === coin.id && (
                <TableRow key={`${coin.id}-expanded-chart-row`}>
                  <TableCell colSpan={7}>
                    {loadingChart ? (
                      <div className="text-center p-4">⏳ Loading chart...</div>
                    ) : (
                      <div className="w-full h-72 my-5">
                        <CryptoChart
                          key={`${coin.id}-chart`}
                        
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Prev
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
