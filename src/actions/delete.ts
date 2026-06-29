'use server';

import { prisma } from '@/lib/db';
import { getSession, verifyPassword } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

const CRITICAL_MODELS = ['User', 'Recipe', 'Order', 'Batch'] as const;
type CriticalModel = (typeof CRITICAL_MODELS)[number];

type DeletableModel =
  | 'User' | 'Client' | 'Supplier' | 'RawMaterial' | 'Recipe'
  | 'Batch' | 'FinishedGood' | 'Order' | 'Delivery' | 'Task' | 'Expense';

const MODEL_PATH_MAP: Record<DeletableModel, string> = {
  User: '/users',
  Client: '/crm',
  Supplier: '/inventory',
  RawMaterial: '/inventory',
  Recipe: '/production',
  Batch: '/production',
  FinishedGood: '/products',
  Order: '/sales',
  Delivery: '/logistics',
  Task: '/dashboard',
  Expense: '/accounting',
};

function isCritical(model: string): model is CriticalModel {
  return CRITICAL_MODELS.includes(model as CriticalModel);
}

export async function softDeleteAction(
  model: DeletableModel,
  id: string,
  password?: string
) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  if (isCritical(model)) {
    if (!password) return { error: 'Password is required for this action.' };

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: 'User not found.' };

    const valid = await verifyPassword(password, user.password);
    if (!valid) return { error: 'Incorrect password.' };
  }

  const now = new Date();

  try {
    switch (model) {
      case 'User':
        await prisma.user.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Client':
        await prisma.client.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Supplier':
        await prisma.supplier.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'RawMaterial':
        await prisma.rawMaterial.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Recipe':
        await prisma.recipe.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Batch':
        await prisma.batch.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'FinishedGood':
        await prisma.finishedGood.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Order':
        await prisma.order.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Delivery':
        await prisma.delivery.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Task':
        await prisma.task.update({ where: { id }, data: { deletedAt: now } });
        break;
      case 'Expense':
        await prisma.expense.update({ where: { id }, data: { deletedAt: now } });
        break;
    }

    await createAuditLog(session.userId, `DELETE_${model.toUpperCase()}`, `Soft-deleted ${model} with id: ${id}`);
    revalidatePath(MODEL_PATH_MAP[model]);
    return { success: true };
  } catch {
    return { error: 'Failed to delete. Please try again.' };
  }
}
