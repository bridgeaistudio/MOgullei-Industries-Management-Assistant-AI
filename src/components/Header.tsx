'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const Header = ({ title }: { title: string }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-light text-slate-600">{title}</h2>
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
            <WifiOff className="w-3.5 h-3.5" /> Offline Mode (Cached)
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button className="px-5 py-2 border border-emerald-700 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors">
          Generate Label
        </button>
        <button className="px-5 py-2 bg-emerald-700 text-white rounded-full text-sm font-medium shadow-sm shadow-emerald-200 hover:bg-emerald-800 transition-colors">
          New Soap Batch
        </button>
      </div>
    </header>
  );
};
