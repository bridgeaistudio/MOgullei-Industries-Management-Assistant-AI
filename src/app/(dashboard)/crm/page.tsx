import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { CRMClient } from './CRMClient';

export default async function Page() {
  const [clients, suppliers] = await Promise.all([
    prisma.client.findMany({ where: { deletedAt: null } }),
    prisma.supplier.findMany({ where: { deletedAt: null } }),
  ]);

  return (
    <>
      <Header title="CRM" />
      <div className="flex-1 overflow-y-auto">
        <CRMClient
          clients={JSON.parse(JSON.stringify(clients))}
          suppliers={JSON.parse(JSON.stringify(suppliers))}
        />
      </div>
    </>
  );
}
