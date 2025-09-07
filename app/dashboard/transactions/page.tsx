"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { apiGet } from "@/lib/apis"; // <- we'll also move AddTxForm separately
import AddTxForm from "../components/AddTxForm";
import AddTransactionDialog from "../components/AddTransactionDialog";

type Account = {
  accountId: string;
  name?: string;
  currency?: string;
  balance: number;
  type: "main" | "sub";
  parentAccountId?: string;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { subID } = usePreferenceStore();
  const [CategoryList, setCategoryList] = useState<any[]>([]);
  const [AccountsList, setAccounts] = useState<Account[]>([]);
  const fetchBalances = async () => {
    const res: any = await apiGet("accounts/balances", subID);
    setAccounts(res.subAED ? res.subAED : []);
  };
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res: any = await apiGet("transactions", subID);
      setTransactions(res || []);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res: any = await apiGet("accounts/categories", subID);
      setCategoryList(res || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (subID) {
      fetchBalances();
      fetchTransactions();
      fetchCategories();
    }
  }, [subID]);

  return (
    <div className="space-y-4">
      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        subs={AccountsList}
        categories={CategoryList}
        onTransactionAdded={() => fetchTransactions()}
      />

      {/* Transaction List */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">All Sub-Account Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>Sub Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.transactionId}>
                <TableCell>{tx?.subAccountDetails?.name}</TableCell>
                <TableCell>{tx?.categoryDetails?.name ?? tx?.kind}</TableCell>
                <TableCell>{tx?.amount}</TableCell>
                <TableCell>{tx?.currency}</TableCell>
                <TableCell>
                  {new Date(tx?.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
