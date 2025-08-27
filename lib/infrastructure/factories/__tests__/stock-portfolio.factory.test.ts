import { StockPortfolioHttpClient } from "@/lib/infrastructure/http/stock-portfolio-http-client";
import { StockPortfolioFactory } from "../stock-portfolio.factory";
import { StockPortfolioService } from "@/lib/application/services/stock-portfolio.service";
import { type AxiosInstance } from "axios";
import type {
  IStockPortfolioRepository,
  IStockPortfolioCacheRepository,
} from "@/lib/domain/stock/interfaces";

jest.mock("@/lib/infrastructure/http/stock-http-client");
jest.mock("@/lib/application/services/stock-service");

describe("StockPortfolioFactory", () => {
  const mockHttpClient = jest.fn().mockReturnValue({
    get: jest.fn(),
  });

  const mockRepository: jest.Mocked<IStockPortfolioRepository> = {
    saveMany: jest.fn().mockResolvedValue(undefined),
  };

  const mockCacheRepository: jest.Mocked<IStockPortfolioCacheRepository> = {
    get: jest.fn(),
    set: jest.fn(),
    close: jest.fn(),
  };

  let factory: StockPortfolioFactory;

  beforeEach(() => {
    jest.clearAllMocks();
    factory = new StockPortfolioFactory(
      mockRepository,
      mockCacheRepository,
      mockHttpClient as unknown as AxiosInstance,
    );
  });

  describe("createService", () => {
    it("should update http client config with baseURL", () => {
      factory.createService("test-api-key");

      expect(StockPortfolioHttpClient).toHaveBeenCalledWith(
        mockHttpClient,
        "test-api-key",
      );
    });

    it("should create StockPortfolioService", () => {
      const service = factory.createService("test-api-key");

      expect(service).toBeInstanceOf(StockPortfolioService);
    });
  });
});
