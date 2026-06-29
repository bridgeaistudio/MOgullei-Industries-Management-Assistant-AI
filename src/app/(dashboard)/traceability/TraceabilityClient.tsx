'use client';

import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, Factory, PackageOpen, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface RawMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  supplier?: string | null;
}

interface RecipeIngredient {
  id: string;
  rawMaterialId: string;
  amount: number;
  rawMaterial: RawMaterial;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
}

interface Batch {
  id: string;
  recipeId: string;
  startDate: string;
  cureEndDate: string;
  status: string;
  actualYield: number;
  defectCount: number;
  recipe: Recipe;
}

interface TraceabilityClientProps {
  batches: Batch[];
}

export function TraceabilityClient({ batches }: TraceabilityClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const selectedRecipe = selectedBatch?.recipe;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      const formattedQuery = searchQuery.startsWith('b') ? searchQuery : `b${searchQuery}`;
      setSelectedBatchId(formattedQuery);
      setShowQR(false);
    }
  };

  const publicTraceUrl = selectedBatch ? `${typeof window !== 'undefined' ? window.location.origin : ''}/public/trace/${selectedBatch.id}` : '';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 w-full flex flex-col md:flex-row gap-8">
      {/* Search Sidebar */}
      <div className="w-full md:w-80 space-y-6 shrink-0">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-medium text-slate-700 mb-4">Lookup Batch</h3>
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. b398"
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-3">Recent Batches</h4>
            <div className="space-y-2">
              {batches.slice(0, 5).map(batch => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedBatchId === batch.id
                      ? 'bg-emerald-50 text-emerald-800 font-medium border border-emerald-100'
                      : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  Batch #{batch.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Area */}
      <div className="flex-1">
        {!selectedBatch ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-stone-50/50 border border-dashed border-stone-200 rounded-2xl text-stone-400">
            <FileText className="w-12 h-12 mb-4 text-stone-300" />
            <p>Select or search for a batch to view its traceability report.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-stone-100 bg-stone-50/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-light text-slate-800">Batch #{selectedBatch.id}</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200 text-stone-700">
                      {selectedBatch.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-stone-500 font-medium">{selectedRecipe?.name || 'Unknown Recipe'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQR(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <QrCode className="w-4 h-4" /> Public Trace QR
                  </button>
                  <button className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
                    Print Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Production Date</p>
                  <p className="text-sm font-medium text-slate-700">{format(new Date(selectedBatch.startDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Cure End Date</p>
                  <p className="text-sm font-medium text-slate-700">{format(new Date(selectedBatch.cureEndDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Actual Yield</p>
                  <p className="text-sm font-medium text-slate-700">{selectedBatch.actualYield} units</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Defects Reported</p>
                  <p className={`text-sm font-medium ${selectedBatch.defectCount > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                    {selectedBatch.defectCount} units
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-6 flex items-center gap-2">
                <Factory className="w-4 h-4 text-stone-400" />
                Raw Material Traceability
              </h3>

              <div className="space-y-4">
                {selectedRecipe?.ingredients.map((ing, idx) => {
                  const rm = ing.rawMaterial;
                  return (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-stone-100 bg-stone-50/30 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <PackageOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{rm?.name || 'Unknown Material'}</p>
                          <p className="text-xs text-stone-500 capitalize">{rm?.category}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:flex gap-6 md:gap-12 md:text-right">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Quantity Used</p>
                          <p className="font-mono text-sm text-slate-700">{ing.amount} {rm?.unit}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Supplier / Lot Trace</p>
                          <div className="flex items-center gap-1.5 md:justify-end">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <p className="text-sm font-medium text-slate-700">{rm?.supplier || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && selectedBatch && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden p-8 text-center border border-stone-100">
            <h3 className="text-xl font-medium text-slate-800 mb-2">Batch #{selectedBatch.id}</h3>
            <p className="text-sm text-stone-500 mb-8">Scan to view public traceability report</p>

            <div className="bg-white p-4 inline-block rounded-2xl border border-stone-100 shadow-sm mx-auto mb-6">
              <QRCodeSVG value={publicTraceUrl} size={200} level="H" includeMargin={true} />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.open(publicTraceUrl, '_blank')}
                className="w-full px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors"
              >
                Open Public Link
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="w-full px-4 py-2.5 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-xl text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
