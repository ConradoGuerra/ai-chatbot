import type { Stock } from "@/lib/domain/stock/types";
import type { IStockClient, IStockService } from "@/lib/domain/stock/interfaces";

export class StockService implements IStockService {
  constructor(private readonly client: IStockClient) {}

  async getPortfolio(tickers: string[]): Promise<Stock[]> {
    return this.client.getQuotes(tickers);
  }
}
