import { Coin } from "@/app/constant/experienceData";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const currency = searchParams.get("currency")?.toLowerCase() || "usd";

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch crypto data from CoinGecko" },
        { status: 500 }
      );
    }

    const data: Coin[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
