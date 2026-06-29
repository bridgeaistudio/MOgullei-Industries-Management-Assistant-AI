'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { addExpenseAction } from '@/actions/expenses';
import { updateBudgetAction } from '@/actions/settings';
import { Landmark, TrendingUp, TrendingDown, Plus, Receipt, Filter, Calculator, Download, Activity, ScanLine, Wallet } from 'lucide-react';
import { format } from 'date-fns';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  reference?: string | null;
}

interface Order {
  id: string;
  total: number;
}

interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
}

interface AccountingClientProps {
  expenses: Expense[];
  orders: Order[];
  budgets: Budget[];
}

export function AccountingClient({ expenses, orders, budgets }: AccountingClientProps) {
  const { formatCurrency } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'other',
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  const netProfit = totalRevenue - totalExpenses;

  const vatEstimate = totalRevenue * 0.18;
  const corporateTaxEstimate = netProfit > 0 ? netProfit * 0.30 : 0;

  const projectedRevenue = totalRevenue * 0.2;
  const projectedExpenses = totalExpenses * 0.2;
  const projectedLiquidity = netProfit + projectedRevenue - projectedExpenses;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('amount', expenseForm.amount);
    fd.append('category', expenseForm.category);
    fd.append('description', expenseForm.description);
    fd.append('reference', expenseForm.reference);
    fd.append('date', expenseForm.date);
    await addExpenseAction(fd);
    setShowAddExpense(false);
    setExpenseForm({ amount: '', category: 'other', description: '', reference: '', date: new Date().toISOString().split('T')[0] });
  };

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getExpenseByCategory = (category: string) => {
    return expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            Accounting & Finance
          </h3>
          <p className="text-sm text-stone-500 mt-1">Manage your expenses, budget, and tax estimates.</p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="bg-emerald-900 rounded-2xl border border-emerald-800 shadow-lg p-6 text-emerald-50">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-emerald-200 uppercase tracking-wider mb-1">Net Profit</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Planner */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h4 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-indigo-600" /> Budget Planner
            </h4>
            <div className="space-y-6">
              {budgets.map(budget => {
                const spent = getExpenseByCategory(budget.category);
                const progress = Math.min((spent / budget.monthlyLimit) * 100, 100);
                const isOver = spent > budget.monthlyLimit;
                const isNear = progress > 90 && !isOver;

                return (
                  <div key={budget.id}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="font-medium text-slate-800">{getCategoryLabel(budget.category)}</p>
                        <p className="text-xs text-stone-500">{formatCurrency(spent)} / {formatCurrency(budget.monthlyLimit)}</p>
                      </div>
                      {isOver && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">OVER BUDGET</span>}
                      {isNear && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">NEAR LIMIT</span>}
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-indigo-500'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h4 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-stone-400" /> Recent Expenses
              </h4>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-white transition-colors">
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.slice(0, 5).map(expense => (
                  <tr key={expense.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 text-stone-600">
                      {format(new Date(expense.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-medium border border-stone-200">
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-800 font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Quick Expense Scanner UI */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ScanLine className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-4">
                <ScanLine className="w-5 h-5 text-emerald-600" /> Quick Expense Scanner
              </h4>
              <p className="text-sm text-stone-500 mb-6">Log receipts quickly with UGX amount.</p>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Amount (UGX)"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Vendor / Description"
                    value={expenseForm.description}
                    onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <select
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  >
                    <option value="raw_materials">Raw Materials</option>
                    <option value="packaging">Packaging</option>
                    <option value="utilities">Utilities</option>
                    <option value="salaries">Salaries</option>
                    <option value="marketing">Marketing</option>
                    <option value="logistics">Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Log Expense
                </button>
              </form>
            </div>
          </div>

          {/* Tax Compliance Assistant */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 text-slate-50">
            <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-indigo-400" /> Tax Compliance
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Estimated VAT (18%)</span>
                <span className="font-mono">{formatCurrency(vatEstimate)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Corporate Tax (30%)</span>
                <span className="font-mono">{formatCurrency(corporateTaxEstimate)}</span>
              </div>
            </div>
            <button className="w-full py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Tax Summary
            </button>
          </div>

          {/* Cash Flow Projection */}
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm p-6">
            <h4 className="text-lg font-medium text-indigo-900 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-600" /> Cash Flow (30 Days)
            </h4>
            <p className="text-sm text-indigo-700/70 mb-4">Projected liquidity based on historical sales velocity and upcoming expense obligations.</p>
            <div className="text-3xl font-bold text-indigo-900 mb-2">
              {formatCurrency(projectedLiquidity)}
            </div>
            <div className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded inline-block">
              Healthy Liquidity Expected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
