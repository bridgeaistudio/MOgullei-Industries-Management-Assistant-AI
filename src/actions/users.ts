'use server';

import { prisma } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';
import { createAuditLog } from './audit';
import { revalidatePath } from 'next/cache';

export async function addUserAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const password = await hashPassword('Staff@123');
  const user = await prisma.user.create({
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string,
      status: (formData.get('status') as string) || 'active',
      password,
    },
  });

  await createAuditLog(session.userId, 'ADD_USER', `Added new user: ${user.name}`);
  revalidatePath('/dashboard/users');
  return { success: true };
}
