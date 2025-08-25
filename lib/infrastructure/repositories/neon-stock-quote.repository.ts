import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { stockQuotesHistoric } from "@/lib/db/schema";
import { Stock } from "@/lib/domain/stock/types";

export class NeonStockQuoteRepository {
  private readonly db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    const sql = neon(connectionString);
    this.db = drizzle(sql);
  }

  async saveMany(quotes: Stock[]): Promise<void> {
    if (quotes.length === 0) return;

    quotes.map(async (quote) => {
      const quoteEntity: typeof stockQuotesHistoric.$inferInsert = {
        ticker: quote.symbol,
        price: quote.price.toString(),
        volume: quote.volume,
        changes_percentage: quote.changesPercentage?.toString(),
        quoted_at: new Date(quote.timestamp),
      };
      await this.db.insert(stockQuotesHistoric).values(quoteEntity);
    });
  }
}
