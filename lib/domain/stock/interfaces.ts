import type { Stock } from './types';

export interface IStockPortfolioClient {
  getQuotes(tickers: string[]): Promise<Stock[]>;
}

export interface IStockPortfolioService {
  getPortfolio(tickers: string[]): Promise<Stock[]>;
}

export interface IStockPortfolioRepository {
  saveMany(quotes: Stock[]): Promise<void>;
}

export interface IStockPortfolioCacheRepository {
  get(tickers: string[]): Promise<Stock[] | null>;
  set(tickers: string[], stocks: Stock[]): Promise<void>;
  close(): Promise<void>;
}
