import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { AiMarketingClient } from './AiMarketingClient';

export default async function AiMarketingPage() {
  const [finishedGoods, batches] = await Promise.all([
    prisma.finishedGood.findMany(),
    prisma.batch.findMany(),
  ]);

  return (
    <>
      <Header title="AI Marketing" />
      <div className="flex-1 overflow-y-auto">
        <AiMarketingClient
          finishedGoods={JSON.parse(JSON.stringify(finishedGoods))}
          batches={JSON.parse(JSON.stringify(batches))}
        />
      </div>
    </>
  );
}
