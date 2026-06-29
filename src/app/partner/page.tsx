'use client';

import { useState } from 'react';
import { CheckCircle2, TrendingUp, Truck, Megaphone, ShieldCheck } from 'lucide-react';

const partnershipTypes = ['Distributor', 'Supplier', 'Other'] as const;
const productInterests = ['Bar Soaps', 'Liquid Soaps', 'Body Butters', 'All Products'] as const;

const benefits = [
  { icon: TrendingUp, title: 'Competitive Wholesale Pricing', description: 'Access bulk pricing tiers that maximize your margins and grow your business.' },
  { icon: Truck, title: 'Reliable Supply Chain', description: 'Consistent product availability with flexible delivery schedules across Uganda.' },
  { icon: Megaphone, title: 'Marketing Support', description: 'Co-branded marketing materials, point-of-sale displays, and digital assets.' },
  { icon: ShieldCheck, title: 'Quality Guarantee', description: 'Every product is crafted with premium ingredients and backed by our quality promise.' },
];

const currentPartners = [
  { name: 'Kampala Distributors Ltd', type: 'Distributor' },
  { name: 'East Africa Supplies Co.', type: 'Supplier' },
  { name: 'Uganda Beauty Network', type: 'Distributor' },
  { name: 'Great Lakes Trading', type: 'Distributor' },
  { name: 'Savanna Organics', type: 'Supplier' },
  { name: 'Pearl of Africa Retail', type: 'Distributor' },
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    partnershipType: '' as string,
    productsOfInterest: [] as string[],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleProduct = (product: string) => {
    setForm(prev => ({
      ...prev,
      productsOfInterest: prev.productsOfInterest.includes(product)
        ? prev.productsOfInterest.filter(p => p !== product)
        : [...prev.productsOfInterest, product],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center font-black text-xl tracking-tighter">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MOgullei Industries</h1>
            <p className="text-emerald-200 text-sm">Partner Portal</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-900 to-emerald-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Grow With Us</h2>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Join MOgullei Industries&apos; partner network and bring premium Ugandan personal care products to your market.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">Why Partner With Us</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
                  <b.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{b.title}</h4>
                <p className="text-sm text-stone-500">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Register as a Partner</h3>
          <p className="text-stone-500 text-center mb-10">Fill in the form below and our team will get back to you within 48 hours.</p>

          {submitted ? (
            <div className="text-center py-16 bg-emerald-50 rounded-3xl border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h4>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Thank you for your interest in partnering with MOgullei Industries. Our business development team will review your application and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'Company Name', key: 'companyName', type: 'text', placeholder: 'Your Company Ltd' },
                  { label: 'Contact Person', key: 'contactPerson', type: 'text', placeholder: 'Full Name' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'partner@company.com' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+256 700 000 000' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.key as keyof typeof form] as string}
                      onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Plot 42, Industrial Area, Kampala"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Partnership Type</label>
                <select
                  required
                  value={form.partnershipType}
                  onChange={(e) => setForm(prev => ({ ...prev, partnershipType: e.target.value }))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">Select type...</option>
                  {partnershipTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Products of Interest</label>
                <div className="flex flex-wrap gap-3">
                  {productInterests.map(product => (
                    <label key={product} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.productsOfInterest.includes(product)}
                        onChange={() => toggleProduct(product)}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">{product}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Message / Notes</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your business and partnership goals..."
                  rows={4}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-shadow"
              >
                Submit Partnership Application
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-2">Our Partners</h3>
          <p className="text-slate-400 text-center mb-12">Trusted by leading distributors and suppliers across East Africa</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {currentPartners.map((partner) => (
              <div key={partner.name} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg mb-3">
                  {partner.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-slate-200 leading-tight">{partner.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 text-center py-8 text-sm">
        &copy; {new Date().getFullYear()} MOgullei Industries. All rights reserved.
      </footer>
    </div>
  );
}
