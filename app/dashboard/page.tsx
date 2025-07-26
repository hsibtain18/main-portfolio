import { redirect } from "next/navigation";
import React from "react";
import CryptoTable from "./components/CryptoTable";

const Dashboard = () => {
  return (
    <>
      <CryptoTable />
    </>
  );
};

export default Dashboard;
