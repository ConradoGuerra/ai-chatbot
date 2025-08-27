import type { Stock } from "./types";

export interface IStockClient {
  getQuote(ticker: string): Promise<Stock | null>;
  getQuotes(tickers: string[]): Promise<Stock[]>;
}

export interface IStockService {
  getPortfolio(tickers: string[]): Promise<Stock[]>;
}

export interface IStockRepository {
  saveMany(quotes: Stock[]): Promise<void>;
}

export interface IStockCacheRepository {
  get(tickers: string[]): Promise<Stock[] | null>;
  set(tickers: string[], stocks: Stock[]): Promise<void>;
  close(): Promise<void>;
}
