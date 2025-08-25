import { Stock } from "@/lib/domain/stock/types";
import { StockHttpClient } from "../stock-http-client";

describe("StockClient", () => {
  const mockAxios = {
    get: jest.fn(),
  };
  const apiKey = "test-api-key";
  let stockClient: StockHttpClient;

  beforeEach(() => {
    stockClient = new StockHttpClient(mockAxios as any, apiKey);
    jest.clearAllMocks();
  });

  describe("getQuote", () => {
    const mockStock: Stock = {
      symbol: "AAPL",
      name: "Apple Inc",
      price: 150.0,
      volume: 1000000,
      changesPercentage: 1.5,
      timestamp: "1234567890",
    };

    it("should return stock data when API call succeeds", async () => {
      mockAxios.get.mockResolvedValueOnce({ data: [mockStock] });

      const result = await stockClient.getQuote("AAPL");

      expect(result).toEqual(mockStock);
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/AAPL?apikey=${apiKey}`,
      );
    });

    it("should return null when API returns empty array", async () => {
      mockAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await stockClient.getQuote("INVALID");

      expect(result).toBeNull();
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/INVALID?apikey=${apiKey}`,
      );
    });

    it("should throw error when API call fails", async () => {
      const error = new Error("API Error");
      mockAxios.get.mockRejectedValueOnce(error);

      await expect(stockClient.getQuote("AAPL")).rejects.toThrow(
        "Failed to fetch quote for AAPL: API Error",
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        `/quote/AAPL?apikey=${apiKey}`,
      );
    });
  });
});
