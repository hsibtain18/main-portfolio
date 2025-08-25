"use client";
import { useEffect, useRef, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import gsap from "gsap";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { apiGet, apiPost } from "@/lib/apis";

type Account = {
  accountId: string;
  name?: string;
  currency?: string;
  balance: number;
  type: "main" | "sub";
  parentAccountId?: string;
};

export default function MoneyHub() {
  const [balances, setBalances] = useState<{
    mainUSD?: Account;
    mainAED?: Account;
    subAED: Account[];
  }>({ subAED: [] });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { subID } = usePreferenceStore();
  const modalRef = useRef<HTMLDivElement>(null);
  let subs: Account[] = [];
  const fetchBalances = async () => {
    const res: any = await apiGet("accounts/balances", subID);
    subs = res.subAED || [];
    setBalances(res);
  };
  const fetchTransactions = async () => {
    await apiGet("transactions", subID).then((res: any) => {
      setTransactions(res || []);
    });
  };

  useEffect(() => {
    fetchBalances();
    fetchTransactions();
  }, [subID]);

  // --- API Calls ---
  const createSub = async (name: string) => {
    setLoading(true);
    try {
      await apiPost("accounts/sub/", subID, {
        name,
        parentAccountId: "d9ad17f9-3d15-48b3-818f-f9f24a56532c",
      });
      await fetchBalances();
    } finally {
      setLoading(false);
    }
  };
  const usdToAed = async (
    amountUSD: number,
    feeUSD: number,
    useLiveRate: number,
    date: string
  ) => {
    setLoading(true);
    try {
      await apiPost("accounts/transfer/usd-to-aed/", subID, {
        amountUSD,
        feeUSD,
        useLiveRate,
        date
      }).then((val: any) => {
        console.log("Transfer successful:", val);
        fetchBalances();
      });
      await fetchBalances();
    } finally {
      setLoading(false);
    }
  };
  const aedToSub = async (subId: string, amountAED: number, note?: string) => {
    setLoading(true);
    try {
      await apiPost("accounts/transfer/aed-to-sub/", subID, {
        subAccountId: subId,
        amountAED,
        note,
      });

      await fetchBalances();
    } finally {
      setLoading(false);
    }
  };
  const subToSub = async (
    fromSubId: string,
    toSubId: string,
    amountAED: number,
    note?: string
  ) => {
    setLoading(true);
    try {
      await apiPost("accounts/transfer/sub-to-sub/", subID, {
        fromAccountId: fromSubId,
        toAccountId: toSubId,
        amountAED,
        note,
      });
      await fetchBalances();
    } finally {
      setLoading(false);
    }
  };
  const addTx = async (payload: any) => {
    setLoading(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await Promise.all([fetchBalances(), fetchTransactions()]);
    } finally {
      setLoading(false);
    }
  };

  // GSAP animation for modals
  useEffect(() => {
    if (modalRef.current)
      gsap.fromTo(
        modalRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 }
      );
  }, [modalRef.current]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Accounts & Transfers</h1>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BalanceCard
          title="USD (Main)"
          value={balances.mainUSD?.balance}
          suffix="USD"
        />
        <BalanceCard
          title="AED (Main)"
          value={balances.mainAED?.balance}
          suffix="AED"
        />
        {balances.subAED.map((s) => (
          <BalanceCard
            key={s.accountId}
            title={s.name || s.accountId}
            value={s.balance}
            suffix="AED"
          />
        ))}
      </div>

      {/* Action Cards */}
      <CreateSubCard onCreate={createSub} disabled={loading} />
      <UsdToAedCard onSubmit={usdToAed} disabled={loading} />
      <AedToSubCard
        subs={balances.subAED}
        onSubmit={aedToSub}
        disabled={loading}
      />
      <SubToSubCard
        subs={balances.subAED}
        onSubmit={subToSub}
        disabled={loading}
      />

      {/* Add Transaction Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Transaction</Button>
        </DialogTrigger>
        <DialogContent ref={modalRef} className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <AddTxForm
            subs={balances.subAED}
            disabled={loading}
            onSubmit={addTx}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Balance Card Component
function BalanceCard({
  title,
  value,
  suffix,
}: {
  title: string;
  value?: number;
  suffix: string;
}) {
  return (
    <div className="p-4 rounded-2xl shadow-sm border bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="text-xs text-muted-foreground dark:text-gray-400">
        {title}
      </div>
      <div className="text-xl font-semibold">
        {value?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "0.00"}{" "}
        {suffix}
      </div>
    </div>
  );
}

// Create Sub-Account Card Component
function CreateSubCard({
  onCreate,
  disabled,
}: {
  onCreate: (name: string) => void;
  disabled: boolean;
}) {
  const [name, setName] = useState("");
  return (
    <div className="p-4 rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-end gap-3">
        <div className="grid gap-1">
          <Label>New AED Sub-Account Name</Label>
          <Input
            placeholder="Hassan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button disabled={!name || disabled} onClick={() => onCreate(name)}>
          Create
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
        Sub-accounts start with balance 0 (AED).
      </p>
    </div>
  );
}

// USD to AED Transfer Card Component
function UsdToAedCard({
  onSubmit,
  disabled,
}: {
  onSubmit: (amountUSD: number, feeUSD: number, useLiveRate: number,date: string) => void;
  disabled: boolean;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [rate, setRate] = useState(3.63);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<string>(today);
  return (
    <div className="p-4 rounded-2xl border space-y-3 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-medium">USD → AED (with fee + live rate)</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <Label>Amount (USD)</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Fee AED</Label>
          <Input
            type="number"
            step="0.01"
            value={fee}
            onChange={(e) => setFee(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Live Rate (approx)</Label>
          <Input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value || "3.63"))}
          />{" "}
        </div>
        <div className="grid gap-1">
          <label htmlFor="date" className="text-sm font-medium">
            Select a date
          </label>
          <Input id="date" type="date" value={date} onChange={(e)=>setDate(e.target.value)}  className="w-full" />
        </div>
      </div>
      <Button
        disabled={disabled || amount <= 0 || fee < 0 || rate <= 2}
        onClick={() => onSubmit(amount, fee, rate,date)}
      >
        Convert & Transfer
      </Button>
    </div>
  );
}

// AED to Sub-Account Transfer Card Component
function AedToSubCard({
  subs,
  onSubmit,
  disabled,
}: {
  subs: Account[];
  onSubmit: (subId: string, amountAED: number, note?: string) => void;
  disabled: boolean;
}) {
  const [subId, setSubId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  return (
    <div className="p-4 rounded-2xl border space-y-3 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-medium">AED (Main) → Sub Account</div>
      <div className="grid grid-cols-3 gap-3">
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
          <Label>Amount (AED)</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Note (optional)</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <Button
        disabled={disabled || !subId || amount <= 0}
        onClick={() => onSubmit(subId, amount, note)}
      >
        Transfer
      </Button>
    </div>
  );
}
function SubToSubCard({
  subs,
  onSubmit,
  disabled,
}: {
  subs: Account[];
  onSubmit: (
    fromSubId: string,
    toSubId: string,
    amountAED: number,
    note?: string
  ) => void;
  disabled: boolean;
}) {
  const [fromSubId, setFromSubId] = useState<string>("");
  const [toSubId, setToSubId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  const filteredToSubs = subs.filter((s) => s.accountId !== fromSubId);

  return (
    <div className="p-4 rounded-2xl border space-y-3 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-medium">Sub Account → Sub Account</div>
      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1">
          <Label>From</Label>
          <Select value={fromSubId} onValueChange={setFromSubId}>
            <SelectTrigger>
              <SelectValue placeholder="Select from account" />
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
          <Label>To</Label>
          <Select value={toSubId} onValueChange={setToSubId}>
            <SelectTrigger>
              <SelectValue placeholder="Select to account" />
            </SelectTrigger>
            <SelectContent>
              {filteredToSubs.map((s) => (
                <SelectItem key={s.accountId} value={s.accountId}>
                  {s.name || s.accountId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label>Amount (AED)</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
          />
        </div>
      </div>
      <div className="grid gap-1">
        <Label>Note (optional)</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button
        disabled={
          disabled ||
          !fromSubId ||
          !toSubId ||
          amount <= 0 ||
          fromSubId === toSubId
        }
        onClick={() => onSubmit(fromSubId, toSubId, amount, note)}
      >
        Transfer
      </Button>
    </div>
  );
}

// Add Transaction Form Component
function AddTxForm({
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
