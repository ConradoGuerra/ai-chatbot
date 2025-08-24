import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { getStockPortfolio } from "../get-stock-portfolio";

describe("getStockPortfolio tool", () => {
  beforeAll(() => {
    process.env.FMP_API_KEY = "FAKE_KEY";
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the expected result", async () => {
    const mockAxios = { get: vi.fn() };
    const mockData = [
      {
        symbol: "AAPL",
        price: 150,
        changesPercentage: 1.35,
        volume: 42162846,
        timestamp: 1755892801,
      },
    ];

    mockAxios.get.mockResolvedValue({ data: mockData });

    const getStockPortfolioMethod = getStockPortfolio(mockAxios as any)
    const result = await getStockPortfolioMethod.execute(
      {
        tickers: ["AAPL"],
      },
      {} as any,
    );

    expect(result).toEqual([
      {
        symbol: "AAPL",
        price: 150,
        volume: 42162846,
        changesPercentage: 1.35,
        timestamp: 1755892801,
      },
    ]);

    expect(mockAxios.get).toHaveBeenCalledWith("/quote/AAPL?apikey=FAKE_KEY");
  });

  it("should an error", async () => {
    const mockAxios = { get: vi.fn() };

    mockAxios.get.mockRejectedValue(new Error("Error"));

    const getStockPortfolioMethod = getStockPortfolio(mockAxios as any);

    const result = await getStockPortfolioMethod.execute(
      {
        tickers: ["AAPL"],
      },
      {} as any,
    );

    expect(result).toEqual([]);

    expect(mockAxios.get).toHaveBeenCalledWith("/quote/AAPL?apikey=FAKE_KEY");
  });
});
