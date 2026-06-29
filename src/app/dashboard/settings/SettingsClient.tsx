'use client';

import React, { useState } from 'react';
import { updateSettingsAction } from '@/actions/settings';
import { Factory, Save, FileText, MapPin, Building2, Phone, Mail, Download } from 'lucide-react';

interface SettingsData {
  currency: string;
  factoryName: string;
  registrationNumber: string;
  tin: string;
  address: string;
  district: string;
  phone: string;
  email: string;
}

interface RawMaterial {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
}

interface FinishedGood {
  id: string;
  sku: string;
  scent: string;
  size: string;
  onHandCount: number;
  priceRetail: number;
  priceWholesale: number;
}

interface Client {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  district?: string | null;
}

interface Order {
  id: string;
  clientId: string;
  date: string;
  status: string;
  total: number;
}

interface SettingsClientProps {
  settings: SettingsData;
  rawMaterials: RawMaterial[];
  finishedGoods: FinishedGood[];
  clients: Client[];
  orders: Order[];
}

export function SettingsClient({ settings, rawMaterials, finishedGoods, clients, orders }: SettingsClientProps) {
  const [formData, setFormData] = useState({
    currency: settings.currency,
    factoryDetails: {
      name: settings.factoryName,
      tin: settings.tin,
      registrationNumber: settings.registrationNumber,
      address: settings.address,
      district: settings.district,
      phone: settings.phone,
      email: settings.email,
    }
  });

  const handleFactoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      factoryDetails: {
        ...formData.factoryDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      currency: e.target.value
    });
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append('currency', formData.currency);
    fd.append('factoryName', formData.factoryDetails.name);
    fd.append('registrationNumber', formData.factoryDetails.registrationNumber);
    fd.append('tin', formData.factoryDetails.tin);
    fd.append('address', formData.factoryDetails.address);
    fd.append('district', formData.factoryDetails.district);
    fd.append('phone', formData.factoryDetails.phone);
    fd.append('email', formData.factoryDetails.email);
    await updateSettingsAction(fd);
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const lines: string[] = [];
    lines.push('--- COTTAGE FACTORY ERP EXPORT ---');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');

    lines.push('--- RAW MATERIALS STOCK ---');
    lines.push('ID,Name,Category,Quantity,Unit,CostPerUnit');
    rawMaterials.forEach(rm => lines.push(`${rm.id},"${rm.name}",${rm.category},${rm.quantity},${rm.unit},${rm.costPerUnit}`));
    lines.push('');

    lines.push('--- FINISHED GOODS STOCK ---');
    lines.push('ID,SKU,Scent,Size,OnHandCount,RetailPrice,WholesalePrice');
    finishedGoods.forEach(fg => lines.push(`${fg.id},${fg.sku},"${fg.scent}",${fg.size},${fg.onHandCount},${fg.priceRetail},${fg.priceWholesale}`));
    lines.push('');

    lines.push('--- CLIENT DATABASE ---');
    lines.push('ID,Name,Type,Email,Phone,District');
    clients.forEach(c => lines.push(`${c.id},"${c.name}",${c.type},${c.email},${c.phone},"${c.district || ''}"`));
    lines.push('');

    lines.push('--- SALES HISTORY ---');
    lines.push('ID,ClientID,Date,Status,TotalAmount');
    orders.forEach(o => lines.push(`${o.id},${o.clientId},${o.date},${o.status},${o.total}`));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `erp_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 w-full">

      {/* Factory Profile Setup */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-800">Cottage Factory Profile</h3>
            <p className="text-sm text-stone-500 mt-0.5">Manage your registered business details and location.</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Registered Business Name</label>
            <input name="name" value={formData.factoryDetails.name} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Tax Identification Number (TIN)</label>
            <input name="tin" value={formData.factoryDetails.tin} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> URSB Registration Number</label>
            <input name="registrationNumber" value={formData.factoryDetails.registrationNumber} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address / Plot</label>
            <input name="address" value={formData.factoryDetails.address} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> District</label>
            <input name="district" value={formData.factoryDetails.district} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Official Phone</label>
            <input name="phone" value={formData.factoryDetails.phone} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Official Email</label>
            <input name="email" value={formData.factoryDetails.email} onChange={handleFactoryChange} className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600" />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-lg font-medium text-slate-800">Localization Settings</h3>
          <p className="text-sm text-stone-500 mt-1">Configure regional preferences for your instance.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="currency" className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              System Currency
            </label>
            <div className="max-w-xs">
              <select
                id="currency"
                value={formData.currency}
                onChange={handleCurrencyChange}
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              >
                <option value="UGX">Ugandan Shilling (UGX)</option>
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="TZS">Tanzanian Shilling (TZS)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              This changes how prices and values are formatted across the entire ERP.
            </p>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-lg font-medium text-slate-800">Data Export & Backup</h3>
          <p className="text-sm text-stone-500 mt-1">Download consolidated business data for offline record keeping.</p>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 mb-1">Consolidated CSV Export</h4>
              <p className="text-sm text-stone-600 mb-4">Generates a single CSV file containing current stock levels (raw & finished), complete client database, and sales order history.</p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
              >
                <Download className="w-4 h-4" /> Generate & Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-md hover:bg-emerald-800 transition-colors">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
