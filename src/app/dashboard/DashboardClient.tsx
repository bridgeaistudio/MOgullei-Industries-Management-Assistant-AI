'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Pin, Plus, CheckCircle2, Circle, Bell, AlertTriangle, PackageOpen, Truck, CalendarDays, User as UserIcon, Droplets, Thermometer, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { addTaskAction, toggleTaskAction } from '@/actions/tasks';

interface Task {
  id: string;
  title: string;
  description: string;
  author: { name: string };
  status: string;
  createdAt: string;
}

interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
}

interface Batch {
  id: string;
  status: string;
}

interface Delivery {
  id: string;
  status: string;
}

interface DashboardClientProps {
  tasks: Task[];
  rawMaterials: RawMaterial[];
  batches: Batch[];
  deliveries: Delivery[];
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number | string; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const numVal = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value;
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    setHasAnimated(true);
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * numVal));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [numVal, hasAnimated]);

  return <span ref={ref}>{prefix}{displayed.toLocaleString()}{suffix}</span>;
}

function GradientProgress({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="relative w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className={`h-full rounded-full ${color}`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className={`absolute top-0 h-full rounded-full ${color} blur-sm`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export const DashboardClient = ({ tasks, rawMaterials, batches, deliveries }: DashboardClientProps) => {
  const { formatCurrency } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTaskAction(newTaskTitle, '');
    setNewTaskTitle('');
  };

  const lowStockMaterials = rawMaterials.filter(rm => rm.quantity <= rm.lowStockThreshold);
  const pendingDeliveries = deliveries.filter(d => d.status === 'scheduled');
  const activeBatches = batches.filter(b => b.status === 'curing');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const metricCards = [
    {
      label: 'Monthly Sales',
      value: formatCurrency(8420000),
      change: '+12%',
      changeLabel: 'from last month',
      positive: true,
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-100/60',
      accent: 'text-emerald-600',
      icon: <ArrowUpRight className="w-4 h-4" />,
    },
    {
      label: 'Active Deliveries',
      value: pendingDeliveries.length.toString(),
      change: null,
      changeLabel: `${pendingDeliveries.length} arriving soon`,
      positive: true,
      gradient: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-100/60',
      accent: 'text-blue-600',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      label: 'Raw Ingredients',
      value: lowStockMaterials.length > 0 ? 'Low Stock' : 'Optimal',
      change: null,
      changeLabel: `${lowStockMaterials.length} below threshold`,
      positive: lowStockMaterials.length === 0,
      gradient: lowStockMaterials.length > 0 ? 'from-amber-500/10 to-amber-600/5' : 'from-emerald-500/10 to-emerald-600/5',
      border: lowStockMaterials.length > 0 ? 'border-amber-100/60' : 'border-emerald-100/60',
      accent: lowStockMaterials.length > 0 ? 'text-amber-600' : 'text-emerald-600',
      icon: lowStockMaterials.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <PackageOpen className="w-4 h-4" />,
    },
    {
      label: 'Finished Goods',
      value: '1,250',
      change: null,
      changeLabel: 'Units ready for retail',
      positive: true,
      gradient: 'from-violet-500/10 to-violet-600/5',
      border: 'border-violet-100/60',
      accent: 'text-violet-600',
      icon: <PackageOpen className="w-4 h-4" />,
    },
  ];

  const shiftData = [
    { role: 'Production Line A', person: 'Achieng Grace', task: 'Mixing & Curing', color: 'emerald' },
    { role: 'Quality Assurance', person: 'Mugisha Brian', task: 'Batch Inspections', color: 'blue' },
    { role: 'Central Deliveries', person: 'Okello John', task: 'Route Kampala', color: 'amber' },
    { role: 'Sales & CRM', person: 'Nakintu Betty', task: 'Wholesale Outreach', color: 'violet' },
  ];

  const colorMap: Record<string, { bg: string; text: string; badge: string; border: string; avatar: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-100', avatar: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100', avatar: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-100', avatar: 'bg-gradient-to-br from-amber-400 to-amber-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-100', avatar: 'bg-gradient-to-br from-violet-400 to-violet-600' },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-5 w-full"
    >
      {/* Key Metrics Row */}
      <div className="col-span-1 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition-shadow duration-300 group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg ${card.accent} bg-current/10 flex items-center justify-center opacity-60`}>
                  {card.icon}
                </div>
              </div>
              <p className={`text-3xl font-semibold tracking-tight ${card.value === 'Low Stock' ? 'text-amber-600' : 'text-slate-900'}`}>
                {card.value}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                {card.change && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${card.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {card.change}
                  </span>
                )}
                <span className={`text-xs ${card.positive ? 'text-stone-400' : 'text-amber-500'}`}>{card.changeLabel}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Shift Planner - Timeline Style */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-stone-100/60 rounded-2xl p-6 shadow-sm lg:col-span-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-900/20">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Weekly Shift Planner</h3>
                  <p className="text-[10px] text-stone-400">Current assignments</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Manage Schedule
              </motion.button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shiftData.map((shift, idx) => {
                const colors = colorMap[shift.color];
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className={`bg-white rounded-xl p-4 border ${colors.border} hover:shadow-md transition-all duration-200`}
                  >
                    <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wide mb-3">{shift.role}</p>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-full ${colors.avatar} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {shift.person.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-xs font-medium text-slate-700">{shift.person}</p>
                    </div>
                    <span className={`text-[10px] ${colors.badge} px-2.5 py-1 rounded-full inline-block font-medium`}>
                      {shift.task}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Curing Station Monitor */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-stone-100/60 shadow-sm p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-transparent" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
                  <PackageOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Active Curing Racks</h3>
                  <p className="text-[10px] text-stone-400">{activeBatches.length} batches curing</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-2.5">
                  <span className="font-medium text-slate-700">Batch #402: Himalayan Lavender</span>
                  <span className="text-emerald-600 font-semibold">92% &middot; 2 Days Left</span>
                </div>
                <GradientProgress percent={92} color="bg-gradient-to-r from-emerald-400 to-emerald-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2.5">
                  <span className="font-medium text-slate-700">Batch #405: Charcoal & Tea Tree</span>
                  <span className="text-stone-500 font-semibold">45% &middot; 16 Days Left</span>
                </div>
                <GradientProgress percent={45} color="bg-gradient-to-r from-stone-300 to-stone-500" />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-100/60 grid grid-cols-2 gap-3">
              <div className="bg-stone-50/80 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400">Humidity</p>
                  <p className="text-lg font-semibold text-slate-800">45% <span className="text-[10px] font-medium text-emerald-500">Optimal</span></p>
                </div>
              </div>
              <div className="bg-stone-50/80 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400">Temperature</p>
                  <p className="text-lg font-semibold text-slate-800">22°C <span className="text-[10px] font-medium text-emerald-500">Stable</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Staff Daily Task Board */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-stone-100/60 rounded-2xl p-6 shadow-sm flex flex-col h-[420px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-900/20">
                <Pin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Staff Daily Tasks</h3>
                <p className="text-[10px] text-stone-400">Pinned by Management</p>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 mt-4 scrollbar-thin">
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleTaskAction(task.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex gap-3 items-start group/task ${
                    task.status === 'completed'
                      ? 'bg-stone-50/50 border-stone-100 opacity-60'
                      : 'bg-white border-stone-200/60 shadow-sm hover:shadow-md hover:border-amber-200'
                  }`}
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className={`mt-0.5 shrink-0 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-stone-300 group-hover/task:text-amber-400'}`}
                  >
                    {task.status === 'completed' ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-stone-500 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <p className="text-[10px] text-amber-500 mt-1.5 font-medium">@ {task.author.name}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: task.id, name: task.title }); }}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white/80 backdrop-blur-sm transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-md shadow-amber-900/20 hover:shadow-lg transition-shadow"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Notifications Panel */}
      <motion.div
        variants={itemVariants}
        className="col-span-1 relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-stone-100/60 shadow-sm p-6 flex flex-col h-full max-h-[800px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-transparent" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-900/20 relative">
              <Bell className="w-4 h-4" />
              {(lowStockMaterials.length > 0 || pendingDeliveries.length > 0) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <p className="text-[10px] text-stone-400">Recent alerts</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-thin">
            {lowStockMaterials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-100/60 rounded-xl flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Low Stock Alert</p>
                  <p className="text-xs text-red-600/80 mt-1 leading-relaxed">
                    {lowStockMaterials.map(m => m.name).join(', ')} below threshold.
                  </p>
                </div>
              </motion.div>
            )}

            {pendingDeliveries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100/60 rounded-xl flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Pending Deliveries</p>
                  <p className="text-xs text-blue-600/80 mt-1 leading-relaxed">
                    {pendingDeliveries.length} orders scheduled for delivery.
                  </p>
                </div>
              </motion.div>
            )}

            {activeBatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-100/60 rounded-xl flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <PackageOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Active Curing</p>
                  <p className="text-xs text-emerald-600/80 mt-1 leading-relaxed">
                    {activeBatches.length} batches currently in curing process.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="p-4 bg-gradient-to-r from-stone-50 to-stone-50/50 border border-stone-100/60 rounded-xl flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">System Update</p>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Tax brackets updated for Q3 2026.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This item will be moved to trash and can be restored later."
        critical={false}
        onConfirm={(password) => softDeleteAction('Task', deleteTarget!.id, password)}
      />
    </motion.div>
  );
};
