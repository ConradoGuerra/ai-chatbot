import { StockPortfolioService } from '../stock-service';
import { Stock } from '@/lib/domain/stock/types';

describe('StockPortfolioService', () => {
  const mockStockClient = {
    getQuote: jest.fn(),
  };
  let stockService: StockPortfolioService;

  beforeEach(() => {
    stockService = new StockPortfolioService(mockStockClient as any);
    jest.clearAllMocks();
  });

  describe('getPortfolio', () => {
    const mockStocks: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc',
        price: 150.0,
        volume: 1000000,
        changesPercentage: 1.5,
        timestamp: '1234567890',
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        price: 2800.0,
        volume: 500000,
        changesPercentage: 0.8,
        timestamp: '1234567890',
      },
    ];

    it('should return portfolio data for valid tickers', async () => {
      mockStockClient.getQuote
        .mockResolvedValueOnce(mockStocks[0])
        .mockResolvedValueOnce(mockStocks[1]);

      const result = await stockService.getPortfolio(['AAPL', 'GOOGL']);

      expect(result).toEqual(mockStocks);
      expect(mockStockClient.getQuote).toHaveBeenCalledTimes(2);
      expect(mockStockClient.getQuote).toHaveBeenCalledWith('AAPL');
      expect(mockStockClient.getQuote).toHaveBeenCalledWith('GOOGL');
    });

    it('should handle failed quotes gracefully', async () => {
      mockStockClient.getQuote
        .mockResolvedValueOnce(mockStocks[0])
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await stockService.getPortfolio(['AAPL', 'INVALID']);

      expect(result).toEqual([mockStocks[0]]);
      expect(mockStockClient.getQuote).toHaveBeenCalledTimes(2);
    });

    it('should handle null responses', async () => {
      mockStockClient.getQuote
        .mockResolvedValueOnce(mockStocks[0])
        .mockResolvedValueOnce(null);

      const result = await stockService.getPortfolio(['AAPL', 'INVALID']);

      expect(result).toEqual([mockStocks[0]]);
      expect(mockStockClient.getQuote).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when all quotes fail', async () => {
      mockStockClient.getQuote.mockRejectedValue(new Error('API Error'));

      const result = await stockService.getPortfolio(['INVALID1', 'INVALID2']);

      expect(result).toEqual([]);
      expect(mockStockClient.getQuote).toHaveBeenCalledTimes(2);
    });
  });
});
