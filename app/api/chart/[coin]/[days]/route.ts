import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { coin: string; days: string } }
) {
  const { coin, days } = params;
  const numDays = Math.min(Math.max(Number(days), 1), 365); // Clamp 1–365

  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${numDays}`;
  const options = { headers: { accept: "application/json" } };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    return NextResponse.json({
      success: true,
      data: {
        prices: data.prices,
        market_caps: data.market_caps,
        total_volumes: data.total_volumes,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}