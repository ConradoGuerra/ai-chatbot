import { tool } from 'ai';
import { z } from 'zod';

export const getStockPortfolio = tool({
  description: 'Get the stock portfolio for a list of tickers',
  inputSchema: z.object({
    tickers: z.array(z.string()).describe('A list of stock tickers'),
  }),
  execute: async ({ tickers }) => {
    return {
      status: 'success',
      message: `Successfully retrieved portfolio for tickers: ${tickers.join(', ')}`,
      portfolio: tickers.map(ticker => ({
        ticker,
        price: Math.random() * 1000,
        change: Math.random() * 100 - 50,
      })),
    };
  },
});
