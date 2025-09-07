"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"; 
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { apiGet } from "@/lib/apis";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF4444"];

type CategoryEntry = { [key: string]: number };

export default function TransactionsDashboard() {
  const { subID } = usePreferenceStore();
  const [transactions, setTransactions] = useState<Record<string, CategoryEntry[]>>({});

  useEffect(() => {
    if (!subID) return; // only fetch if subID exists

    const fetchData = async () => {
      try {
        const res: any = await apiGet("transactions/grouped", subID);
        setTransactions(res.transactions || {});
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchData();
  }, [subID]);

  if (!subID) {
    return <div className="text-center mt-10 text-gray-500">No subscription ID found.</div>;
  }

  if (Object.keys(transactions).length === 0) {
    return <div className="text-center mt-10 text-gray-500">Loading transactions...</div>;
  }

  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      {Object.entries(transactions).map(([month, categories]) => {
        const chartData = (categories as CategoryEntry[]).map((cat) => {
          const [name, rawValue] = Object.entries(cat)[0];
          return { name, value: Math.abs(Number(rawValue)) };
        });

        // ✅ Calculate total spend
        const total = chartData.reduce((sum, c) => sum + c.value, 0);

        return (
          <Card key={month} className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex justify-between items-center">
                <span>{month}</span>
                <span className="text-sm ">Total : {total.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
