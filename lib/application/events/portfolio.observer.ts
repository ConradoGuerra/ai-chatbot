import { eventBus } from './event-bus';
import type { Stock } from '@/lib/domain/stock/types';
import { drizzleStockQuoteRepository } from '@/lib/application/singletons/stock-portfolio.singleton';

eventBus.on('portfolioObserved', async (stocks: Stock[]) => {
  console.log(
    `[portfolioObserver] Received event: portfolioObserved with ${stocks.length} stocks`,
    stocks,
  );
  try {
    await drizzleStockQuoteRepository.saveMany(stocks);
  } catch (error) {
    console.error(
      `Failed to save portfolio for ${stocks.length} stocks`,
      error,
    );
  }
});
