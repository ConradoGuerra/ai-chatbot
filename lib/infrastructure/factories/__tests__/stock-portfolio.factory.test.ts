import { StockHttpClient } from "@/lib/infrastructure/http/stock-http-client";
import { StockPortfolioFactory } from "../stock-portfolio.factory";
import { StockPortfolioService } from "@/lib/application/services/stock-service";
import { type AxiosInstance } from "axios";
import type {
  IStockRepository,
  IStockCacheRepository,
} from "@/lib/domain/stock/interfaces";

jest.mock("@/lib/infrastructure/http/stock-http-client");
jest.mock("@/lib/application/services/stock-service");

describe("StockPortfolioFactory", () => {
  const mockHttpClient = jest.fn().mockReturnValue({
    get: jest.fn(),
  });

  const mockRepository: jest.Mocked<IStockRepository> = {
    saveMany: jest.fn().mockResolvedValue(undefined),
  };

  const mockCacheRepository: jest.Mocked<IStockCacheRepository> = {
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

  describe("createStockService", () => {
    it("should update http client config with baseURL", () => {
      factory.createStockService("test-api-key");

      expect(StockHttpClient).toHaveBeenCalledWith(
        mockHttpClient,
        "test-api-key",
      );
    });

    it("should create StockPortfolioService", () => {
      const service = factory.createStockService("test-api-key");

      expect(service).toBeInstanceOf(StockPortfolioService);
    });
  });
});
