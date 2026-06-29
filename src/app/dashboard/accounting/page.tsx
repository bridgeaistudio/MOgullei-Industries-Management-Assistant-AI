import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { AccountingClient } from './AccountingClient';

export default async function AccountingPage() {
  const [expenses, orders, budgets] = await Promise.all([
    prisma.expense.findMany({ orderBy: { date: 'desc' } }),
    prisma.order.findMany(),
    prisma.budget.findMany(),
  ]);

  return (
    <>
      <Header title="Accounting" />
      <div className="flex-1 overflow-y-auto">
        <AccountingClient
          expenses={JSON.parse(JSON.stringify(expenses))}
          orders={JSON.parse(JSON.stringify(orders))}
          budgets={JSON.parse(JSON.stringify(budgets))}
        />
      </div>
    </>
  );
}
