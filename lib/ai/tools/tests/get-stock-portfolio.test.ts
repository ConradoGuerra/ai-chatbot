import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { getStockPortfolio } from "../get-stock-portfolio";
import axios from "axios";

const createMockInterceptors = () => ({
  request: { use: vi.fn(), eject: vi.fn() },
  response: { use: vi.fn(), eject: vi.fn() },
});

const mockAxiosResponse = (response: any) => {
  const mockedAxios = axios as any;
  mockedAxios.create.mockReturnValueOnce({
    get: vi.fn().mockResolvedValue(response),
    interceptors: createMockInterceptors(),
  });
};

const mockAxiosError = (error: Error) => {
  const mockedAxios = axios as any;
  mockedAxios.create.mockReturnValueOnce({
    get: vi.fn().mockRejectedValue(error),
    interceptors: createMockInterceptors(),
  });
};

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: createMockInterceptors(),
    })),
  },
}));

describe("getStockPortfolio tool", () => {
  beforeAll(() => {
    process.env.FMP_API_KEY = "FAKE_KEY";
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("returns prices and variations for valid tickers", async () => {
    const mockData = [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 150,
        changesPercentage: 1.35,
        volume: 42162846,
        timestamp: 1755892801,
      },
    ];

    mockAxiosResponse({ data: mockData });

    const [result] = await getStockPortfolio.execute({ tickers: ["AAPL"] });

    expect(result).toEqual({
      ticker: "AAPL",
      price: 150,
      volume: 42162846,
      changesPercentage: 1.35,
      timestamp: 1755892801, 
    });
  });

  it("returns undefined when the API returns no data", async () => {
    mockAxiosResponse({ data: [] });

    const result = await getStockPortfolio.execute({ tickers: ["INVALID"] });

    expect(result).toBeUndefined();
  });

  it("handles API errors gracefully", async () => {
    mockAxiosError(new Error("Network Error"));

    const result = await getStockPortfolio.execute({ tickers: ["ERR"] });

    expect(result).toBeUndefined();
  });
});
