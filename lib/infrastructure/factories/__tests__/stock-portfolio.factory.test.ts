import { StockHttpClient } from '@/lib/infrastructure/http/stock-http-client';
import { StockPortfolioFactory } from '../stock-portfolio.factory';
import { StockPortfolioService } from '@/lib/application/services/stock-service';

jest.mock('@/lib/application/services/stock-service');
jest.mock('@/lib/infrastructure/http/stock-http-client');
jest.mock('@/lib/application/stock/client');

describe('StockPortfolioFactory', () => {
  const mockCreateHttpClient = jest.fn();
  const mockHttpClient = { get: jest.fn() };
  let factory: StockPortfolioFactory;
  const mockRepository = { saveMany: jest.fn() };

  beforeEach(() => {
    mockCreateHttpClient.mockReturnValue(mockHttpClient);
    factory = new StockPortfolioFactory(mockRepository, mockCreateHttpClient);
    jest.clearAllMocks();
  });

  describe('createStockService', () => {
    const config = {
      baseURL: 'https://api.example.com',
      apiKey: 'test-api-key',
    };

    it('should create a stock service with proper configuration', () => {
      const service = factory.createStockService(config);

      expect(mockCreateHttpClient).toHaveBeenCalledWith({
        baseURL: config.baseURL,
      });
      expect(StockHttpClient).toHaveBeenCalledWith(
        mockHttpClient,
        config.apiKey,
      );
      expect(StockPortfolioService).toHaveBeenCalledWith(
        expect.any(StockHttpClient),
        mockRepository,
      );
      expect(service).toBeInstanceOf(StockPortfolioService);
    });

    it('should use the same configuration for multiple service instances', () => {
      const service1 = factory.createStockService(config);
      const service2 = factory.createStockService(config);

      expect(mockCreateHttpClient).toHaveBeenCalledTimes(2);
      expect(StockHttpClient).toHaveBeenCalledTimes(2);
      expect(StockPortfolioService).toHaveBeenCalledTimes(2);
      expect(service1).not.toBe(service2);
    });
  });
});
