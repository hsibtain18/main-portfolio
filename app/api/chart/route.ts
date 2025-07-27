import { NextRequest, NextResponse } from "next/server";

interface ChartPoint {
  time: string;
  value: number;
}

interface MarketChartData {
  prices: ChartPoint[];
  marketCaps: ChartPoint[];
  totalVolumes: ChartPoint[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coin = searchParams.get("coin");
  const days = searchParams.get("days");
  const currency = searchParams.get("currency") || "usd"; // fallback to usd

  if (!coin || !days) {
    return new Response(
      JSON.stringify({ error: "Missing 'coin' or 'days' query parameter." }),
      { status: 400 }
    );
  }
  console.log(coin,days,currency);
  
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=${days}`;
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
