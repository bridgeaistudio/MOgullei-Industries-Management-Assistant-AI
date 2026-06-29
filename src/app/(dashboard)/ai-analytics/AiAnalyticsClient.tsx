'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, TrendingUp, AlertCircle, LineChart as LineChartIcon, PackageSearch, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const performanceData = [
  { month: 'Jan', forestProd: 400, forestSales: 380, lemonProd: 300, lemonSales: 280, liquidProd: 200, liquidSales: 190 },
  { month: 'Feb', forestProd: 450, forestSales: 410, lemonProd: 320, lemonSales: 300, liquidProd: 210, liquidSales: 200 },
  { month: 'Mar', forestProd: 420, forestSales: 400, lemonProd: 350, lemonSales: 330, liquidProd: 250, liquidSales: 240 },
  { month: 'Apr', forestProd: 480, forestSales: 460, lemonProd: 380, lemonSales: 360, liquidProd: 280, liquidSales: 270 },
  { month: 'May', forestProd: 500, forestSales: 480, lemonProd: 400, lemonSales: 390, liquidProd: 300, liquidSales: 290 },
  { month: 'Jun', forestProd: 520, forestSales: 510, lemonProd: 420, lemonSales: 410, liquidProd: 320, liquidSales: 310 },
];

export function AiAnalyticsClient() {
  const { formatCurrency } = useApp();

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI Business Insights
          </h3>
          <p className="text-sm text-stone-500">Actionable intelligence for your soap cottage industry.</p>
        </div>
        <button className="px-4 py-2 border border-emerald-700 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors">
          Refresh Insights
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Production vs Sales Graph Section */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 lg:col-span-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Production vs Sales Performance</h4>
              <p className="text-sm text-stone-500">Comparing manufacturing output vs actual sales across key product lines (units).</p>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="month" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />

                <Line type="monotone" dataKey="forestProd" name="Forest Soap (Produced)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="forestSales" name="Forest Soap (Sold)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />

                <Line type="monotone" dataKey="lemonProd" name="Lemon Soap (Produced)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lemonSales" name="Lemon Soap (Sold)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />

                <Line type="monotone" dataKey="liquidProd" name="Liquid Soap (Produced)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="liquidSales" name="Liquid Soap (Sold)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight 1: Demand Forecasting */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800">Demand Forecasting</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed z-10">
            <strong>Himalayan Lavender</strong> sales are trending up 24% this month, primarily driven by boutique hotel reorders.
          </p>
          <div className="mt-auto z-10 pt-4 border-t border-stone-50">
            <p className="text-xs text-stone-500 mb-2">AI Recommendation:</p>
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg p-3">
              <span className="text-sm font-medium text-emerald-800">Increase Batch Size</span>
              <span className="text-xs font-bold text-emerald-600">+50% (Batch #410)</span>
            </div>
          </div>
        </div>

        {/* Insight 2: Inventory Prediction */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PackageSearch className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <PackageSearch className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800">Supply Chain Alert</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed z-10">
            Current stock of <strong>Caustic Soda (Lye)</strong> is at 2kg. Based on current production velocity, you will run out in approximately <strong>4 days</strong>.
          </p>
          <div className="mt-auto z-10 pt-4 border-t border-stone-50">
            <p className="text-xs text-stone-500 mb-2">AI Recommendation:</p>
            <button className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white rounded-lg p-2.5 text-sm font-medium hover:bg-stone-900 transition-colors">
              Auto-Order from Supplier
            </button>
          </div>
        </div>

        {/* Insight 3: Batch Quality Analysis */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle className="w-24 h-24 text-red-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800">Quality Analysis</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed z-10">
            <strong>Batch #391</strong> has a 15% defect rate (color fading). This correlates with a new shipment of Activated Charcoal received on May 12th.
          </p>
          <div className="mt-auto z-10 pt-4 border-t border-stone-50">
            <p className="text-xs text-stone-500 mb-2">AI Recommendation:</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-red-800 bg-red-50 border border-red-100 rounded-lg p-2">Flag supplier material</span>
              <span className="text-sm font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-lg p-2">Recall unsold #391 units</span>
            </div>
          </div>
        </div>

        {/* Insight 4: Profit Margin Optimization */}
        <div className="bg-emerald-900 text-emerald-50 rounded-2xl shadow-lg shadow-emerald-100 p-6 flex flex-col relative overflow-hidden lg:col-span-3">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <LineChartIcon className="w-48 h-48" />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">Profitability Opportunity</h4>
              <p className="text-xs text-emerald-300">Based on recent market data and material costs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-emerald-800/50 rounded-xl p-5 border border-emerald-700/50">
              <h5 className="font-bold text-emerald-100 mb-2">Local Sourcing Alternative</h5>
              <p className="text-sm text-emerald-200/80 mb-4">
                Switching to locally sourced Shea Butter could reduce material costs by 18% without affecting SAP values.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                <ArrowDownRight className="w-4 h-4" /> Cost Impact: -{formatCurrency(1500)}/bar
              </div>
            </div>

            <div className="bg-emerald-800/50 rounded-xl p-5 border border-emerald-700/50">
              <h5 className="font-bold text-emerald-100 mb-2">Product Line Expansion</h5>
              <p className="text-sm text-emerald-200/80 mb-4">
                "Oatmeal & Honey" is currently trending in your region. You have 80% of required base ingredients in stock.
              </p>
              <button className="text-sm font-medium text-white underline decoration-emerald-500 hover:text-emerald-300 transition-colors">
                Generate Recipe &rarr;
              </button>
            </div>

            <div className="bg-emerald-800/50 rounded-xl p-5 border border-emerald-700/50">
              <h5 className="font-bold text-emerald-100 mb-2">Wholesale Pricing</h5>
              <p className="text-sm text-emerald-200/80 mb-4">
                Your wholesale margins for 'Nile Wellness Spa' are 5% below average. Consider adjusting the tier pricing on next contract renewal.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                <ArrowUpRight className="w-4 h-4" /> Revenue Impact: +{formatCurrency(450000)}/mo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
