'use client';

import React, { useState } from 'react';
import { ShieldAlert, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
  user: { id: string; name: string };
}

interface AuditLogsClientProps {
  logs: AuditLog[];
}

export function AuditLogsClient({ logs }: AuditLogsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserName = (log: AuditLog) => {
    if (log.userId === 'system') return 'System';
    return log.user?.name || log.userId;
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            System Audit Trail
          </h3>
          <p className="text-sm text-stone-500 mt-1">Track every action performed within the system for compliance and security.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-white transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter by Date
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {getUserName(log)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold tracking-wider uppercase border border-indigo-100">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-600">
                  {log.details}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-stone-500 italic">No logs found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
