import { createAxiosRetryInstance } from "@/lib/axios/client";
import { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";
import { StockPortfolioService } from "@/lib/application/services/stock-service";
import type {
  StockClientConfig,
  IStockService,
} from "@/lib/domain/stock/interfaces";

export class StockPortfolioFactory {
  constructor(private readonly createHttpClient = createAxiosRetryInstance) {}

  createStockService(config: StockClientConfig): IStockService {
    const httpClient = this.createHttpClient({
      baseURL: config.baseURL,
    });

    const stockClient = new StockHttpClient(httpClient, config.apiKey);
    return new StockPortfolioService(stockClient);
  }
}

export const stockPortfolioFactory = new StockPortfolioFactory();
