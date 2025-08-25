import type { Stock } from "./types";

export interface IStockClient {
  getQuote(ticker: string): Promise<Stock | null>;
  getQuotes(tickers: string[]): Promise<Stock[]>;
}

export interface IStockService {
  getPortfolio(tickers: string[]): Promise<Stock[]>;
}

export interface StockClientConfig {
  baseURL: string;
  apiKey: string;
}
