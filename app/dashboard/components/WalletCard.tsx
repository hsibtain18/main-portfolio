import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import { getServerSession } from "next-auth";
import React from "react";

const WalletCard = async () => {
  const Data = await getServerSession();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* Card 1 */}

      {Data ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Wallet</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This is a short description for the second card.
          </p>
        </div>
      ) : (
        <LoginPlaceholder title="Wallet" />
      )}
      {/* Card 2 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Trending</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This is a short description for the second card.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Card Title 3</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This is a short description for the third card.
        </p>
      </div>
    </div>
  );
};

export default WalletCard;
