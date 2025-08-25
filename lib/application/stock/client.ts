import type { Stock } from "@/lib/domain/stock/types";
import type { IStockClient } from "@/lib/domain/stock/interfaces";
import type { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";

export class StockClient implements IStockClient {
  constructor(private readonly client: StockHttpClient) {}

  async getQuote(ticker: string): Promise<Stock | null> {
    return this.client.getQuote(ticker);
  }

  async getQuotes(tickers: string[]): Promise<Stock[]> {
    const quotes = await Promise.all(
      tickers.map(async (ticker) => this.getQuote(ticker)),
    );
    return quotes.filter(
      (quote: Stock | null): quote is Stock => quote !== null,
    );
  }
}
