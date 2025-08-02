"use client";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";
import { useSession } from "next-auth/react";
import React from "react";

const WishList = () => {
  const {
    CoinList,
    currency,
    fetchCoinList,
    WalletCoin,
    subID,
    setWalletCoin,
    setWalletDetails,
  } = usePreferenceStore();
  if (!subID) {
    return (
      <div className="w-full  h-full flex justify-center align-middle content-center">
        <LoginPlaceholder />
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default WishList;
