import { Stock } from "@/lib/domain/stock/types";
import { StockPortfolioHttpClient } from "../stock-portfolio-http.client";

describe(" StockPortfolioHttpClient", () => {
  const mockAxios = {
    get: jest.fn(),
  };
  const apiKey = "test-api-key";
  let stockClient: StockPortfolioHttpClient;

  beforeEach(() => {
    stockClient = new StockPortfolioHttpClient(mockAxios as any, apiKey);
    jest.clearAllMocks();
  });

  describe("getQuotes", () => {
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

    it("should return multiple stock data when API call succeeds", async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockStocks });

      const result = await stockClient.getQuotes(["AAPL", "GOOGL"]);

      expect(result).toEqual([
        {
          ...mockStocks[0],
          timestamp: 1234567890 * 1000,
        },
        {
          ...mockStocks[1],
          timestamp: 1234567890 * 1000,
        },
      ]);
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/AAPL,GOOGL?apikey=${apiKey}`,
      );
    });

    it("should return empty array when API returns empty array", async () => {
      mockAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await stockClient.getQuotes(["INVALID1", "INVALID2"]);

      expect(result).toEqual([]);
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/INVALID1,INVALID2?apikey=${apiKey}`,
      );
    });

    it("should throw error when API call fails", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValueOnce(error);

      await expect(stockClient.getQuotes(["AAPL", "GOOGL"])).rejects.toThrow(
        "Failed to fetch quotes for AAPL,GOOGL: API Error",
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/AAPL,GOOGL?apikey=${apiKey}`,
      );
    });
  });
});
