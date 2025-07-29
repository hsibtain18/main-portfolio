"use client";
import LoginPlaceholder from "@/app/components/LoginPlaceholder";
import { useSession } from "next-auth/react";
import React from "react";

const WishList = () => {
  const Data = useSession();
  if (!Data.data) {
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
