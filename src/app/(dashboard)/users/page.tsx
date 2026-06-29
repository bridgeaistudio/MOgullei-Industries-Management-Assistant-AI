import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { UsersClient } from './UsersClient';

export default async function UsersPage() {
  const users = await prisma.user.findMany({ where: { deletedAt: null }, orderBy: { name: 'asc' } });

  return (
    <>
      <Header title="Users" />
      <div className="flex-1 overflow-y-auto">
        <UsersClient users={JSON.parse(JSON.stringify(users))} />
      </div>
    </>
  );
}
