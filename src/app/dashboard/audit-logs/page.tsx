import { prisma } from '@/lib/db';
import { Header } from '@/components/Header';
import { AuditLogsClient } from './AuditLogsClient';

export default async function AuditLogsPage() {
  const auditLogs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' },
  });

  return (
    <>
      <Header title="Audit Logs" />
      <div className="flex-1 overflow-y-auto">
        <AuditLogsClient logs={JSON.parse(JSON.stringify(auditLogs))} />
      </div>
    </>
  );
}
