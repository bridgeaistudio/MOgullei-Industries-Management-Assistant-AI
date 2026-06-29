import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.publicOrder.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
