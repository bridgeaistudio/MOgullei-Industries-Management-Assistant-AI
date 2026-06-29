'use client';

import { useState } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, X, Loader2, CheckCircle2, Package } from 'lucide-react';
import { CartProvider, useCart } from '@/components/Cart';

const products = [
  { id: 'himalayan-lavender', name: 'Himalayan Lavender', type: 'Bar Soap', price: 10000, image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=500&fit=crop', description: 'Classic relaxing lavender bar with 5% superfat.' },
  { id: 'charcoal-tea-tree', name: 'Charcoal & Tea Tree', type: 'Facial Bar', price: 12000, image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&h=500&fit=crop', description: 'Detoxifying facial bar with activated charcoal.' },
  { id: 'liquid-soap-fresh', name: 'Liquid Soap Fresh', type: 'Liquid Soap', price: 8000, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=500&fit=crop', description: 'Multi-purpose liquid soap, gentle on hands.' },
  { id: 'shea-butter-gold', name: 'Shea Butter Gold', type: 'Body Butter', price: 25000, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=500&fit=crop', description: 'Pure northern Ugandan shea butter.' },
];

const paymentMethods = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    icon: (
      <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center font-black text-[#004F9F] text-xs shadow-sm">
        MTN
      </div>
    ),
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: (
      <div className="w-10 h-10 bg-[#ED1C24] rounded-xl flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
        Airtel
      </div>
    ),
  },
  {
    id: 'visa',
    name: 'Visa Card',
    icon: (
      <div className="w-10 h-10 bg-[#1A1F71] rounded-xl flex items-center justify-center shadow-sm">
        <svg width="28" height="10" viewBox="0 0 48 16" fill="none"><path d="M17.4 1.2L11.5 14.8H7.8L4.9 4.2C4.7 3.4 4.5 3.1 3.9 2.8C2.9 2.3 1.3 1.8 0 1.5L0.1 1.2H6C6.8 1.2 7.5 1.7 7.7 2.7L9.3 11.3L12.9 1.2H17.4ZM34.4 10.3C34.4 6.7 29.4 6.5 29.4 4.9C29.5 4.4 30 3.8 31.1 3.7C31.6 3.6 33.1 3.6 34.7 4.3L35.4 1.6C34.5 1.3 33.4 1 32 1C27.8 1 24.8 3.3 24.8 6.5C24.8 8.9 26.9 10.2 28.5 10.9C30.1 11.7 30.7 12.2 30.6 12.9C30.6 13.9 29.4 14.4 28.3 14.4C26.5 14.4 25.5 14 24.7 13.6L24 16.4C24.9 16.8 26.5 17.2 28.2 17.2C32.7 17.2 35.5 14.9 34.4 10.3Z" fill="white"/><path d="M39.3 14.8H43L39.9 1.2H36.9C36.2 1.2 35.6 1.6 35.3 2.2L29 14.8H33.5L34.3 12.6H39.8L39.3 14.8ZM35.6 9.5L37.8 3.6L39.1 9.5H35.6Z" fill="white"/><path d="M24.2 1.2L20.6 14.8H16.3L19.9 1.2H24.2Z" fill="white"/></svg>
      </div>
    ),
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    icon: (
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
        <svg width="24" height="15" viewBox="0 0 32 20" fill="none"><circle cx="11" cy="10" r="9" fill="#EB001B"/><circle cx="21" cy="10" r="9" fill="#F79E1B"/><path d="M16 3.3A9 9 0 0 1 19.4 10 9 9 0 0 1 16 16.7 9 9 0 0 1 12.6 10 9 9 0 0 1 16 3.3Z" fill="#FF5F00"/></svg>
      </div>
    ),
  },
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    icon: (
      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
      </div>
    ),
  },
];

function formatUGX(amount: number) {
  return `UGX ${amount.toLocaleString()}`;
}

type Tab = 'shop' | 'track';

function ClientShop() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  // Order tracking state
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Record<string, unknown> | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: items.map(i => ({
            productName: i.name,
            productType: i.type,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          paymentMethod: selectedPayment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setCheckoutStep('success');
        clearCart();
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);
    try {
      const res = await fetch(`/api/orders/${trackingId.trim()}`);
      if (!res.ok) {
        setTrackingError('Order not found. Please check your order ID and try again.');
        return;
      }
      const data = await res.json();
      setTrackingResult(data);
    } catch {
      setTrackingError('Something went wrong. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const resetCheckout = () => {
    setCheckoutStep('cart');
    setSelectedPayment('');
    setCustomer({ name: '', email: '', phone: '', address: '' });
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center font-black text-white text-sm tracking-tighter">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">MOgullei Shop</h1>
              <p className="text-xs text-stone-400">Premium Ugandan Personal Care</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="hidden sm:flex bg-stone-100 rounded-xl p-1 mr-4">
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'shop' ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-500 hover:text-slate-700'}`}
              >
                Shop
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'track' ? 'bg-white text-slate-900 shadow-sm' : 'text-stone-500 hover:text-slate-700'}`}
              >
                Track Order
              </button>
            </div>

            {/* Cart button */}
            <button
              onClick={() => { setCartOpen(true); setCheckoutStep('cart'); }}
              className="relative w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="sm:hidden flex border-t border-stone-100">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'shop' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-stone-400'}`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'track' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-stone-400'}`}
          >
            Track Order
          </button>
        </div>
      </header>

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Products</h2>
          <p className="text-stone-500 mb-8">Handcrafted with premium ingredients from Uganda</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[6/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">{product.type}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{product.name}</h3>
                  <p className="text-sm text-stone-500 mt-1 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-700">{formatUGX(product.price)}</span>
                    <button
                      onClick={() => addItem(product)}
                      className="px-4 py-2 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Track Order Tab */}
      {activeTab === 'track' && (
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Track Your Order</h2>
            <p className="text-stone-500">Enter the order ID you received after checkout</p>
          </div>

          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
              placeholder="Enter Order ID..."
              className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
            <button
              onClick={handleTrackOrder}
              disabled={trackingLoading || !trackingId.trim()}
              className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {trackingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </div>

          {trackingError && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
              {trackingError}
            </div>
          )}

          {trackingResult && (
            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Order Details</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase">
                  {(trackingResult as Record<string, unknown>).status as string || 'Processing'}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-stone-50">
                  <span className="text-stone-500">Order ID</span>
                  <span className="font-mono font-semibold text-slate-900">{(trackingResult as Record<string, unknown>).id as string}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-50">
                  <span className="text-stone-500">Customer</span>
                  <span className="text-slate-900">{(trackingResult as Record<string, unknown>).customerName as string}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-50">
                  <span className="text-stone-500">Payment</span>
                  <span className="text-slate-900">{(trackingResult as Record<string, unknown>).paymentMethod as string}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500">Total</span>
                  <span className="font-bold text-emerald-700">{formatUGX((trackingResult as Record<string, unknown>).totalAmount as number || 0)}</span>
                </div>
              </div>
              {Array.isArray((trackingResult as Record<string, unknown>).items) && (
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Items</p>
                  <div className="space-y-2">
                    {((trackingResult as Record<string, unknown>).items as Array<Record<string, unknown>>).map((item: Record<string, unknown>, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="text-slate-700">{item.productName as string} x{item.quantity as number}</span>
                        <span className="text-slate-900 font-medium">{formatUGX((item.unitPrice as number) * (item.quantity as number))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]" onClick={() => resetCheckout()}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="font-bold text-lg text-slate-900">
                {checkoutStep === 'cart' && 'Your Cart'}
                {checkoutStep === 'details' && 'Delivery Details'}
                {checkoutStep === 'payment' && 'Payment Method'}
                {checkoutStep === 'success' && 'Order Confirmed!'}
              </h2>
              <button onClick={() => resetCheckout()} className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Cart Items */}
              {checkoutStep === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                      <p className="text-stone-400 font-medium">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">{item.type}</p>
                            <p className="font-bold text-emerald-700 text-sm mt-1">{formatUGX(item.price)}</p>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <button onClick={() => removeItem(item.id)} className="p-1 text-stone-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-stone-400 hover:text-slate-700">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-bold text-slate-900 w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-stone-400 hover:text-slate-700">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Customer Details */}
              {checkoutStep === 'details' && (
                <div className="space-y-5">
                  {[
                    { label: 'Full Name', key: 'name' as const, type: 'text', placeholder: 'John Mukasa' },
                    { label: 'Email Address', key: 'email' as const, type: 'email', placeholder: 'john@example.com' },
                    { label: 'Phone Number', key: 'phone' as const, type: 'tel', placeholder: '0772123456' },
                    { label: 'Delivery Address', key: 'address' as const, type: 'text', placeholder: 'Plot 42, Kampala Road, Kampala' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={customer[field.key]}
                        onChange={(e) => setCustomer(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Selection */}
              {checkoutStep === 'payment' && (
                <div className="space-y-3">
                  <p className="text-sm text-stone-500 mb-4">Select your preferred payment method</p>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedPayment === method.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-stone-100 hover:border-stone-200 bg-white'
                      }`}
                    >
                      {method.icon}
                      <span className="font-semibold text-sm text-slate-900">{method.name}</span>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'
                      }`}>
                        {selectedPayment === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Success */}
              {checkoutStep === 'success' && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h3>
                  <p className="text-stone-500 text-sm mb-4">Your order has been received and is being processed.</p>
                  <div className="px-4 py-2 bg-stone-50 rounded-lg border border-stone-100 inline-block mb-8">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Order ID</p>
                    <p className="text-sm font-mono font-bold text-slate-900">{orderId}</p>
                  </div>
                  <br />
                  <button onClick={() => resetCheckout()} className="px-8 py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {checkoutStep !== 'success' && items.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-stone-500">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900">{formatUGX(total)}</span>
                </div>

                {checkoutStep === 'cart' && (
                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-shadow"
                  >
                    Proceed to Checkout
                  </button>
                )}

                {checkoutStep === 'details' && (
                  <div className="flex gap-3">
                    <button onClick={() => setCheckoutStep('cart')} className="px-6 py-3.5 border border-stone-200 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors">
                      Back
                    </button>
                    <button
                      onClick={() => setCheckoutStep('payment')}
                      disabled={!customer.name || !customer.email || !customer.phone || !customer.address}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-shadow"
                    >
                      Choose Payment
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex gap-3">
                    <button onClick={() => setCheckoutStep('details')} className="px-6 py-3.5 border border-stone-200 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors">
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={!selectedPayment || isSubmitting}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        <>Pay {formatUGX(total)}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 text-center py-8 text-sm text-stone-400">
        &copy; {new Date().getFullYear()} MOgullei Industries. All rights reserved.
      </footer>
    </div>
  );
}

export default function ClientPage() {
  return (
    <CartProvider>
      <ClientShop />
    </CartProvider>
  );
}
