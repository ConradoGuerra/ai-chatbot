import { describe, it, expect } from 'vitest';
import { getStockPortfolio } from '../get-stock-portfolio';

describe('getStockPortfolio', () => {
it('returns portfolio data for a list of tickers', async () => {
  const tickers = ["AAPL", "TSLA", "GOOGL"];

  const result = await getStockPortfolio.execute({ tickers });

  expect(Array.isArray(result.portfolio)).toBe(true);
  expect(result.portfolio.length).toBe(3);

  for (const item of result.portfolio) {
    expect(item).toHaveProperty('ticker');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('change');
  }
});
});
