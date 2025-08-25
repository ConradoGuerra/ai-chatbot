import { getStockPortfolio } from '../get-stock-portfolio';
import type { IStockService } from '@/lib/domain/stock/interfaces';
import type { Stock } from '@/lib/domain/stock/types';

describe('getStockPortfolio', () => {
  let mockStockService: jest.Mocked<IStockService>;

  beforeEach(() => {
    process.env.FMP_API_KEY = 'FAKE_KEY';
    mockStockService = {
      getPortfolio: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the expected result', async () => {
    const mockData: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 150,
        changesPercentage: 1.35,
        volume: 42162846,
        timestamp: '1755892801',
      },
    ];

    mockStockService.getPortfolio.mockResolvedValue(mockData);
    const tool = getStockPortfolio(mockStockService);

    if (!tool.execute) {
      throw new Error('Tool execute method not found');
    }

    const result = await tool.execute(
      {
        tickers: ['AAPL'],
      },
      {} as any,
    );

    expect(result).toEqual(mockData);
    expect(mockStockService.getPortfolio).toHaveBeenCalledWith(['AAPL']);
  });

  it('should handle error', async () => {
    mockStockService.getPortfolio.mockRejectedValue(new Error('Error'));

    const tool = getStockPortfolio(mockStockService);

    if (!tool.execute) {
      throw new Error('Tool execute method not found');
    }

    const result = await tool.execute(
      {
        tickers: ['AAPL'],
      },
      {} as any,
    );

    expect(result).toEqual([]);
    expect(mockStockService.getPortfolio).toHaveBeenCalledWith(['AAPL']);
  });
});
