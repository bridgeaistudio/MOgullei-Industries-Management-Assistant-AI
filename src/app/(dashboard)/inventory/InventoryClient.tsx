'use client';

import React, { useState } from 'react';
import { PackageOpen, AlertTriangle, Truck, Star, Sparkles, TrendingUp, CalendarDays, LineChart, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';

interface RawMaterial {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  lowStockThreshold: number;
}

interface FinishedGood {
  id: string;
  sku: string;
  scent: string;
  size: string;
  priceRetail: number;
  onHandCount: number;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  materialsProvided: string[];
  performanceScore: number;
  averageDeliveryDays: number;
}

interface InventoryClientProps {
  rawMaterials: RawMaterial[];
  finishedGoods: FinishedGood[];
  suppliers: Supplier[];
}

export const InventoryClient = ({ rawMaterials, finishedGoods, suppliers }: InventoryClientProps) => {
  const { formatCurrency } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasting'>('overview');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Generate 90-day forecast mock data
  const forecastData = Array.from({ length: 12 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (i * 7));

    const seasonalMultiplier = (i >= 8 && i <= 10) ? 1.8 : 1.0 + (Math.random() * 0.2);

    return {
      week: `Week ${i + 1}`,
      date: weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      sheaButterCost: Math.floor(450000 * seasonalMultiplier),
      essentialOilsCost: Math.floor(280000 * seasonalMultiplier),
      packagingCost: Math.floor(150000 * seasonalMultiplier),
      totalPredictedCost: Math.floor((450000 + 280000 + 150000) * seasonalMultiplier)
    };
  });

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex bg-stone-100 p-1 rounded-full w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-stone-500 hover:text-slate-700'}`}
          >
            Inventory Overview
          </button>
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'forecasting' ? 'bg-indigo-600 text-white shadow-sm' : 'text-stone-500 hover:text-indigo-600'}`}
          >
            <TrendingUp className="w-4 h-4" /> AI Forecasting
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Inventory Replenishment AI */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Inventory Replenishment AI
          </h3>
        </div>
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-48 h-48 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm mb-6 max-w-2xl">
              Our AI analyzes historical sales velocity, current production schedules, and supplier lead times to suggest optimal reorder quantities, minimizing stockouts and warehouse holding costs.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {rawMaterials.filter(rm => rm.quantity <= rm.lowStockThreshold).map(rm => (
                <div key={rm.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-slate-200">{rm.name}</h4>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Critical</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Current Stock:</span>
                      <span className="font-mono text-slate-300">{rm.quantity} {rm.unit}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>7-Day Velocity:</span>
                      <span className="font-mono text-slate-300">~{Math.floor(rm.lowStockThreshold * 0.8)} {rm.unit}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Supplier Lead Time:</span>
                      <span className="font-mono text-slate-300">4 Days</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-2">AI Suggested Reorder</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-mono text-white">{rm.lowStockThreshold * 3} {rm.unit}</span>
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        Draft PO
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Raw Materials Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700">Raw Materials</h3>
          <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Add Material
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 font-medium">Material</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Cost/Unit</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rawMaterials.map((rm) => (
                <tr key={rm.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{rm.name}</td>
                  <td className="px-6 py-4 capitalize text-stone-500">{rm.category}</td>
                  <td className="px-6 py-4 font-mono text-stone-600">{rm.quantity} {rm.unit}</td>
                  <td className="px-6 py-4 font-mono text-stone-600">{formatCurrency(rm.costPerUnit)}/{rm.unit}</td>
                  <td className="px-6 py-4">
                    {rm.quantity <= rm.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Optimal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setDeleteTarget({ id: rm.id, name: rm.name })}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suppliers Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-500" /> Suppliers & Performance
          </h3>
          <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Add Supplier
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers?.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${supplier.performanceScore >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : supplier.performanceScore >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  <Star className="w-3.5 h-3.5 fill-current" /> {supplier.performanceScore} / 100
                </div>
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">{supplier.name}</h4>
              <p className="text-sm text-stone-500 mb-4">{supplier.contactPerson} - {supplier.phone}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-stone-400 uppercase mb-2">Materials Provided</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.materialsProvided.map((mat, idx) => (
                    <span key={idx} className="px-2 py-1 bg-stone-50 border border-stone-200 text-stone-600 rounded text-xs">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Avg. Delivery Time: <span className="font-bold text-slate-700">{supplier.averageDeliveryDays} Days</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Finished Goods Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700">Finished Goods (SKUs)</h3>
          <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Add SKU
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finishedGoods.map((fg) => (
            <div key={fg.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 mb-2">
                  <PackageOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-500">{fg.sku}</span>
              </div>
              <h4 className="font-medium text-slate-800">{fg.scent}</h4>
              <p className="text-xs text-stone-500 mb-4">{fg.size}</p>

              <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400">On Hand</p>
                  <p className="font-mono text-lg text-slate-700">{fg.onHandCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-stone-400">Retail</p>
                  <p className="font-mono text-sm text-slate-700">{formatCurrency(fg.priceRetail)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
      )}

      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-indigo-600" /> 90-Day Raw Material Cost Forecast
              </h3>
              <p className="text-sm text-stone-500 mt-1">AI predictions based on historical sales velocity and upcoming seasonal trends.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span> Shea Butter
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-400"></span> Essential Oils
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span> Packaging
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorShea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOils" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPackaging" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `UGX${value / 1000}k`}
                  dx={-10}
                />
                <RechartsTooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label, payload) => `${label} (${payload[0]?.payload?.date})`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="sheaButterCost" name="Shea Butter" stroke="#34d399" fillOpacity={1} fill="url(#colorShea)" strokeWidth={2} />
                <Area type="monotone" dataKey="essentialOilsCost" name="Essential Oils" stroke="#818cf8" fillOpacity={1} fill="url(#colorOils)" strokeWidth={2} />
                <Area type="monotone" dataKey="packagingCost" name="Packaging" stroke="#fbbf24" fillOpacity={1} fill="url(#colorPackaging)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><CalendarDays className="w-5 h-5"/></div>
                <h4 className="font-bold text-indigo-900">Total 90-Day Forecast</h4>
              </div>
              <p className="text-3xl font-mono text-indigo-700 mt-4">
                {formatCurrency(forecastData.reduce((acc, curr) => acc + curr.totalPredictedCost, 0))}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
                <h4 className="font-bold text-emerald-900">Holiday Demand Surge</h4>
              </div>
              <p className="text-sm text-emerald-700 mt-4 leading-relaxed">
                Expect an 80% increase in material requirements between Week 8 and Week 10 to meet end-of-year seasonal demand.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle className="w-5 h-5"/></div>
                <h4 className="font-bold text-amber-900">Recommended Action</h4>
              </div>
              <p className="text-sm text-amber-700 mt-4 leading-relaxed">
                Secure advanced bulk orders for Shea Butter and premium packaging to avoid stockouts during the holiday surge.
              </p>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This item will be moved to trash and can be restored later."
        critical={false}
        onConfirm={(password) => softDeleteAction('RawMaterial', deleteTarget!.id, password)}
      />
    </div>
  );
};
