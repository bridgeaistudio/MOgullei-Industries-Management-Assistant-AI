'use client';

import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, CheckCircle2, Clock, Navigation } from 'lucide-react';

interface Delivery {
  id: string;
  orderId: string;
  status: string;
  date: string;
  address: string;
  notes: string | null;
}

interface LogisticsClientProps {
  deliveries: Delivery[];
}

export const LogisticsClient = ({ deliveries }: LogisticsClientProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500';
      case 'out': return 'bg-blue-500';
      case 'scheduled': return 'bg-amber-400';
      case 'failed': return 'bg-red-500';
      default: return 'bg-stone-300';
    }
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-700">Delivery Board</h3>
        <button className="px-5 py-2 bg-stone-800 text-white rounded-full text-sm font-medium shadow-sm hover:bg-stone-900 transition-colors">
          Assign Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map(delivery => (
          <div key={delivery.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col">
            <div className={`h-2 w-full ${getStatusColor(delivery.status)}`} />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                    Order {delivery.orderId}
                  </p>
                  <span className="inline-flex items-center capitalize text-sm font-medium text-slate-700">
                    {delivery.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  {delivery.status === 'delivered' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                   delivery.status === 'out' ? <Navigation className="w-4 h-4 text-blue-500" /> :
                   <Clock className="w-4 h-4 text-amber-500" />}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-stone-600">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="leading-snug">{delivery.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{format(new Date(delivery.date), 'MMM d, yyyy - h:mm a')}</span>
                </div>
              </div>

              {delivery.notes && (
                <div className="mt-auto p-3 bg-stone-50 rounded-lg text-xs text-stone-600 italic border border-stone-100">
                  Notes: {delivery.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
