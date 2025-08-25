import { NeonStockQuoteRepository } from '@/lib/infrastructure/repositories/neon-stock-quote.repository';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const stockRepository = new NeonStockQuoteRepository(
  process.env.DATABASE_URL,
);
