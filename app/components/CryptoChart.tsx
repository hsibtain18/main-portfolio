"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import debounce from "lodash.debounce";
import React from "react";
import { usePreferenceStore } from "../stores/useDashboardStore";

const CryptoChart = React.memo(function CryptoChart() {
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const prevCoinRef = useRef<string | null>(null);
  const { coin, currency, days, setDays } = usePreferenceStore();

  useEffect(() => {
    const fetchChart = async () => {
      const isNewCoin = prevCoinRef.current !== coin;
      if (isNewCoin) {
        setLoading(true);
        prevCoinRef.current = coin;
      }

      try {
        const res = await fetch(
          `/api/chart?coin=${coin}&days=${days}&currency=${currency.code.toLowerCase()}`
        );
        const json = await res.json();
        const formatted = json.data.prices.map((entry: [number, number]) => ({
          time: new Date(entry[0]).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
          price: parseFloat(entry[1].toFixed(2)),
        }));

        setChartData(formatted);
      } catch (e) {
        console.error("Chart load failed", e);
        setChartData([]);
      } finally {
        if (isNewCoin) {
          setLoading(false);
        }
      }
    };

    fetchChart();
  }, [coin, currency, days]);

  const handleInputChange = useCallback(
    debounce((value: number) => {
      const clamped = Math.max(1, Math.min(365, value));
      setDays(clamped);
    }, 300),
    []
  );

  const onDaysChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      handleInputChange(num);
    },
    [handleInputChange]
  );

  return (
    <div
      className="p-4 bg-white dark:bg-black rounded shadow-md space-y-4"
      key={coin}
    >
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Days:</label>
        <input
          type="number"
          min={1}
          max={365}
          defaultValue={days}
          onChange={onDaysChange}
          className="border px-2 py-1 w-20 rounded bg-background text-foreground"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-red-500">No chart data available.</p>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
});

export default CryptoChart;
