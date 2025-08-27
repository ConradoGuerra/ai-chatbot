import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Stock } from '@/lib/domain/stock/types';

export function StockPortfolio({ portfolio }: { portfolio?: Stock[] }) {
  if (!portfolio) {
    return <div className="skeleton">Loading stock portfolio...</div>;
  }

  const totalValue = portfolio.reduce((sum, stock) => sum + stock.price, 0);
  const averageChange =
    portfolio.length > 0
      ? portfolio.reduce((sum, stock) => sum + stock.changesPercentage, 0) /
        portfolio.length
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-lg">
            Seu portfólio vale{' '}
            <strong>
              ${' '}
              {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </strong>{' '}
            no total, com variação média de{' '}
            <strong
              className={averageChange >= 0 ? 'text-green-500' : 'text-red-500'}
            >
              {averageChange.toFixed(2)}%
            </strong>{' '}
            no dia.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4 text-center font-semibold mb-2">
          <div>Ticker</div>
          <div>Price</div>
          <div>Change</div>
          <div>Volume</div>
        </div>

        {portfolio.map((stock: Stock) => {
          return (
            <div
              key={stock.symbol}
              className="grid grid-cols-5 gap-4 text-center py-2 border-b border-gray-100 last:border-0"
            >
              <div className="font-medium">{stock.symbol}</div>
              <div>$ {stock.price.toFixed(2)}</div>
              <div
                className={
                  stock.changesPercentage > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {stock.changesPercentage > 0 ? '+' : ''}
                {stock.changesPercentage.toFixed(2)}%
              </div>
              <div>{stock.volume?.toLocaleString('pt-BR')}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
