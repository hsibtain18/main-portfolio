"use client";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

const WalletCard = () => {
  const Data  = useSession();
  const { Trending, loading } = usePreferenceStore();
  console.log(Data);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* Card 1 */}

      {Data.data ? (
        <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-2 px-3 rounded-xl bg-white dark:bg-gray-900">
          <h3 className="text-xl font-semibold mb-2">Wallet</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a short description for the second card.
          </p>
        </div>
      ) : (
        <LoginPlaceholder title="Wallet" />
      )}
      {/* Card 2 */}
      {Data.data ? (
        <div className="max-w-[92vw] ring-2 ring-gray-200 dark:ring-gray-700 py-2 px-3 rounded-xl bg-white dark:bg-gray-900">
          <h3 className="text-xl font-semibold mb-2">Favorites</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a short description for the second card.
          </p>
        </div>
      ) : (
        <LoginPlaceholder title="WishList" />
      )}

      {/* Card 3 */}
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

        {/* List */}
        {!loading ? (
          <div>
            {Trending?.coins?.slice(0, 3).map((item) => (
              <div key={item.item.id} className="flex justify-between items-center px-2 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
