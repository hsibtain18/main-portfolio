"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Account = {
  accountId: string;
  name?: string;
};

export default function AddTxForm({
  subs,
  onSubmit,
  disabled,
}: {
  subs: Account[];
  onSubmit: (payload: any) => void;
  disabled: boolean;
}) {
  const [subId, setSubId] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [dateTime, setDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <Label>Sub Account</Label>
          <Select value={subId} onValueChange={setSubId}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub account" />
            </SelectTrigger>
            <SelectContent>
              {subs.map((s) => (
                <SelectItem key={s.accountId} value={s.accountId}>
                  {s.name || s.accountId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label>Category</Label>
          <Input
            placeholder="Groceries / Rent / Custom..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <Label>Amount (AED) — use negative for expense</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Date & Time</Label>
          <Input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-1">
        <Label>Description</Label>
        <Input
          placeholder="Optional note"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button
        disabled={disabled || !subId || !category || !dateTime || !amount}
        onClick={() =>
          onSubmit({
            subAccountId: subId,
            category,
            description,
            amount: Number(amount),
            dateTime: new Date(dateTime).toISOString(),
            currency: "AED",
          })
        }
      >
        Save Transaction
      </Button>
    </div>
  );
}
