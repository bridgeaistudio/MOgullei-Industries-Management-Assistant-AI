'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Beaker, ShoppingCart, Users, Truck, Sparkles, LineChart, FileSearch, Settings, UserCog, Landmark, ShieldAlert, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { logoutAction } from '@/actions/auth';

export const Sidebar = () => {
  const { currentUser } = useApp();

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 h-full overflow-hidden">
      <div className="p-6 overflow-y-auto flex-1 min-h-0">
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-serif italic text-xl">M</div>
          <div>
            <h1 className="font-medium tracking-tight text-lg">MOgullei Industries</h1>
            <p className="text-[10px] italic text-emerald-600 font-medium">AI Powered</p>
          </div>
        </div>
        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem to="/dashboard/products" icon={<Package className="w-5 h-5" />} label="Business Products" />
          <NavItem to="/dashboard/inventory" icon={<Package className="w-5 h-5" />} label="Stock & Supplies" />
          <NavItem to="/dashboard/production" icon={<Beaker className="w-5 h-5" />} label="Production" />
          <NavItem to="/dashboard/sales" icon={<ShoppingCart className="w-5 h-5" />} label="Orders & Sales" />
          <NavItem to="/dashboard/crm" icon={<Users className="w-5 h-5" />} label="Client CRM" />
          <NavItem to="/dashboard/logistics" icon={<Truck className="w-5 h-5" />} label="Logistics Chain" />
          <NavItem to="/dashboard/traceability" icon={<FileSearch className="w-5 h-5" />} label="Batch Traceability" />
          <NavItem to="/dashboard/accounting" icon={<Landmark className="w-5 h-5" />} label="Accounting" />
          <NavItem to="/dashboard/audit-logs" icon={<ShieldAlert className="w-5 h-5" />} label="Audit Trail" />
          <div className="pt-4 mt-4 border-t border-stone-100">
            <p className="px-4 text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">AI & System</p>
            <NavItem to="/dashboard/ai-marketing" icon={<Sparkles className="w-5 h-5 text-indigo-500" />} label="AI Marketing" />
            <NavItem to="/dashboard/ai-analytics" icon={<LineChart className="w-5 h-5 text-indigo-500" />} label="AI Analytics" />
            <NavItem to="/dashboard/users" icon={<UserCog className="w-5 h-5 text-blue-500" />} label="Staff Management" />
            <NavItem to="/dashboard/settings" icon={<Settings className="w-5 h-5 text-stone-500" />} label="Settings" />
          </div>
        </nav>
      </div>
      <div className="mt-auto p-5 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {currentUser?.name?.charAt(0) || 'M'}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{currentUser?.name || 'Micheal Ogullei'}</p>
              <p className="text-stone-500 capitalize">{currentUser?.role?.replace('_', ' ') || 'CEO'}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-stone-100 text-emerald-800'
          : 'text-slate-500 hover:text-emerald-700 hover:bg-stone-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};
