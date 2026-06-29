import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { SalesClient } from './SalesClient';

export default async function Page() {
  const [orders, clients, finishedGoods] = await Promise.all([
    prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        items: { include: { finishedGood: true } },
        client: true,
      },
      orderBy: { date: 'desc' },
    }),
    prisma.client.findMany({ where: { deletedAt: null } }),
    prisma.finishedGood.findMany({ where: { deletedAt: null } }),
  ]);

  return (
    <>
      <Header title="Sales" />
      <div className="flex-1 overflow-y-auto">
        <SalesClient
          orders={JSON.parse(JSON.stringify(orders))}
          clients={JSON.parse(JSON.stringify(clients))}
          finishedGoods={JSON.parse(JSON.stringify(finishedGoods))}
        />
      </div>
    </>
  );
}
