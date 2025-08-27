import {
  drizzle as drizzleNeon,
  type NeonHttpDatabase,
} from 'drizzle-orm/neon-http';
import {
  drizzle as drizzlePostgre,
  type PostgresJsDatabase,
} from 'drizzle-orm/postgres-js';
import { stockQuotesHistoric } from '@/lib/db/schema';
import type { Stock } from '@/lib/domain/stock/types';
import type { IStockPortfolioRepository } from '@/lib/domain/stock/interfaces';
import { databaseConfig } from '@/config/database';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

export class DrizzleStockQuoteRepository implements IStockPortfolioRepository {
  private db: PostgresJsDatabase | NeonHttpDatabase;

  constructor() {
    if (
      databaseConfig.url ===
      'postgresql://user:secret@localhost:5432/ai-chatbot'
    ) {
      const sql = postgres(databaseConfig.url);
      this.db = drizzlePostgre(sql);
      return;
    }
    const sql = neon(databaseConfig.url);
    this.db = drizzleNeon(sql);
  }

  async saveMany(quotes: Stock[]): Promise<void> {
    if (quotes.length === 0) return;

    const quoteEntities = quotes.map((quote) => ({
      ticker: quote.symbol,
      price: quote.price.toString(),
      volume: quote.volume,
      changesPercentage: quote.changesPercentage?.toString(),
      quotedAt: new Date(quote.timestamp),
    }));

    await this.db.insert(stockQuotesHistoric).values(quoteEntities);
  }
}
