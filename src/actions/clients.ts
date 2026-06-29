'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addClientAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const client = await prisma.client.create({
    data: {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      district: (formData.get('district') as string) || null,
      region: (formData.get('region') as string) || null,
      notes: (formData.get('notes') as string) || '',
      totalSpent: 0,
    },
  });

  await createAuditLog(session.userId, 'ADD_CLIENT', `Added new client: ${client.name}`);
  revalidatePath('/dashboard/crm');
  return { success: true };
}
