import type { Stock } from '@/lib/domain/stock/types';
import type { RedisClient } from '../cache/redis.client';
import type { IStockPortfolioCacheRepository } from '@/lib/domain/stock/interfaces';

export class StockPortfolioCacheRepository
  implements IStockPortfolioCacheRepository
{
  private readonly TTL_SECONDS = 300;

  constructor(private readonly cache: RedisClient) {}

  private getCacheKey(tickers: string[]): string {
    return `stock:portfolio:${tickers.sort().join(',')}`;
  }

  async get(tickers: string[]): Promise<Stock[] | null> {
    const key = this.getCacheKey(tickers);
    const data = await this.cache.get(key);
    if (data) {
      console.log(`[cache] HIT for key: ${key}`);
      const result = JSON.parse(data);
      console.log(`[cache] Result:`, result);
      return result;
    } else {
      console.log(`[cache] MISS for key: ${key}`);
      return null;
    }
  }

  async set(tickers: string[], stocks: Stock[]): Promise<void> {
    console.log(`[cache] SET : ${this.getCacheKey(tickers)}`);
    await this.cache.set(
      this.getCacheKey(tickers),
      JSON.stringify(stocks),
      this.TTL_SECONDS,
    );
  }

  async close(): Promise<void> {
    await this.cache.close();
  }
}
