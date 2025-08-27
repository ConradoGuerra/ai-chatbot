import { stockQuotesHistoric } from "@/lib/db/schema";
import { DrizzleStockQuoteRepository } from "../../lib/infrastructure/repositories/drizzle-stock-quote.repository";
import { databaseConfig } from "@/config/database";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

describe("DrizzleStockQuoteRepository Integration", () => {
  let repository: DrizzleStockQuoteRepository;
  let db: ReturnType<typeof drizzle>;

  beforeAll(() => {
    databaseConfig.url = "postgresql://user:secret@localhost:5432/ai-chatbot";
    const sql = postgres(databaseConfig.url);
    db = drizzle(sql);
    repository = new DrizzleStockQuoteRepository();
  });

  beforeEach(async () => {
    await db.delete(stockQuotesHistoric).execute();
  });

  describe("saveMany", () => {
    it("should successfully save multiple stock quotes", async () => {
      const testQuotes = [
        {
          symbol: "AAPL",
          name: "Apple",
          price: 150.0,
          volume: 1000000,
          changesPercentage: 1.5,
          timestamp: 1756238402,
        },
        {
          symbol: "GOOGL",
          name: "Google",
          price: 2800.0,
          volume: 500000,
          changesPercentage: 0.8,
          timestamp: 1756238402,
        },
      ];
      await repository.saveMany(testQuotes);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const saved = await db
        .select()
        .from(stockQuotesHistoric)
        .orderBy(stockQuotesHistoric.ticker);

      expect(saved).toHaveLength(2);
      expect(saved[0].ticker).toBe("AAPL");
      expect(Number(saved[0].price)).toBe(150.0);
      expect(saved[0].volume).toBe(1000000);
      expect(Number(saved[0].changes_percentage)).toBe(1.5);

      expect(saved[1].ticker).toBe("GOOGL");
      expect(Number(saved[1].price)).toBe(2800.0);
      expect(saved[1].volume).toBe(500000);
      expect(Number(saved[1].changes_percentage)).toBe(0.8);
    });

    it("should handle empty array of quotes", async () => {
      await expect(repository.saveMany([])).resolves.not.toThrow();
    });
  });
});
