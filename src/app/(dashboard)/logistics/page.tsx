import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { LogisticsClient } from './LogisticsClient';

export default async function Page() {
  const deliveries = await prisma.delivery.findMany({
    include: { order: true },
    orderBy: { date: 'desc' },
  });

  return (
    <>
      <Header title="Logistics" />
      <div className="flex-1 overflow-y-auto">
        <LogisticsClient deliveries={JSON.parse(JSON.stringify(deliveries))} />
      </div>
    </>
  );
}
