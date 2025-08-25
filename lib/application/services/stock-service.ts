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
    const results: Stock[] = [];

    for await (const ticker of tickers) {
      try {
        const quote = await this.stockClient.getQuote(ticker);
        if (quote) {
          results.push(quote);
        }
      } catch (error) {
        console.error(`Error fetching portfolio for ticker ${ticker}:`, error);
      }
    }

    await this.savePortfolio(results);
    return results;
  }

  private async savePortfolio(stocks: Stock[]): Promise<void> {
    await this.stockRepository.saveMany(stocks);
  }
}
