import type { Stock } from "@/lib/domain/stock/types";
import { RedisClient } from "../cache/redis.client";
import { IStockCacheRepository } from "@/lib/domain/stock/interfaces";

export class StockCacheRepository implements IStockCacheRepository {
  private readonly TTL = 300;

  constructor(private readonly cache: RedisClient) {}

  private getCacheKey(tickers: string[]): string {
    return `stock:quotes:${tickers.sort().join(",")}`;
  }

  async get(tickers: string[]): Promise<Stock[] | null> {
    const data = await this.cache.get(this.getCacheKey(tickers));
    return data ? JSON.parse(data) : null;
  }

  async set(tickers: string[], stocks: Stock[]): Promise<void> {
    await this.cache.set(
      this.getCacheKey(tickers),
      JSON.stringify(stocks),
      this.TTL,
    );
  }

  async close(): Promise<void> {
    await this.cache.close();
  }
}
