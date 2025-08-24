import { tool } from "ai";
import { z } from "zod";

import { Stock } from "@/lib/domain/stock/types";
import { AxiosInstance } from "axios";

export const getStockPortfolio = (axiosRetryInstance: AxiosInstance) =>
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
      const apiKey = process.env.FMP_API_KEY;

      const results = [];

      for await (const ticker of tickers) {
        try {
          const { data } = await axiosRetryInstance.get<Stock[]>(
            `/quote/${ticker}?apikey=${apiKey}`,
          );

          if (data.length) {
            results.push(
              data.reduce(
                (_, curr) => ({
                  symbol: curr.symbol,
                  price: curr.price,
                  volume: curr.volume,
                  changesPercentage: curr.changesPercentage,
                  timestamp: curr.timestamp,
                }),
                {},
              ),
            );
          }
        } catch (err: any) {
          console.error(`Error fetching ticker ${ticker}:`, err.message);
        }
      }
      return results;
    },
  });
