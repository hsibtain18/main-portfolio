"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { Coin } from "@/app/constant/experienceData";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddCoinDialog = ({ open, setOpen }: Props) => {
  const {
    CoinList,
    currency,
    addCoinToWallet,
  } = usePreferenceStore();

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [qty, setQty] = useState(0.00001);

  const handleAdd = async () => {
    if (!selectedCoin || !qty) return;
    await addCoinToWallet(selectedCoin, qty);
    setOpen(false);
    setSelectedCoin(null);
    setQty(0.00001);
  };
if(!CoinList.length){
    return null;
}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coin</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogTitle>Add Coin</DialogTitle>

        <select
          onChange={(e) => {
            const coin = CoinList.find((c) => c.id === e.target.value);
            setSelectedCoin(coin || null);
          }}
          className="w-full border rounded p-2 mb-4"
          defaultValue=""
        >
          <option disabled value="">Select a coin</option>
          {CoinList.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>

        <Input
          type="number"
          min={0.00001}
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
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoinDialog;