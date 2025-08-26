import { StockPortfolioService } from "../stock-service";
import { Stock } from "@/lib/domain/stock/types";

describe("StockPortfolioService", () => {
  const mockStockClient = {
    getQuotes: jest.fn(),
  };
  const mockStockRepository = {
    saveMany: jest.fn(),
  };
  let stockService: StockPortfolioService;

  beforeEach(() => {
    stockService = new StockPortfolioService(
      mockStockClient as any,
      mockStockRepository as any,
    );
    jest.clearAllMocks();
  });

  describe("getPortfolio", () => {
    const mockStocks: Stock[] = [
      {
        symbol: "AAPL",
        name: "Apple Inc",
        price: 150.0,
        volume: 1000000,
        changesPercentage: 1.5,
        timestamp: 1234567890,
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc",
        price: 2800.0,
        volume: 500000,
        changesPercentage: 0.8,
        timestamp: 1234567890,
      },
    ];

    describe("when does not have errors", () => {
      it("should handle empty tickers array", async () => {
        const result = await stockService.getPortfolio([]);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).not.toHaveBeenCalled();
        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
      });

      it("should return early when first fetch gets all quotes", async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual(mockStocks);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
        expect(mockStockClient.getQuotes).toHaveBeenCalledWith([
          "AAPL",
          "GOOGL",
        ]);
      });

      it("should call saveMany on the repository with stocks after fetching portfolio", async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual(mockStocks);
        expect(mockStockRepository.saveMany).toHaveBeenCalledWith(mockStocks);
        expect(mockStockRepository.saveMany).toHaveBeenCalledTimes(1);
      });

      it("should return portfolio data for valid tickers", async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual(mockStocks);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
        expect(mockStockClient.getQuotes).toHaveBeenCalledWith([
          "AAPL",
          "GOOGL",
        ]);
      });

      it("should retry fetching missing stocks", async () => {
        mockStockClient.getQuotes
          .mockResolvedValueOnce([mockStocks[0]])
          .mockResolvedValueOnce([mockStocks[1]]);

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual(mockStocks);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
        expect(mockStockClient.getQuotes).toHaveBeenNthCalledWith(1, [
          "AAPL",
          "GOOGL",
        ]);
        expect(mockStockClient.getQuotes).toHaveBeenNthCalledWith(2, ["GOOGL"]);
      });

      it("should handle when retry also fails", async () => {
        mockStockClient.getQuotes
          .mockResolvedValueOnce([mockStocks[0]])
          .mockResolvedValueOnce([]);

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual([mockStocks[0]]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
      });

      it("should handle empty responses", async () => {
        mockStockClient.getQuotes
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]);

        const result = await stockService.getPortfolio([
          "INVALID1",
          "INVALID2",
        ]);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(2);
      });
    });

    describe("when it has errors", () => {
      it("should handle API errors", async () => {
        mockStockClient.getQuotes.mockRejectedValue(new Error("API Error"));

        const result = await stockService.getPortfolio(["AAPL", "GOOGL"]);

        expect(result).toEqual([]);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
      });

      it("should not save to repository when no quotes are returned", async () => {
        mockStockClient.getQuotes.mockResolvedValueOnce([]);

        await stockService.getPortfolio(["INVALID"]);

        expect(mockStockRepository.saveMany).not.toHaveBeenCalled();
      });

      it("should handle database save errors", async () => {
        const dbError = new Error("Database error");
        mockStockClient.getQuotes.mockResolvedValueOnce(mockStocks);
        mockStockRepository.saveMany.mockRejectedValueOnce(dbError);

        await expect(
          stockService.getPortfolio(["AAPL", "GOOGL"]),
        ).resolves.not.toThrow();
        expect(mockStockRepository.saveMany).toHaveBeenCalledWith(mockStocks);
        expect(mockStockClient.getQuotes).toHaveBeenCalledTimes(1);
      });
    });
  });
});
