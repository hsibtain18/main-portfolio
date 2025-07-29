"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

export default function TrendingTabs() {
  const { Trending, fetchTrendingCoins } = usePreferenceStore();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchTrendingCoins();
    setLastUpdated(new Date());
    console.log(Trending);

    const interval = setInterval(() => {
      fetchTrendingCoins();
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchTrendingCoins]);

  const lastUpdatedBadge = useMemo(() => {
    if (!lastUpdated) return "";
    const diffMs = Date.now() - lastUpdated.getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);
    return `Last updated ${
      diffMin === 0 ? "just now" : `${diffMin} min${diffMin > 1 ? "s" : ""}`
    } ago`;
  }, [lastUpdated]);

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <div className="text-xs text-muted-foreground italic mb-2">
        {lastUpdatedBadge}
      </div>

      <Tabs defaultValue="coins" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="coins">Trending Coins</TabsTrigger>
          <TabsTrigger value="nfts">Trending NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="coins">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Price (BTC)</TableHead>
                <TableHead>24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Trending.coins.map((coin) => (
                <TableRow key={coin.item.id}>
                  <TableCell className="flex items-center gap-2">
                    <img
                      src={coin.item.large}
                      alt={coin.item.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {coin.item.name} ({coin.item.symbol.toUpperCase()})
                  </TableCell>
                  <TableCell>{coin.item.price_btc.toFixed(6)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coin.item.data.price_change_percentage_24h?.usd > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {coin.item.data.price_change_percentage_24h?.usd.toFixed(
                        2
                      )}
                      %
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="nfts">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NFT</TableHead>
                <TableHead>Floor Price</TableHead>
                <TableHead>24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Trending.nfts?.slice(0, 5).map((nft) => (
                <TableRow key={nft.id}>
                  <TableCell className="flex items-center gap-2">
                    <img
                      src={nft.thumb}
                      alt={nft.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {nft.name} ({nft.symbol.toUpperCase()})
                  </TableCell>
                  <TableCell>
                    {nft.floor_price_in_native_currency.toFixed(2)}{" "}
                    {nft.native_currency_symbol.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        nft.floor_price_24h_percentage_change > 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {nft.floor_price_24h_percentage_change.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
