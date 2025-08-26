import type { AxiosInstance } from "axios";
import type { Stock } from "@/lib/domain/stock/types";

export class StockHttpClient {
  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly apiKey: string,
  ) {}

  async getQuotes(tickers: string[]): Promise<Stock[]> {
    try {
      const tickersParam = tickers.join(",");
      const { data } = await this.axiosInstance.get<Stock[]>(
        `/quote/${tickersParam}?apikey=${this.apiKey}`,
      );

      if (!data.length) {
        return [];
      }

      return data.map((quote) => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        volume: quote.volume,
        changesPercentage: quote.changesPercentage,
        timestamp: quote.timestamp * 1000,
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(
        `Failed to fetch quotes for ${tickers.join(",")}: ${message}`,
      );
    }
  }
}
