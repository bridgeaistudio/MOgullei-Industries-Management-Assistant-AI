'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addWasteLogAction(data: {
  batchId: string;
  quantity: number;
  reason: string;
  notes: string;
  financialImpact: number;
}) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await prisma.wasteLog.create({
    data: {
      batchId: data.batchId,
      date: new Date(),
      quantity: data.quantity,
      reason: data.reason,
      notes: data.notes,
      financialImpact: data.financialImpact,
    },
  });

  await createAuditLog(session.userId, 'ADD_WASTE_LOG', `Logged waste for batch: ${data.batchId}`);
  revalidatePath('/dashboard/production');
  return { success: true };
}
