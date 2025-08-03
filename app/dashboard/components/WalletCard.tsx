"use client";
import AddCoinDialog from "@/app/components/AddCoinDialog";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Rocket, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const WalletCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    Trending,
    loading,
    Favorites,
    WalletDetails,
    currency,
    subID,
    WalletCoin,
    fetchWalletCoins,
    CoinList
  } = usePreferenceStore();
useEffect(() => {
  if (subID && CoinList.length > 0) {
    fetchWalletCoins();
  }
}, [subID, CoinList]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {subID ? (
        <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-4 px-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 flex">
            <Wallet className="mr-3" /> Wallet Summary
          </h3>
          {WalletDetails.coinCount > 0 ? (
            <div className="space-y-4 mt-4">
              {/* Overall Summary */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Coins in wallet:{" "}
                  <span className="font-medium text-black dark:text-white">
                    {WalletDetails.coinCount}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Value:{" "}
                  <span className="font-medium text-black dark:text-white">
                    {currency.symbol}{" "}
                    {WalletDetails.totalAmount?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>

              {/* Per-Coin Breakdown */}
              {WalletCoin.length > 0 && (
                <div className="overflow-auto border rounded-md">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Coin</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Bought @</th>
                        <th className="p-2 text-right">Current</th>
                        <th className="p-2 text-right">P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WalletCoin.slice(0, 2).map((entry) => {
                        const initial = entry.qty * entry.purchasePrice;
                        const current = entry.qty * entry.coin.current_price;
                        const profit = current - initial;
                        return (
                          <tr key={entry.entryID} className="border-t">
                            <td className="p-2">{entry.coin.name}</td>
                            <td className="p-2 text-right">{entry.qty}</td>
                            <td className="p-2 text-right">
                              {currency.symbol}
                              {initial.toFixed(2)}
                            </td>
                            <td className="p-2 text-right">
                              {currency.symbol}
                              {current.toFixed(2)}
                            </td>
                            <td
                              className={`p-2 text-right ${
                                profit >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {currency.symbol}
                              {profit.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-40">
              <AddCoinDialog open={dialogOpen} setOpen={setDialogOpen} />
              {/* <Button onClick={() => setDialogOpen(true)}>Add Cascoins</Button> */}
            </div>
          )}
        </div>
      ) : (
        <LoginPlaceholder title="Wallet" />
      )}

      {subID ? (
        <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-2 px-3 rounded-xl bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="flex justify-between items-center pt-2 mb-3 px-1 truncate">
            <h3 className="text-gray-900 dark:text-white font-semibold text-base leading-6 flex">
              <BookmarkCheck className="mr-3" /> WishList
            </h3>
            {Favorites.length > 0 && (
              <Link
                href="/dashboard/wishlist"
                className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span>View more</span>
                <i className="fas fa-angle-right"></i>
              </Link>
            )}
          </div>

          {!loading ? (
            <div>
              {Favorites?.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-2 max-w-[50%]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-full"
                      width={24}
                      height={24}
                      style={{ minWidth: "24px" }}
                    />
                    <div className="truncate text-gray-700 dark:text-gray-200 font-semibold text-sm leading-5">
                      {item.name}
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="text-right max-w-[50%] flex-shrink-0 break-words">
                    <div className="text-gray-900 dark:text-white font-medium text-sm leading-5">
                      ${item.current_price.toFixed(4)}
                      <span
                        className={`ml-2 ${
                          item.price_change_percentage_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <i
                          className={`fas fa-fw ${
                            item.price_change_percentage_24h_in_currency >= 0
                              ? "fa-caret-up"
                              : "fa-caret-down"
                          }`}
                        ></i>
                        {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600 dark:text-gray-300">
              Loading...
            </div>
          )}
        </div>
      ) : (
        <LoginPlaceholder title="WishList" />
      )}

      <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-2 px-3 rounded-xl bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center pt-2 mb-3 px-1 truncate">
          <h3 className="text-gray-900 dark:text-white font-semibold text-base leading-6 flex">
            <Rocket className="mr-3" /> Top Gainers
          </h3>
          <Link
            href="/dashboard/trending"
            className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span>View more</span>
            <i className="fas fa-angle-right"></i>
          </Link>
        </div>

        {!loading ? (
          <div>
            {Trending?.coins?.slice(0, 3).map((item) => (
              <div
                key={item.item.id}
                className="flex justify-between items-center px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-2 max-w-[50%]">
                  <img
                    src={item.item.large}
                    alt={item.item.name}
                    className="rounded-full"
                    width={24}
                    height={24}
                    style={{ minWidth: "24px" }}
                  />
                  <div className="truncate text-gray-700 dark:text-gray-200 font-semibold text-sm leading-5">
                    {item.item.name}
                  </div>
                </div>

                {/* Price Info */}
                <div className="text-right max-w-[50%] flex-shrink-0 break-words">
                  <div className="text-gray-900 dark:text-white font-medium text-sm leading-5">
                    ${item.item.price_btc.toFixed(4)}
                    <span
                      className={`ml-2 ${
                        item.item.data.price_change_percentage_24h.usd >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      <i
                        className={`fas fa-fw ${
                          item.item.data.price_change_percentage_24h.usd >= 0
                            ? "fa-caret-up"
                            : "fa-caret-down"
                        }`}
                      ></i>
                      {Math.abs(
                        item.item.data.price_change_percentage_24h.usd
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-600 dark:text-gray-300">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
