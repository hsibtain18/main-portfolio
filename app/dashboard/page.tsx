
import { redirect } from "next/navigation";
import React from "react";
import CryptoTable from "./components/CryptoTable";
import WalletCard from "./components/WalletCard";

const Dashboard = () => {
  return (
    <>
      <WalletCard />
      <CryptoTable />
    </>
  );
};

export default Dashboard;
