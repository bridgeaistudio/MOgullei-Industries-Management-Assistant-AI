'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function updateSettingsAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {
      currency: formData.get('currency') as string,
      factoryName: formData.get('factoryName') as string,
      registrationNumber: formData.get('registrationNumber') as string,
      tin: formData.get('tin') as string,
      address: formData.get('address') as string,
      district: formData.get('district') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    },
    create: {
      id: 'singleton',
      currency: formData.get('currency') as string,
      factoryName: formData.get('factoryName') as string,
      registrationNumber: formData.get('registrationNumber') as string,
      tin: formData.get('tin') as string,
      address: formData.get('address') as string,
      district: formData.get('district') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    },
  });

  await createAuditLog(session.userId, 'UPDATE_SETTINGS', 'Updated factory settings');
  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function updateBudgetAction(category: string, monthlyLimit: number) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await prisma.budget.upsert({
    where: { category },
    update: { monthlyLimit },
    create: { category, monthlyLimit },
  });

  await createAuditLog(session.userId, 'UPDATE_BUDGET', `Updated budget for ${category} to ${monthlyLimit}`);
  revalidatePath('/dashboard/accounting');
  return { success: true };
}
