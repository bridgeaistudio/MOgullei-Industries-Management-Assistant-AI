'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addQualityLogAction(
  batchId: string,
  data: { scentStrength: string; texture: string; color: string; notes: string; author: string }
) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await prisma.qualityLog.create({
    data: {
      batchId,
      date: new Date(),
      author: data.author,
      scentStrength: data.scentStrength,
      texture: data.texture,
      color: data.color,
      notes: data.notes,
    },
  });

  await createAuditLog(session.userId, 'ADD_QUALITY_LOG', `Added quality log for batch: ${batchId}`);
  revalidatePath('/dashboard/production');
  return { success: true };
}
