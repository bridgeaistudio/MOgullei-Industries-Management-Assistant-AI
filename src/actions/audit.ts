'use server';

import { prisma } from '@/lib/db';

export async function createAuditLog(userId: string, action: string, details: string) {
  await prisma.auditLog.create({
    data: { userId, action, details },
  });
}
