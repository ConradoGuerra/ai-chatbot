import { RedisClient } from "@/lib/infrastructure/cache/redis.client";
import { DrizzleStockQuoteRepository } from "@/lib/infrastructure/repositories/drizzle-stock-quote.repository";
import { StockPortfolioCacheRepository } from "@/lib/infrastructure/repositories/stock-cache.repository";
import { StockPortfolioFactory } from "@/lib/application/factories/stock-portfolio.factory";
import { createAxiosInstance } from "@/lib/axios/client";

const redisClient = new RedisClient();
const stockPortfolioCacheRepository = new StockPortfolioCacheRepository(
  redisClient,
);
const stockPortfolioFactory = new StockPortfolioFactory(
  stockPortfolioCacheRepository,
  createAxiosInstance({
    baseURL: "https://financialmodelingprep.com/api/v3",
  }),
);

const drizzleStockQuoteRepository = new DrizzleStockQuoteRepository();
const stockPortfolioService = stockPortfolioFactory.createService(
  process.env.FMP_API_KEY || "local_key",
);

export { drizzleStockQuoteRepository, stockPortfolioService };
