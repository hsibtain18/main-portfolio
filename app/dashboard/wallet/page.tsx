"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Coin } from "@/app/constant/experienceData";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { signOut, useSession } from "next-auth/react";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import AddCoinDialog from "@/app/components/AddCoinDialog";

type UserCoin = {
  coin: Coin;
  qty: number;
  purchasePrice: number;
};

export default function WalletComponent() {
  const {
    CoinList,
    currency,
    fetchCoinList,
    WalletCoin,
    subID,
    setWalletCoin,
    setWalletDetails,
  } = usePreferenceStore();
  const [userCoins, setUserCoins] = useState<UserCoin[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [qty, setQty] = useState(0.00001);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // signOut()
    // fetchCoinList(currency.code);
    setWalletDetails({
      coinCount: WalletCoin.length,
      totalAmount: totalValue,
    });
  }, [WalletCoin]);
  const addUserCoin = () => {
    if (!selectedCoin || !qty) return;
    const existing = WalletCoin.find((c) => c.coin.id === selectedCoin.id);

    const updatedWallet = WalletCoin.map((item) => {
      if (item.coin.id === selectedCoin.id) {
        return {
          ...item,
          qty: item.qty + qty, // or replace qty: qty to overwrite
        };
      }
      return item;
    });

    // If coin not found, add it
    const coinExists = WalletCoin.some(
      (item) => item.coin.id === selectedCoin.id
    );
    const finalWallet = coinExists
      ? updatedWallet
      : [
          ...WalletCoin,
          {
            coin: selectedCoin,
            qty,
            purchasePrice: selectedCoin.current_price,
          },
        ];

    setWalletCoin(finalWallet);
    setOpen(false);
    setSelectedCoin(null);
    setQty(0.00001);
  };
  const deleteCoin = (coinId: string) => {
    const updatedWallet = WalletCoin.filter((item) => item.coin.id !== coinId);
    setWalletCoin(updatedWallet);
  };
  const totalValue = WalletCoin.reduce(
    (sum, c) => sum + c.qty * c.coin.current_price,
    0
  );
  const initialInvestment = WalletCoin.reduce(
    (sum, c) => sum + c.qty * c.purchasePrice,
    0
  );
  const profit = totalValue - initialInvestment;
  if (!subID) {
    return (
      <div className="w-full  h-full flex justify-center align-middle content-center">
        <LoginPlaceholder />
      </div>
    );
  } else
    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Coins Held</div>
              <div className="text-xl font-semibold">{WalletCoin.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                Initial Investment
              </div>
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

        {/* <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            {open && <DialogTitle>Add Coin</DialogTitle>}
            <DialogTrigger asChild>
              <Button variant="outline">Add Coin</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <h3 className="text-lg font-medium mb-2">Add Coin</h3>
              <select
                onChange={(e) => {
                  const coin = CoinList.find((c) => c.id === e.target.value);
                  setSelectedCoin(coin || null);
                }}
                className="w-full border rounded p-2 mb-4"
                defaultValue=""
              >
                <option disabled value="">
                  Select a coin
                </option>
                {CoinList.map((coin) => (
                  <option
                    className="text-dark dark:text-white"
                    key={coin.id}
                    value={coin.id}
                  >
                    {coin.name}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={0.00001}
                max={9999}
                step={0.00001}
                value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value))}
                placeholder="Quantity"
              />

              {selectedCoin && (
                <p className="mt-2 text-muted-foreground text-sm">
                  Value: {currency.symbol}
                  {(qty * selectedCoin.current_price).toFixed(2)}
                </p>
              )}

              <div className="flex justify-end mt-4">
                <Button onClick={addUserCoin}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div> */}

        {WalletCoin.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="my-5"> No coins added. </p>
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
                {WalletCoin.map((entry) => (
                  <tr key={entry.coin.id} className="border-t">
                    <td className="p-2 flex items-center gap-2">
                      <Image
                        src={entry.coin.image}
                        alt={entry.coin.name}
                        width={24}
                        height={24}
                      />
                      {entry.coin.name}
                    </td>
                    <td className="p-2">{entry.qty}</td>
                    <td className="p-2">
                      {currency.symbol}
                      {(entry.qty * entry.purchasePrice).toFixed(2)}
                    </td>
                    <td className="p-2">
                      {currency.symbol}
                      {(entry.qty * entry.coin.current_price).toFixed(2)}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCoin(entry.coin);
                          setQty(entry.qty);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCoin(entry.coin.id)}
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
