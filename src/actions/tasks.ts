'use server';

import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(title: string, description: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  await prisma.task.create({
    data: {
      title,
      description,
      authorId: session.userId,
      status: 'pending',
    },
  });

  await createAuditLog(session.userId, 'ADD_TASK', `Created new task: ${title}`);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function toggleTaskAction(taskId: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { error: 'Task not found' };

  await prisma.task.update({
    where: { id: taskId },
    data: { status: task.status === 'completed' ? 'pending' : 'completed' },
  });

  await createAuditLog(session.userId, 'TOGGLE_TASK', `Toggled status for task: ${taskId}`);
  revalidatePath('/dashboard');
  return { success: true };
}
