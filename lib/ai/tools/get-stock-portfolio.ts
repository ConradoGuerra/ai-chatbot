import { tool } from "ai";
import { z } from "zod";
import type { IStockService } from "@/lib/domain/stock/interfaces";

export const getStockPortfolio = (stockService: IStockService) =>
  tool({
    name: "getStockPortfolio",
    inputSchema: z.object({
      tickers: z
        .array(z.string())
        .nonempty("The list of tickers cannot be empty"),
    }),
    description:
      "Fetches current prices and variations for a list of stock tickers using the Financial Modeling Prep API.",
    execute: async ({ tickers }) => {
      try {
        return await stockService.getPortfolio(tickers);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Failed to get stock portfolio:", message);
        return [];
      }
    },
  });
