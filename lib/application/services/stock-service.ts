import type { IStockService } from "@/lib/domain/stock/interfaces";
import type { Stock } from "@/lib/domain/stock/types";
import type { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";

export interface IStockRepository {
  saveMany(quotes: Stock[]): Promise<void>;
}

export class StockPortfolioService implements IStockService {
  constructor(
    private readonly stockClient: StockHttpClient,
    private readonly stockRepository: IStockRepository,
  ) {}

  async getPortfolio(tickers: string[]): Promise<Stock[]> {
    if (!tickers.length) {
      return [];
    }

    try {
      const quotes = await this.fetchQuotesWithRetry(tickers);
      if (quotes.length > 0) {
        await this.savePortfolio(quotes);
      }
      return quotes;
    } catch (error) {
      console.error(
        `Failed to fetch portfolio for tickers [${tickers.join(", ")}]:`,
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  private async fetchQuotesWithRetry(tickers: string[]): Promise<Stock[]> {
    const initialQuotes = await this.stockClient.getQuotes(tickers);

    if (initialQuotes.length === tickers.length) {
      return initialQuotes;
    }

    const receivedTickers = new Set(initialQuotes.map((q) => q.symbol));
    const missingTickers = tickers.filter(
      (ticker) => !receivedTickers.has(ticker),
    );

    const retryQuotes = await this.stockClient.getQuotes(missingTickers);
    return [...initialQuotes, ...retryQuotes];
  }

  private async savePortfolio(stocks: Stock[]): Promise<void> {
    try {
      await this.stockRepository.saveMany(stocks);
    } catch (error) {
      console.error(`Failed to save portfolio for ${stocks.length} stocks`);
      throw error;
    }
  }
}
