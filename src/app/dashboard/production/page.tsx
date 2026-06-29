import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { ProductionClient } from './ProductionClient';

export default async function Page() {
  const [recipes, batches, wasteLogs] = await Promise.all([
    prisma.recipe.findMany({
      where: { deletedAt: null },
      include: {
        ingredients: {
          include: { rawMaterial: true },
        },
      },
    }),
    prisma.batch.findMany({
      where: { deletedAt: null },
      include: { qualityLogs: true },
    }),
    prisma.wasteLog.findMany({
      include: { batch: true },
    }),
  ]);

  return (
    <>
      <Header title="Production" />
      <div className="flex-1 overflow-y-auto">
        <ProductionClient
          recipes={JSON.parse(JSON.stringify(recipes))}
          batches={JSON.parse(JSON.stringify(batches))}
          wasteLogs={JSON.parse(JSON.stringify(wasteLogs))}
        />
      </div>
    </>
  );
}
