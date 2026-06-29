'use client';

import React, { useState } from 'react';
import { addUserAction } from '@/actions/users';
import { UserCog, Plus, Mail, Phone, ShieldCheck, X, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { softDeleteAction } from '@/actions/delete';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface UsersClientProps {
  users: User[];
}

export function UsersClient({ users }: UsersClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'production_manager',
    status: 'active'
  });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ceo: 'Chief Executive Officer',
      md: 'Managing Director',
      production_manager: 'Production Manager',
      quality_assurance: 'Quality Assurance',
      sales_lead: 'Sales Lead',
      delivery_driver: 'Delivery Driver'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ceo':
      case 'md':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'quality_assurance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'sales_lead':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'delivery_driver':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

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
    fd.append('email', formData.email);
    fd.append('phone', formData.phone);
    fd.append('role', formData.role);
    fd.append('status', formData.status);
    await addUserAction(fd);
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', role: 'production_manager', status: 'active' });
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-700" />
            Staff & Role Management
          </h3>
          <p className="text-sm text-stone-500">Manage your cottage factory workforce and system access.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white rounded-full text-sm font-medium shadow-sm hover:bg-emerald-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 font-medium">Staff Member</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Assigned Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-stone-400">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <Phone className="w-3.5 h-3.5 text-stone-400" /> {user.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <Mail className="w-3.5 h-3.5 text-stone-400" /> {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    <ShieldCheck className="w-3 h-3" />
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline">Edit</button>
                  <button
                    onClick={() => setDeleteTarget({ id: user.id, name: user.name })}
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

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">Add Staff Member</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">System Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none">
                    <option value="ceo">Chief Executive Officer</option>
                    <option value="md">Managing Director</option>
                    <option value="production_manager">Production Manager</option>
                    <option value="quality_assurance">Quality Assurance</option>
                    <option value="sales_lead">Sales Lead</option>
                    <option value="delivery_driver">Delivery Driver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => {setFormData({...formData, phone: e.target.value}); setPhoneError('');}} placeholder="0772123456" className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${phoneError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-600/20'}`} />
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none" />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors">Create Staff Member</button>
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
        onConfirm={(password) => softDeleteAction('User', deleteTarget!.id, password)}
      />
    </div>
  );
}
