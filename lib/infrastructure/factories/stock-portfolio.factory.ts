import { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";
import { StockPortfolioService } from "@/lib/application/services/stock-service";
import type {
  IStockService,
  IStockCacheRepository,
  IStockRepository,
} from "@/lib/domain/stock/interfaces";
import { AxiosInstance } from "axios";

export class StockPortfolioFactory {
  constructor(
    private stockRepository: IStockRepository,
    private cacheRepository: IStockCacheRepository,
    private httpClient: AxiosInstance,
  ) {}

  createStockService(apiKey: string): IStockService {
    const stockClient = new StockHttpClient(this.httpClient, apiKey);
    return new StockPortfolioService(
      stockClient,
      this.stockRepository,
      this.cacheRepository,
    );
  }
}
