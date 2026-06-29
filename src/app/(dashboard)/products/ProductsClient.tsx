'use client';

import React from 'react';
import { PackageOpen, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '@/context/AppContext';

interface FinishedGood {
  id: string;
  sku: string;
  scent: string;
  size: string;
  priceRetail: number;
  priceWholesale: number;
  onHandCount: number;
}

interface ProductsClientProps {
  finishedGoods: FinishedGood[];
}

export const ProductsClient = ({ finishedGoods }: ProductsClientProps) => {
  const { formatCurrency } = useApp();

  const productPerformance = finishedGoods.map(fg => ({
    name: fg.scent,
    cost: fg.priceWholesale,
    retail: fg.priceRetail,
    margin: fg.priceRetail - fg.priceWholesale
  }));

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-indigo-600" />
            Business Products
          </h3>
          <p className="text-sm text-stone-500 mt-1">Manage your product lines, track sales performance and costs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h4 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Product Performance (Cost vs Retail)
          </h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `UGX${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="cost" name="Wholesale Cost" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="retail" name="Retail Price" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
             <h4 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-4">
               <DollarSign className="w-5 h-5 text-indigo-500" /> High Margin Products
             </h4>
             <div className="space-y-4">
               {productPerformance.sort((a, b) => b.margin - a.margin).slice(0, 3).map((prod, idx) => (
                 <div key={idx} className="flex justify-between items-center border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700">{prod.name}</p>
                      <p className="text-xs text-stone-500">Margin: {formatCurrency(prod.margin)}/unit</p>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                      Top
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finishedGoods.map((fg) => (
          <div key={fg.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 mb-2">
                <PackageOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-500">{fg.sku}</span>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{fg.scent}</h4>
            <p className="text-xs text-stone-500 mb-4">{fg.size}</p>

            <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400">Wholesale</p>
                <p className="font-mono text-lg text-slate-700">{formatCurrency(fg.priceWholesale)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-stone-400">Retail</p>
                <p className="font-mono text-lg text-slate-700 text-emerald-600">{formatCurrency(fg.priceRetail)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
