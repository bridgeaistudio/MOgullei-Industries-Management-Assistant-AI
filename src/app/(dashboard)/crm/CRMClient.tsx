'use client';

import React, { useState } from 'react';
import { Mail, Phone, Building2, User as UserIcon, MapPin, Plus, X, MessageSquareHeart, Sparkles, Truck, Star, ShieldAlert, BarChart3, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';
import { useApp } from '@/context/AppContext';
import { addClientAction } from '@/actions/clients';

interface Client {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  district: string | null;
  region: string | null;
  notes: string;
  totalSpent: number;
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

interface CRMClientProps {
  clients: Client[];
  suppliers: Supplier[];
}

export const CRMClient = ({ clients, suppliers }: CRMClientProps) => {
  const { formatCurrency } = useApp();
  const [activeTab, setActiveTab] = useState<'clients' | 'suppliers'>('clients');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'wholesale' as string,
    email: '',
    phone: '',
    district: '',
    region: 'Central',
    notes: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(0\d{9}|(\+256)\s?\d{3}\s?\d{3}\s?\d{3})$/;
    const stripped = phone.replace(/[-\s]/g, '');
    if (!phoneRegex.test(stripped)) {
      setPhoneError('Please enter a valid 10-digit Ugandan number (e.g. 0772123456) or +256 format.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) return;

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('type', formData.type);
    fd.append('email', formData.email);
    fd.append('phone', formData.phone);
    fd.append('district', formData.district);
    fd.append('region', formData.region);
    fd.append('notes', formData.notes);

    await addClientAction(fd);
    setShowModal(false);
    setFormData({ name: '', type: 'wholesale', email: '', phone: '', district: '', region: 'Central', notes: '' });
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-stone-100 p-1 rounded-full">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'clients' ? 'bg-white text-slate-800 shadow-sm' : 'text-stone-500 hover:text-slate-700'}`}
          >
            Client Directory
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'suppliers' ? 'bg-white text-slate-800 shadow-sm' : 'text-stone-500 hover:text-slate-700'}`}
          >
            Supplier Performance
          </button>
        </div>

        {activeTab === 'clients' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white rounded-full text-sm font-medium shadow-sm hover:bg-emerald-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        )}
      </div>

      {activeTab === 'clients' && (
        <>
          {/* Customer Sentiment AI Tracker */}
          <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 mt-8 mb-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-indigo-500" /> Customer Sentiment & Feedback Tracker
                </h3>
                <p className="text-sm text-stone-500 mt-1">Log qualitative client feedback to be summarized by AI for product insights.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                Log New Feedback
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-700 text-sm">Kampala Organics Ltd</span>
                    <span className="text-[10px] text-stone-400">2 days ago</span>
                  </div>
                  <p className="text-sm text-stone-600 mb-3">&quot;The new Charcoal batches are selling really fast, but a few customers noted that the edges of the bars are a bit prone to crumbling during transport. Could we improve the packaging or curing time?&quot;</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded">Packaging</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded">Charcoal Bar</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-700 text-sm">Sarah (Retail)</span>
                    <span className="text-[10px] text-stone-400">5 days ago</span>
                  </div>
                  <p className="text-sm text-stone-600 mb-3">&quot;Absolutely love the Himalayan Lavender! The scent lasts so much longer than other brands. Will definitely be buying more.&quot;</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Positive</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded">Lavender Bar</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Sparkles className="w-24 h-24 text-emerald-400" />
                </div>
                <h4 className="font-bold flex items-center gap-2 mb-4 relative z-10">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> AI Insights Summary
                </h4>
                <div className="space-y-4 relative z-10 flex-1">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Recurring Issue</p>
                    <p className="text-sm text-slate-200">Charcoal bars crumbling on edges. Suggest reviewing curing duration or adding a protective sleeve.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Opportunity</p>
                    <p className="text-sm text-slate-200">Lavender scent longevity is highly praised. Consider launching a matching liquid body wash or lotion.</p>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors relative z-10">
                  Generate Full Report
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <div key={client.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                      {client.type === 'wholesale' ? <Building2 className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 leading-tight">{client.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        {client.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {client.district && (
                    <div className="flex items-center gap-2 text-sm text-stone-600 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-700">{client.district} District</span>
                      <span className="text-stone-400">({client.region})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Mail className="w-4 h-4 text-stone-400" />
                    <a href={`mailto:${client.email}`} className="hover:text-emerald-700">{client.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <a href={`tel:${client.phone}`} className="hover:text-emerald-700">{client.phone}</a>
                  </div>
                </div>

                <p className="text-xs text-stone-500 italic mb-4 flex-1">&quot;{client.notes}&quot;</p>

                <div className="pt-4 border-t border-stone-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-stone-400">Lifetime Value</p>
                    <p className="font-mono text-lg text-slate-700">{formatCurrency(client.totalSpent)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget({ id: client.id, name: client.name })}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
                      View History &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Avg Quality Rating</p>
                <p className="text-2xl font-bold text-slate-800">4.8<span className="text-sm text-stone-400">/5.0</span></p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">On-Time Deliveries</p>
                <p className="text-2xl font-bold text-slate-800">94<span className="text-sm text-stone-400">%</span></p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">Active Incidents</p>
                <p className="text-2xl font-bold text-slate-800">2</p>
              </div>
            </div>
          </section>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" /> Supplier Performance Scorecard
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-stone-100">
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Supplier</th>
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">On-Time %</th>
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Quality Score</th>
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Lead Time</th>
                    <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {suppliers.map(supplier => {
                    const rating = supplier.performanceScore / 20; // Convert 0-100 score to 0-5 scale
                    return (
                      <tr key={supplier.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{supplier.name}</p>
                          <p className="text-xs text-stone-500">{supplier.contactPerson}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase tracking-wider">
                            {supplier.materialsProvided.join(', ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden">
                              <div className={`h-full ${supplier.performanceScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${supplier.performanceScore}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">{supplier.performanceScore}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-700">{rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-stone-600">{supplier.averageDeliveryDays} Days</span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-xs font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded transition-colors">
                            Rate Delivery
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">Add New Client</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Client Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Client Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as 'retail'|'wholesale'})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none">
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => {setFormData({...formData, phone: e.target.value}); setPhoneError('');}} placeholder="0772123456" className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${phoneError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-600/20'}`} />
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">District</label>
                  <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="e.g. Kampala" className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Region</label>
                  <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none">
                    <option value="Central">Central</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Northern">Northern</option>
                    <option value="Western">Western</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Notes</label>
                  <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none"></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors">Save Client</button>
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
        critical={false}
        onConfirm={(password) => softDeleteAction('Client', deleteTarget!.id, password)}
      />
    </div>
  );
};
