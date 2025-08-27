import type {
  IStockService,
  IStockCacheRepository,
  IStockRepository,
} from "@/lib/domain/stock/interfaces";
import type { Stock } from "@/lib/domain/stock/types";
import type { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";

export class StockPortfolioService implements IStockService {
  constructor(
    private readonly stockClient: StockHttpClient,
    private readonly stockRepository: IStockRepository,
    private readonly cacheRepository: IStockCacheRepository,
  ) {}

  async getPortfolio(tickers: string[]): Promise<Stock[]> {
    if (!tickers.length) {
      return [];
    }

    try {
      const cachedQuotes = await this.cacheRepository.get(tickers);
      if (cachedQuotes) {
        return cachedQuotes;
      }

      const quotes = await this.fetchQuotesWithRetry(tickers);

      if (quotes.length > 0) {
        await Promise.all([
          this.savePortfolio(quotes),
          this.cacheRepository.set(tickers, quotes),
        ]);
      }

      return quotes;
    } catch (error) {
      console.error(
        `Failed to fetch portfolio for tickers [${tickers.join(", ")}]:`,
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
