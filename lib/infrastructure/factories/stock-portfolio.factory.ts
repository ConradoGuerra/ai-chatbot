import { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";
import type { IStockRepository } from "@/lib/application/services/stock-service";
import { StockPortfolioService } from "@/lib/application/services/stock-service";
import { stockRepository } from "@/lib/application/repositories";
import type {
  StockClientConfig,
  IStockService,
} from "@/lib/domain/stock/interfaces";
import { createAxiosInstance } from "@/lib/axios/client";

export class StockPortfolioFactory {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly createHttpClient = createAxiosInstance,
  ) {}

  createStockService(config: StockClientConfig): IStockService {
    const httpClient = this.createHttpClient({
      baseURL: config.baseURL,
    });

    const stockClient = new StockHttpClient(httpClient, config.apiKey);
    return new StockPortfolioService(stockClient, this.stockRepository);
  }
}

export const stockPortfolioFactory = new StockPortfolioFactory(stockRepository);
