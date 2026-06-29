import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { TraceabilityClient } from './TraceabilityClient';

export default async function TraceabilityPage() {
  const batches = await prisma.batch.findMany({
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  return (
    <>
      <Header title="Traceability" />
      <div className="flex-1 overflow-y-auto">
        <TraceabilityClient batches={JSON.parse(JSON.stringify(batches))} />
      </div>
    </>
  );
}
