import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { ProductsClient } from './ProductsClient';

export default async function Page() {
  const finishedGoods = await prisma.finishedGood.findMany();

  return (
    <>
      <Header title="Products" />
      <div className="flex-1 overflow-y-auto">
        <ProductsClient finishedGoods={JSON.parse(JSON.stringify(finishedGoods))} />
      </div>
    </>
  );
}
