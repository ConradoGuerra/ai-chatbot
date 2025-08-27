import { IStockCacheRepository } from '@/lib/domain/stock/interfaces';
import { StockPortfolioService } from '../stock-service';
import { Stock } from '@/lib/domain/stock/types';

describe('StockPortfolioService', () => {
  const mockStockClient = {
    getQuotes: jest.fn(),
  };
  const mockStockRepository = {
    saveMany: jest.fn(),
  };
  const mockCacheService: IStockCacheRepository = {
    get: jest.fn(),
    set: jest.fn(),
    close: jest.fn(),
  };

  let stockService: StockPortfolioService;

  beforeEach(() => {
    stockService = new StockPortfolioService(
      mockStockClient as any,
      mockStockRepository as any,
      mockCacheService,
    );
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getPortfolio', () => {
    const mockStocks: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc',
        price: 150.0,
        volume: 1000000,
        changesPercentage: 1.5,
        timestamp: 1234567890,
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        price: 2800.0,
        volume: 500000,
        changesPercentage: 0.8,
        timestamp: 1234567890,
      },
    ];

    describe('when using cache', () => {
      it('should return cached quotes when available', async () => {
        (mockCacheService.get as jest.Mock).mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual(mockStocks);
        expect(mockCacheService.get).toHaveBeenCalledWith(['AAPL', 'GOOGL']);
        expect(mockStockClient.getQuotes).not.toHaveBeenCalled();
        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
      });

      it('should fetch and cache quotes when cache is empty', async () => {
        (mockCacheService.get as jest.Mock).mockResolvedValueOnce(null);
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual(mockStocks);
        expect(mockCacheService.get).toHaveBeenCalledWith(['AAPL', 'GOOGL']);
        expect(mockCacheService.set).toHaveBeenCalledWith(
          ['AAPL', 'GOOGL'],
          mockStocks,
        );
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
        expect(mockStockRepository.saveMany).toHaveBeenCalledWith(mockStocks);
      });

      it('should handle cache service errors gracefully', async () => {
        (mockCacheService.get as jest.Mock).mockRejectedValueOnce(
          new Error('Cache error'),
        );

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).not.toHaveBeenCalled();
        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('when does not have errors', () => {
      beforeEach(() => {
        (mockCacheService.get as jest.Mock).mockResolvedValue(null);
      });

      it('should handle empty tickers array', async () => {
        const result = await stockService.getPortfolio([]);

        expect(result).toEqual([]);
        expect(mockCacheService.get).not.toHaveBeenCalled();
        expect(mockStockClient.getQuotes).not.toHaveBeenCalled();
        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
      });

      it('should return early when first fetch gets all quotes', async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual(mockStocks);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
        expect(mockStockClient.getQuotes).toHaveBeenCalledWith([
          'AAPL',
          'GOOGL',
        ]);
      });

      it('should retry fetching missing stocks', async () => {
        const firstResponse = [mockStocks[0]];
        const secondResponse = [mockStocks[1]];
        mockStockClient.getQuotes
          .mockResolvedValueOnce(firstResponse)
          .mockResolvedValueOnce(secondResponse);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual([...firstResponse, ...secondResponse]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
        expect(mockStockClient.getQuotes).toHaveBeenNthCalledWith(1, [
          'AAPL',
          'GOOGL',
        ]);
        expect(mockStockClient.getQuotes).toHaveBeenNthCalledWith(2, ['GOOGL']);
        expect(mockCacheService.set).toHaveBeenCalledWith(
          ['AAPL', 'GOOGL'],
          mockStocks,
        );
      });

      it('should handle when retry also fails', async () => {
        const firstResponse = [mockStocks[0]];
        mockStockClient.getQuotes
          .mockResolvedValueOnce(firstResponse)
          .mockResolvedValueOnce([]);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual([...firstResponse]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
        expect(mockCacheService.set).toHaveBeenCalledWith(
          ['AAPL', 'GOOGL'],
          firstResponse,
        );
      });

      it('should handle empty responses', async () => {
        mockStockClient.getQuotes.mockResolvedValue([]);

        const result = await stockService.getPortfolio([
          'INVALID1',
          'INVALID2',
        ]);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
        expect(mockCacheService.set).not.toHaveBeenCalled();
      });
    });

    describe('when it has errors', () => {
      beforeEach(() => {
        (mockCacheService.get as jest.Mock).mockResolvedValue(null);
      });

      it('should handle API errors', async () => {
        mockStockClient.getQuotes.mockRejectedValue(new Error('API Error'));

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).toHaveBeenCalled();
        expect(mockCacheService.set).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });

      it('should not save to repository or cache when no quotes are returned', async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce([]);

        await stockService.getPortfolio(['INVALID']);

        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
        expect(mockCacheService.set).not.toHaveBeenCalled();
      });

      it('should handle database save errors and return empty array', async () => {
        const dbError = new Error('Database error');
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);
        mockStockRepository.saveMany.mockRejectedValueOnce(dbError);

        const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

        expect(result).toEqual([]);
        expect(mockStockRepository.saveMany).toHaveBeenCalledWith(mockStocks);
        expect(mockCacheService.set).toHaveBeenCalledWith(
          ['AAPL', 'GOOGL'],
          mockStocks,
        );
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});
