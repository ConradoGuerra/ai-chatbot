import type { AxiosInstance } from "axios";
import type { Stock } from "@/lib/domain/stock/types";

export class StockHttpClient {
  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly apiKey: string,
  ) {}

  async getQuote(ticker: string): Promise<Stock | null> {
    try {
      const { data } = await this.axiosInstance.get<Stock[]>(
        `/quote/${ticker}?apikey=${this.apiKey}`,
      );

      if (!data.length) {
        return null;
      }

      const secondsToMs = data[0].timestamp * 1000;

      return {
        symbol: data[0].symbol,
        name: data[0].name,
        price: data[0].price,
        volume: data[0].volume,
        changesPercentage: data[0].changesPercentage,
        timestamp: secondsToMs,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to fetch quote for ${ticker}: ${message}`);
    }
  }
}
