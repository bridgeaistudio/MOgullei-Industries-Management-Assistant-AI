import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { InventoryClient } from './InventoryClient';

export default async function Page() {
  const [rawMaterials, finishedGoods, suppliers] = await Promise.all([
    prisma.rawMaterial.findMany({ where: { deletedAt: null } }),
    prisma.finishedGood.findMany({ where: { deletedAt: null } }),
    prisma.supplier.findMany({ where: { deletedAt: null } }),
  ]);

  return (
    <>
      <Header title="Inventory" />
      <div className="flex-1 overflow-y-auto">
        <InventoryClient
          rawMaterials={JSON.parse(JSON.stringify(rawMaterials))}
          finishedGoods={JSON.parse(JSON.stringify(finishedGoods))}
          suppliers={JSON.parse(JSON.stringify(suppliers))}
        />
      </div>
    </>
  );
}
