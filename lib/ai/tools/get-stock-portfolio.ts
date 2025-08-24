import { tool } from "ai";
import { z } from "zod";
import createAxiosInstance from "../../axios/client";
import axiosRetry from "axios-retry";

import { Stock } from "@/lib/domain/stock/types";

export const getStockPortfolio = tool({
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
    if (!apiKey) {
      throw new Error("FMP_API_KEY is not defined in the environment.");
    }

    const axios = createAxiosInstance({
      baseURL: "https://financialmodelingprep.com/api/v3",
    });

    axiosRetry(axios, { retries: 2 });


    for (const ticker of tickers) {
      try {
        const { data } = await axios.get<Stock[]>(
          `/quote/${ticker}?apikey=${apiKey}`,
        );

        if (data.length) {
          return data.map((result) => ({
            ticker: result.symbol,
            price: result.price,
            volume: result.volume,
            changesPercentage: result.changesPercentage,
            timestamp: result.timestamp,
          }));
        }
      } catch (err: any) {
        console.error(`Error fetching ticker ${ticker}:`, err.message);
      }
    }
  },
});
