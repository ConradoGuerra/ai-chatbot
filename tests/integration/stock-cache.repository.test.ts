import { StockPortfolioCacheRepository } from '@/lib/infrastructure/repositories/stock-cache.repository';
import { RedisClient } from '@/lib/infrastructure/cache/redis.client';
import type { Stock } from '@/lib/domain/stock/types';

describe('StockPortfolioCacheRepository integration', () => {
  let cache: RedisClient;
  let repo: StockPortfolioCacheRepository;
  const tickers = ['AAPL', 'GOOGL'];
  const stocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 150.0,
      volume: 1000000,
      changesPercentage: 1.5,
      timestamp: 1234567890,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 2800.0,
      volume: 500000,
      changesPercentage: 0.8,
      timestamp: 1234567890,
    },
  ];

  beforeAll(() => {
    cache = new RedisClient();
    repo = new StockPortfolioCacheRepository(cache);
  });

  it('should set and get stocks from cache', async () => {
    await repo.set(tickers, stocks);
    const result = await repo.get(tickers);
    expect(result).toEqual(stocks);
  });

  it('should close the cache connection', async () => {
    await expect(repo.close()).resolves.not.toThrow();
  });
});
