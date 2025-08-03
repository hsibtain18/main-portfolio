"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import AddCoinDialog from "@/app/components/AddCoinDialog";

export default function WalletComponent() {
  const {
    CoinList,
    currency,
    WalletCoin,
    subID,
    fetchWalletCoins,
    setWalletDetails,
    setWalletCoin,
    fetchCoinList,
  } = usePreferenceStore();

  const [dialogOpen, setDialogOpen] = useState(false);

  // Initial load: fetch coins and wallet
  useEffect(() => {
    const loadData = async () => {
      if (subID && currency?.code) {
        await fetchCoinList(currency.code); // Load market data
        await fetchWalletCoins();           // Then load wallet entries
      }
    };
    loadData();
  }, [subID, currency.code]); // <- consistent dependency list

  // Compute wallet entries from WalletCoin
  const walletEntries = useMemo(() => {
    return WalletCoin.map((entry: any, index) => ({
      entryID: entry.entryID ?? `${entry.coin.id}-${index}`,
      userId: subID,
      qty: entry.qty,
      price: entry.purchasePrice,
      amount: entry.qty * entry.purchasePrice,
      description: "",
      coinId: entry.coin.id,
      type: "purchase",
      createdAt: "",
      coin: entry.coin,
    }));
  }, [WalletCoin, subID]);

  // Summary update
  useEffect(() => {
    const total = walletEntries.reduce(
      (sum, e) => sum + e.qty * (e.coin?.current_price || 0),
      0
    );

    const uniqueCoinIds = new Set(walletEntries.map((e) => e.coinId));
    setWalletDetails({
      coinCount: uniqueCoinIds.size,
      totalAmount: total,
    });
  }, [walletEntries, setWalletDetails]);

  const totalValue = walletEntries.reduce(
    (sum, e) => sum + e.qty * (e.coin?.current_price || 0),
    0
  );

  const initialInvestment = walletEntries.reduce(
    (sum, e) => sum + e.qty * e.price,
    0
  );

  const profit = totalValue - initialInvestment;

  const deleteCoin = (entryID: string) => {
    const updated = WalletCoin.filter((entry: any, index) => {
      const id = entry.entryID ?? `${entry.coin.id}-${index}`;
      return id !== entryID;
    });
    setWalletCoin(updated);
  };

  if (!subID) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoginPlaceholder />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Unique Coins</div>
            <div className="text-xl font-semibold">
              {new Set(walletEntries.map((e) => e.coinId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Initial Investment</div>
            <div className="text-xl font-semibold">
              {currency.symbol}
              {initialInvestment.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Current Value</div>
            <div className="text-xl font-semibold flex items-center gap-2">
              {currency.symbol}
              {totalValue.toFixed(2)}
              {profit >= 0 ? (
                <ChevronUp className="text-green-500 w-4 h-4" />
              ) : (
                <ChevronDown className="text-red-500 w-4 h-4" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <AddCoinDialog open={dialogOpen} setOpen={setDialogOpen} />
      </div>

      {walletEntries.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <p className="my-5">No coins added.</p>
          <AddCoinDialog open={dialogOpen} setOpen={setDialogOpen} />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-2">Coin</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Bought @</th>
                <th className="p-2">Now</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {walletEntries.map((entry) => (
                <tr key={entry.entryID} className="border-t">
                  <td className="p-2 flex items-center gap-2">
                    {entry.coin?.image && (
                      <Image
                        src={entry.coin.image}
                        alt={entry.coin.name}
                        width={24}
                        height={24}
                      />
                    )}
                    {entry.coin?.name || entry.coinId}
                  </td>
                  <td className="p-2">{entry.qty}</td>
                  <td className="p-2">
                    {currency.symbol}
                    {(entry.qty * entry.price).toFixed(2)}
                  </td>
                  <td className="p-2">
                    {currency.symbol}
                    {(entry.qty * (entry.coin?.current_price || 0)).toFixed(2)}
                  </td>
                  <td className="p-2 space-x-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCoin(entry.entryID)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
