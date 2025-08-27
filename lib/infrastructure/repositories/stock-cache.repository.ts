import type { Stock } from "@/lib/domain/stock/types";
import { RedisClient } from "../cache/redis.client";
import { IStockPortfolioCacheRepository } from "@/lib/domain/stock/interfaces";

export class StockPortfolioCacheRepository implements IStockPortfolioCacheRepository {
  private readonly TTL = 300;

  constructor(private readonly cache: RedisClient) {}

  private getCacheKey(tickers: string[]): string {
    return `stock:portfolio:${tickers.sort().join(",")}`;
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
