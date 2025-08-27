import type { AxiosInstance } from "axios";
import type { Stock } from "@/lib/domain/stock/types";
import { IStockPortfolioClient } from "@/lib/domain/stock/interfaces";

export class StockPortfolioHttpClient implements IStockPortfolioClient {
  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly apiKey: string,
  ) {}

  async getQuotes(tickers: string[]): Promise<Stock[]> {
    try {
      const tickersParam = tickers.join(",");
      const endpoint = `/quote/${tickersParam}?apikey=${this.apiKey}`;
      console.log(`[client] Requesting: ${endpoint}`);
      const { data } = await this.axiosInstance.get<Stock[]>(endpoint);
      console.log(`[client] Response:`, data);

      if (!data.length) {
        console.log(`[client] No data returned for tickers: ${tickersParam}`);
        return [];
      }

      const mapped = data.map((quote) => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        volume: quote.volume,
        changesPercentage: quote.changesPercentage,
        timestamp: quote.timestamp * 1000,
      }));
      console.log(`[client] Mapped result:`, mapped);
      return mapped;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(
        `Failed to fetch quotes for ${tickers.join(",")}: ${message}`,
      );
    }
  }
}
