'use client';

import React, { useState } from 'react';
import { Beaker, Droplets, Clock, AlertTriangle, CheckCircle2, PackageMinus, ShoppingBag, XOctagon, ClipboardCheck, Plus, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useApp } from '@/context/AppContext';
import { addQualityLogAction } from '@/actions/quality';
import { addWasteLogAction } from '@/actions/waste';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';

interface QualityLog {
  id: string;
  date: string;
  author: string;
  scentStrength: string;
  texture: string;
  color: string;
  notes: string;
}

interface Batch {
  id: string;
  recipeId: string;
  startDate: string;
  cureEndDate: string;
  status: string;
  actualYield: number;
  soldCount: number;
  defectCount: number;
  notes: string | null;
  qualityLogs: QualityLog[];
}

interface RecipeIngredient {
  id: string;
  rawMaterial: { name: string };
  amount: number;
}

interface Recipe {
  id: string;
  name: string;
  expectedYield: number;
  notes: string;
  ingredients: RecipeIngredient[];
}

interface WasteLog {
  id: string;
  batchId: string;
  date: string;
  quantity: number;
  reason: string;
  notes: string;
  financialImpact: number;
}

interface ProductionClientProps {
  recipes: Recipe[];
  batches: Batch[];
  wasteLogs: WasteLog[];
}

export const ProductionClient = ({ recipes, batches, wasteLogs }: ProductionClientProps) => {
  const { formatCurrency } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [wasteForm, setWasteForm] = useState({
    batchId: '',
    quantity: 0,
    reason: 'failed_saponification' as string,
    notes: '',
    financialImpact: 0
  });

  const [logForm, setLogForm] = useState({
    scentStrength: 'Moderate' as string,
    texture: '',
    color: '',
    notes: ''
  });

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'curing': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" />, label: 'Curing' };
      case 'ready': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Ready for Sale' };
      case 'depleted': return { color: 'bg-stone-100 text-stone-600 border-stone-200', icon: <PackageMinus className="w-3 h-3" />, label: 'Depleted' };
      case 'flagged': return { color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle className="w-3 h-3" />, label: 'Flagged / Issue' };
      default: return { color: 'bg-stone-50 text-stone-700 border-stone-200', icon: null, label: status };
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    await addQualityLogAction(selectedBatchId, {
      scentStrength: logForm.scentStrength,
      texture: logForm.texture,
      color: logForm.color,
      notes: logForm.notes,
      author: 'Staff',
    });

    setSelectedBatchId(null);
    setLogForm({ scentStrength: 'Moderate', texture: '', color: '', notes: '' });
  };

  const handleAddWasteLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWasteLogAction({
      batchId: wasteForm.batchId,
      quantity: wasteForm.quantity,
      reason: wasteForm.reason,
      notes: wasteForm.notes,
      financialImpact: wasteForm.financialImpact,
    });
    setShowWasteModal(false);
    setWasteForm({ batchId: '', quantity: 0, reason: 'failed_saponification', notes: '', financialImpact: 0 });
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      failed_saponification: 'Failed Saponification',
      color_bleeding: 'Color Bleeding',
      scent_loss: 'Scent Loss',
      contamination: 'Contamination',
      other: 'Other'
    };
    return labels[reason] || reason;
  };

  return (
    <div className="p-8 space-y-8 w-full">
      {/* Batch Tracker */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700">Batch Tracker</h3>
          <button className="px-5 py-2 bg-emerald-700 text-white rounded-full text-sm font-medium shadow-sm hover:bg-emerald-800 transition-colors">
            Start New Batch
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {batches.map(batch => {
            const recipe = recipes.find(r => r.id === batch.recipeId);
            const daysLeft = differenceInDays(new Date(batch.cureEndDate), new Date());
            const totalCureDays = differenceInDays(new Date(batch.cureEndDate), new Date(batch.startDate));
            const progress = Math.max(0, Math.min(100, ((totalCureDays - Math.max(0, daysLeft)) / totalCureDays) * 100));
            const statusDisplay = getStatusDisplay(batch.status);

            return (
              <div key={batch.id} className={`bg-white rounded-2xl border ${batch.status === 'flagged' ? 'border-red-300 shadow-sm shadow-red-100' : 'border-stone-100 shadow-sm'} p-6 flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-500 mb-2 inline-block">Batch #{batch.id}</span>
                    <h4 className="font-medium text-slate-800">{recipe?.name || 'Unknown Recipe'}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget({ id: batch.id, name: `Batch #${batch.id}` })}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}>
                      {statusDisplay.icon}
                      {statusDisplay.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-4 flex-1">
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span>Started: {format(new Date(batch.startDate), 'MMM d, yyyy')}</span>
                  </div>

                  {batch.status === 'curing' && (
                    <div className="relative pt-2">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium text-stone-500">Curing Progress</span>
                        <span className={daysLeft <= 7 ? "text-emerald-700 font-bold" : "text-stone-600 font-bold"}>
                          {Math.round(progress)}% - {daysLeft > 0 ? `${daysLeft} Days Left` : 'Ready'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {batch.notes && batch.status === 'flagged' && (
                    <div className="p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100">
                      <strong>Issue:</strong> {batch.notes}
                    </div>
                  )}

                  {/* Quality Logs Section */}
                  <div className="pt-4 border-t border-stone-50">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                        <ClipboardCheck className="w-3.5 h-3.5" /> Quality Logs
                      </h5>
                      {batch.status === 'curing' && (
                        <button
                          onClick={() => setSelectedBatchId(batch.id)}
                          className="text-xs text-emerald-700 font-medium hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Log
                        </button>
                      )}
                    </div>
                    {batch.qualityLogs && batch.qualityLogs.length > 0 ? (
                      <div className="space-y-3">
                        {batch.qualityLogs.map(log => (
                          <div key={log.id} className="bg-stone-50 rounded-lg p-3 text-sm border border-stone-100">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-slate-700">{log.author}</span>
                              <span className="text-stone-400">{format(new Date(log.date), 'MMM d')}</span>
                            </div>
                            <div className="flex gap-2 text-xs mb-2">
                              <span className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-stone-600">Scent: {log.scentStrength}</span>
                              <span className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-stone-600">Color: {log.color}</span>
                            </div>
                            <p className="text-stone-600 text-xs italic">&quot;{log.notes}&quot;</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">No quality logs recorded yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-stone-50 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-400">Total Yield</p>
                    <p className="font-mono text-lg text-slate-700">{batch.actualYield}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1"><ShoppingBag className="w-3 h-3"/> Sold</p>
                    <p className="font-mono text-lg text-slate-700">{batch.soldCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1"><XOctagon className="w-3 h-3"/> Defects</p>
                    <p className={`font-mono text-lg ${batch.defectCount > 0 ? 'text-red-600' : 'text-slate-700'}`}>{batch.defectCount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recipes Library */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-slate-700">Recipe Library</h3>
          <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors">
            Create Recipe
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-600 mb-4">
                <Beaker className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-slate-800 text-lg mb-1">{recipe.name}</h4>
              <p className="text-sm text-stone-500 mb-4 flex-1 line-clamp-2">{recipe.notes}</p>

              <div className="pt-4 border-t border-stone-50 flex justify-between text-sm">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Droplets className="w-4 h-4 text-stone-400" />
                  <span>{recipe.ingredients.length} Ingredients</span>
                </div>
                <div className="font-mono text-stone-500">
                  Yield: {recipe.expectedYield} bars
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Batch Waste Log */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Batch Waste Log
            </h3>
            <p className="text-sm text-stone-500">Track spoilage, failed batches, and financial impact.</p>
          </div>
          <button
            onClick={() => setShowWasteModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-medium shadow-sm hover:bg-red-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Log Waste
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {wasteLogs && wasteLogs.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Batch / Quantity</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Notes</th>
                  <th className="px-6 py-4 font-medium text-right">Financial Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {wasteLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-stone-600">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">Batch {log.batchId}</div>
                      <div className="text-xs text-stone-500">{log.quantity} units</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                        {getReasonLabel(log.reason)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-600 italic text-xs max-w-xs truncate">
                      {log.notes}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-red-600 font-medium">
                      {formatCurrency(log.financialImpact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-stone-500 text-sm italic">
              No waste records found.
            </div>
          )}
        </div>
      </section>

      {/* Quality Log Modal */}
      {selectedBatchId && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                <h3 className="text-lg font-medium text-slate-800">Record Sensory Log</h3>
                <p className="text-xs text-stone-500 mt-1">Batch #{selectedBatchId}</p>
              </div>
              <button onClick={() => setSelectedBatchId(null)} className="text-stone-400 hover:text-slate-700">
                <XOctagon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Scent Strength</label>
                  <select
                    value={logForm.scentStrength}
                    onChange={e => setLogForm({...logForm, scentStrength: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  >
                    <option value="Weak">Weak</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Strong">Strong</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Observed Color</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fading purple"
                    value={logForm.color}
                    onChange={e => setLogForm({...logForm, color: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Texture / Firmness</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hardening nicely, edges still soft"
                    value={logForm.texture}
                    onChange={e => setLogForm({...logForm, texture: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any other sensory notes or observations..."
                    value={logForm.notes}
                    onChange={e => setLogForm({...logForm, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-stone-100 mt-6">
                <button type="button" onClick={() => setSelectedBatchId(null)} className="px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" /> Save Quality Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Waste Log Modal */}
      {showWasteModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-red-100 flex justify-between items-center bg-red-50">
              <div>
                <h3 className="text-lg font-medium text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Log Production Waste
                </h3>
              </div>
              <button onClick={() => setShowWasteModal(false)} className="text-red-400 hover:text-red-700">
                <XOctagon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWasteLog} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Select Batch</label>
                  <select
                    required
                    value={wasteForm.batchId}
                    onChange={e => setWasteForm({...wasteForm, batchId: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none"
                  >
                    <option value="" disabled>Select a batch...</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Quantity Lost (Units)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={wasteForm.quantity || ''}
                    onChange={e => setWasteForm({...wasteForm, quantity: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Primary Reason</label>
                  <select
                    value={wasteForm.reason}
                    onChange={e => setWasteForm({...wasteForm, reason: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none"
                  >
                    <option value="failed_saponification">Failed Saponification</option>
                    <option value="color_bleeding">Color Bleeding</option>
                    <option value="scent_loss">Scent Loss</option>
                    <option value="contamination">Contamination</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Financial Impact (UGX)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={wasteForm.financialImpact || ''}
                    onChange={e => setWasteForm({...wasteForm, financialImpact: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Detailed Notes</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what went wrong..."
                    value={wasteForm.notes}
                    onChange={e => setWasteForm({...wasteForm, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-stone-100 mt-6">
                <button type="button" onClick={() => setShowWasteModal(false)} className="px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Log Waste Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name}?`}
        description="This item will be moved to trash and can be restored later."
        critical={true}
        onConfirm={(password) => softDeleteAction('Batch', deleteTarget!.id, password)}
      />
    </div>
  );
};
