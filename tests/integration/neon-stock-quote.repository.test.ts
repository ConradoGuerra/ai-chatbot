import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { stockQuotesHistoric } from "@/lib/db/schema";
import { NeonStockQuoteRepository } from "../../lib/infrastructure/repositories/neon-stock-quote.repository";

describe("NeonStockQuoteRepository Integration", () => {
  let repository: NeonStockQuoteRepository;
  let db: ReturnType<typeof drizzle>;

  beforeAll(() => {
    const TEST_DB_URL =
      "postgresql://neondb_owner:npg_lmoURTHw9L3r@ep-young-shadow-ac8t6qms-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

    const sql = neon(TEST_DB_URL);
    db = drizzle(sql);
    repository = new NeonStockQuoteRepository(TEST_DB_URL);
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
          timestamp: new Date().toISOString(),
        },
        {
          symbol: "GOOGL",
          name: "Google",
          price: 2800.0,
          volume: 500000,
          changesPercentage: 0.8,
          timestamp: new Date().toISOString(),
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
