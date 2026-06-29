import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { DashboardClient } from './DashboardClient';

export default async function Page() {
  const [tasks, rawMaterials, batches, deliveries] = await Promise.all([
    prisma.task.findMany({
      where: { deletedAt: null },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rawMaterial.findMany({ where: { deletedAt: null } }),
    prisma.batch.findMany({ where: { deletedAt: null } }),
    prisma.delivery.findMany({ where: { deletedAt: null } }),
  ]);

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-y-auto">
        <DashboardClient
          tasks={JSON.parse(JSON.stringify(tasks))}
          rawMaterials={JSON.parse(JSON.stringify(rawMaterials))}
          batches={JSON.parse(JSON.stringify(batches))}
          deliveries={JSON.parse(JSON.stringify(deliveries))}
        />
      </div>
    </>
  );
}
