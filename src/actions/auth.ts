'use server';

import { prisma } from '@/lib/db';
import { verifyPassword, signToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { createAuditLog } from './audit';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Invalid credentials.' };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: 'Invalid credentials.' };
  }

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);
  await createAuditLog(user.id, 'LOGIN', `User ${user.email} logged in`);

  redirect('/dashboard');
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/');
}
