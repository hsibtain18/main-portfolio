"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost } from "@/lib/apis";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

type Account = {
  accountId: string;
  name?: string;
  currency?: string;
  balance: number;
  type: "main" | "sub";
  parentAccountId?: string;
};
type Props = {
  subs: Account[];
  onTransactionAdded: () => void;
  categories: any[];
};

export default function AddTransactionDialog({ subs, onTransactionAdded, categories }: Props) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryText, setNewCategoryText] = useState("");
  const { subID } = usePreferenceStore();

  const addTx = async () => {
    setLoading(true);
    try {
      const payload = {
        amount,
        subAccountId: selectedSubAccount,
        dateTime: selectedDate,
        category: selectedCategory === "new" ? newCategoryText : selectedCategory,
      };
       await apiPost("transactions/save/",subID, payload);
      // Reset form fields after successful submission
      setAmount("");
      setSelectedDate("");
      setSelectedSubAccount("");
      setSelectedCategory("");
      setNewCategoryText("");
      // close dialog here  
      
      onTransactionAdded(); // Notify the parent component to re-fetch data
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sub-account" className="text-right">
              Select Account
            </Label>
            <Select onValueChange={setSelectedSubAccount} value={selectedSubAccount}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Accounts</SelectLabel>
                  {subs.map((account) => (
                    <SelectItem key={account.accountId} value={account.accountId}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category}>
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    Create New Category
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory === "new" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category" className="text-right">
                New Category
              </Label>
              <Input
                id="new-category"
                value={newCategoryText}
                onChange={(e) => setNewCategoryText(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <Button onClick={addTx} disabled={loading || !selectedSubAccount || !amount || !selectedDate || (!selectedCategory && !newCategoryText)}>
          Add Transaction
        </Button>
      </DialogContent>
    </Dialog>
  );
}