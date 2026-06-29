import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage() {
  const [settings, rawMaterials, finishedGoods, clients, orders] = await Promise.all([
    prisma.settings.findFirst({ where: { id: 'singleton' } }),
    prisma.rawMaterial.findMany(),
    prisma.finishedGood.findMany(),
    prisma.client.findMany(),
    prisma.order.findMany(),
  ]);

  const defaultSettings = settings || {
    currency: 'UGX',
    factoryName: '',
    registrationNumber: '',
    tin: '',
    address: '',
    district: '',
    phone: '',
    email: '',
  };

  return (
    <>
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto">
        <SettingsClient
          settings={JSON.parse(JSON.stringify(defaultSettings))}
          rawMaterials={JSON.parse(JSON.stringify(rawMaterials))}
          finishedGoods={JSON.parse(JSON.stringify(finishedGoods))}
          clients={JSON.parse(JSON.stringify(clients))}
          orders={JSON.parse(JSON.stringify(orders))}
        />
      </div>
    </>
  );
}
