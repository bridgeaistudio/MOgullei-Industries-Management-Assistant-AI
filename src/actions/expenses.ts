'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addExpenseAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;

  await prisma.expense.create({
    data: {
      date: new Date(formData.get('date') as string),
      category,
      amount,
      description: formData.get('description') as string,
      reference: (formData.get('reference') as string) || null,
    },
  });

  await createAuditLog(session.userId, 'ADD_EXPENSE', `Logged expense: ${amount} UGX for ${category}`);
  revalidatePath('/accounting');
  return { success: true };
}
