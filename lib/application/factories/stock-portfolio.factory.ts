import { StockPortfolioHttpClient } from "@/lib/infrastructure/http/stock-portfolio-http-client";
import type {
  IStockPortfolioService,
  IStockPortfolioCacheRepository,
} from "@/lib/domain/stock/interfaces";
import { AxiosInstance } from "axios";
import { StockPortfolioService } from "@/lib/application/services/stock-portfolio.service";

export class StockPortfolioFactory {
  constructor(
    private cacheRepository: IStockPortfolioCacheRepository,
    private httpClient: AxiosInstance,
  ) {}

  createService(apiKey: string): IStockPortfolioService {
    const stockClient = new StockPortfolioHttpClient(this.httpClient, apiKey);
    return new StockPortfolioService(stockClient, this.cacheRepository);
  }
}
