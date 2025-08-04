"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { Coin } from "@/app/constant/experienceData";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AddCoinDialog = ({ open, setOpen }: Props) => {
  const { CoinList, currency, addCoinToWallet } = usePreferenceStore();

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [qty, setQty] = useState(0.1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!selectedCoin || !qty) return;
    setIsLoading(true);
    try {
      await addCoinToWallet(selectedCoin, qty);
      setOpen(false);
      setSelectedCoin(null);
      setQty(0.00001);
    } catch (err) {
      console.error("Failed to add coin", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!CoinList.length) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coin</Button>
      </DialogTrigger>

      <DialogPortal>
        {/* ✅ Full screen overlay with light blur */}
        <DialogOverlay className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-md z-40" />

        {/* ✅ Dialog content enlarged and styled */}
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click
          className="z-50 max-w-2xl bg-background/90 dark:bg-background/80 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl"
        >
          <DialogTitle className="text-xl font-semibold text-foreground mb-4">
            Add Coin to Wallet
          </DialogTitle>

          <div className="space-y-4">
            <select
              onChange={(e) => {
                const coin = CoinList.find((c) => c.id === e.target.value);
                setSelectedCoin(coin || null);
              }}
              className="w-full p-2 border border-input rounded-md bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="bg-background border border-input text-foreground"
            />

            {selectedCoin && (
              <p className="text-sm text-muted-foreground">
                Value: {currency.symbol}
                {(qty * selectedCoin.current_price).toFixed(2)}
              </p>
            )}

            <div className="flex justify-end">
              <Button onClick={handleAdd} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AddCoinDialog;
