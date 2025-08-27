import type {
  IStockPortfolioService as IStockPortfolioService,
  IStockPortfolioCacheRepository,
} from "@/lib/domain/stock/interfaces";
import type { Stock } from "@/lib/domain/stock/types";
import type { StockPortfolioHttpClient } from "@/lib/infrastructure/http/stock-portfolio-http.client";
import { eventBus } from "../events/event-bus";

export class StockPortfolioService implements IStockPortfolioService {
  constructor(
    private readonly stockClient: StockPortfolioHttpClient,
    private readonly cacheRepository: IStockPortfolioCacheRepository,
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
        await Promise.all([this.cacheRepository.set(tickers, quotes)]);
        eventBus.emit("portfolioObserved", quotes); // moved to events folder
      }

      return quotes;
    } catch (error) {
      console.error(
        `Failed to fetch portfolio for tickers [${tickers.join(", ")}]:`,
        error,
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
}
