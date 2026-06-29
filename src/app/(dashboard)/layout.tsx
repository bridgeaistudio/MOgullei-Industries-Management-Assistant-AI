import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const [user, settings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, avatar: true },
    }),
    prisma.settings.findFirst({ where: { id: 'singleton' } }),
  ]);

  if (!user) redirect('/login');

  const settingsData = settings || {
    currency: 'UGX',
    factoryName: 'MOgullei Industries',
    registrationNumber: '',
    tin: '',
    address: '',
    district: '',
    phone: '',
    email: '',
  };

  return (
    <AppProvider currentUser={user} settings={settingsData}>
      <div className="flex h-screen w-full bg-[#FAF9F6] text-slate-800 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </main>
      </div>
    </AppProvider>
  );
}
