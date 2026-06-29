'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Truck, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';

interface FinishedGood {
  id: string;
  scent: string;
}

interface OrderItem {
  id: string;
  finishedGoodId: string;
  finishedGood: FinishedGood;
  quantity: number;
  price: number;
}

interface Client {
  id: string;
  name: string;
}

interface Order {
  id: string;
  clientId: string;
  client: Client;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface SalesClientProps {
  orders: Order[];
  clients: Client[];
  finishedGoods: FinishedGood[];
}

export const SalesClient = ({ orders }: SalesClientProps) => {
  const { formatCurrency } = useApp();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'paid': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'fulfilled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'paid': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-700">Recent Orders</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Export CSV
          </button>
          <button className="px-5 py-2 bg-emerald-700 text-white rounded-full text-sm font-medium shadow-sm hover:bg-emerald-800 transition-colors">
            New Order (POS)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Items Summary</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-stone-50/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-mono text-stone-600">{order.id}</td>
                <td className="px-6 py-4 text-slate-700">{format(new Date(order.date), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{order.client.name}</td>
                <td className="px-6 py-4 text-stone-500">
                  {order.items.length} item(s) - {order.items[0]?.finishedGood?.scent || 'Unknown'} {order.items.length > 1 ? '...' : ''}
                </td>
                <td className="px-6 py-4 font-mono font-medium text-slate-800">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: order.id, name: `Order #${order.id}` })}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-stone-400">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This item will be moved to trash and can be restored later."
        critical={true}
        onConfirm={(password) => softDeleteAction('Order', deleteTarget!.id, password)}
      />
    </div>
  );
};
