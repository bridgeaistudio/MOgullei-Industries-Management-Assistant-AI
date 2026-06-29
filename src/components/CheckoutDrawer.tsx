'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard, Smartphone, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from './Cart';

const paymentMethods = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    icon: (
      <div className="w-10 h-10 bg-[#FFCC00] rounded-xl flex items-center justify-center font-black text-[#004F9F] text-xs shadow-sm">
        MTN
      </div>
    ),
    description: 'Pay with your MTN MoMo wallet',
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: (
      <div className="w-10 h-10 bg-[#ED1C24] rounded-xl flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
        Airtel
      </div>
    ),
    description: 'Pay with Airtel Money',
  },
  {
    id: 'visa',
    name: 'Visa Card',
    icon: (
      <div className="w-10 h-10 bg-[#1A1F71] rounded-xl flex items-center justify-center shadow-sm">
        <svg width="28" height="10" viewBox="0 0 48 16" fill="none"><path d="M17.4 1.2L11.5 14.8H7.8L4.9 4.2C4.7 3.4 4.5 3.1 3.9 2.8C2.9 2.3 1.3 1.8 0 1.5L0.1 1.2H6C6.8 1.2 7.5 1.7 7.7 2.7L9.3 11.3L12.9 1.2H17.4ZM34.4 10.3C34.4 6.7 29.4 6.5 29.4 4.9C29.5 4.4 30 3.8 31.1 3.7C31.6 3.6 33.1 3.6 34.7 4.3L35.4 1.6C34.5 1.3 33.4 1 32 1C27.8 1 24.8 3.3 24.8 6.5C24.8 8.9 26.9 10.2 28.5 10.9C30.1 11.7 30.7 12.2 30.6 12.9C30.6 13.9 29.4 14.4 28.3 14.4C26.5 14.4 25.5 14 24.7 13.6L24 16.4C24.9 16.8 26.5 17.2 28.2 17.2C32.7 17.2 35.5 14.9 34.4 10.3Z" fill="white"/><path d="M39.3 14.8H43L39.9 1.2H36.9C36.2 1.2 35.6 1.6 35.3 2.2L29 14.8H33.5L34.3 12.6H39.8L39.3 14.8ZM35.6 9.5L37.8 3.6L39.1 9.5H35.6Z" fill="white"/><path d="M24.2 1.2L20.6 14.8H16.3L19.9 1.2H24.2Z" fill="white"/></svg>
      </div>
    ),
    description: 'Visa Debit or Credit Card',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    icon: (
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
        <svg width="24" height="15" viewBox="0 0 32 20" fill="none"><circle cx="11" cy="10" r="9" fill="#EB001B"/><circle cx="21" cy="10" r="9" fill="#F79E1B"/><path d="M16 3.3A9 9 0 0 1 19.4 10 9 9 0 0 1 16 16.7 9 9 0 0 1 12.6 10 9 9 0 0 1 16 3.3Z" fill="#FF5F00"/></svg>
      </div>
    ),
    description: 'Mastercard Debit or Credit',
  },
  {
    id: 'cash_on_delivery',
    name: 'Cash on Delivery',
    icon: (
      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
      </div>
    ),
    description: 'Pay when you receive your order',
  },
];

function formatUGX(amount: number) {
  return `UGX ${amount.toLocaleString()}`;
}

interface CheckoutDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutDrawer({ open, onClose }: CheckoutDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  const handleClose = () => {
    if (step === 'success') {
      setStep('cart');
      setSelectedPayment('');
      setCustomer({ name: '', email: '', phone: '', address: '' });
    }
    onClose();
  };

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
        setStep('success');
        clearCart();
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    {step === 'cart' && 'Your Cart'}
                    {step === 'details' && 'Delivery Details'}
                    {step === 'payment' && 'Payment Method'}
                    {step === 'success' && 'Order Confirmed!'}
                  </h2>
                  {step === 'cart' && <p className="text-xs text-stone-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>}
                </div>
              </div>
              <button onClick={handleClose} className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps indicator */}
            {step !== 'success' && (
              <div className="px-6 py-4 flex items-center gap-2">
                {['cart', 'details', 'payment'].map((s, idx) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === s ? 'bg-emerald-700 text-white' :
                      ['cart', 'details', 'payment'].indexOf(step) > idx ? 'bg-emerald-100 text-emerald-700' :
                      'bg-stone-100 text-stone-400'
                    }`}>
                      {['cart', 'details', 'payment'].indexOf(step) > idx ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : idx + 1}
                    </div>
                    {idx < 2 && <div className={`flex-1 h-0.5 rounded ${['cart', 'details', 'payment'].indexOf(step) > idx ? 'bg-emerald-200' : 'bg-stone-100'}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Cart Items */}
                {step === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-4"
                  >
                    {items.length === 0 ? (
                      <div className="text-center py-16">
                        <ShoppingBag className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                        <p className="text-stone-400 font-medium">Your cart is empty</p>
                        <p className="text-xs text-stone-300 mt-1">Browse our products and add items</p>
                      </div>
                    ) : (
                      items.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100"
                        >
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
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Customer Details */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-5"
                  >
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
                  </motion.div>
                )}

                {/* Payment Selection */}
                {step === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-3"
                  >
                    <p className="text-sm text-stone-500 mb-4">Select your preferred payment method</p>
                    {paymentMethods.map((method, idx) => (
                      <motion.button
                        key={method.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          selectedPayment === method.id
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                            : 'border-stone-100 hover:border-stone-200 bg-white'
                        }`}
                      >
                        {method.icon}
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900">{method.name}</p>
                          <p className="text-xs text-stone-400">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedPayment === method.id ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'
                        }`}>
                          {selectedPayment === method.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    ))}

                    {/* Accepted payments strip */}
                    <div className="pt-6 mt-4 border-t border-stone-100">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold text-center mb-3">Secure Payment Partners</p>
                      <div className="flex items-center justify-center gap-4">
                        {paymentMethods.slice(0, 4).map(m => (
                          <div key={m.id} className="opacity-40">{m.icon}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' as const, stiffness: 300, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h3>
                    <p className="text-stone-500 text-sm mb-4 max-w-xs">Your order has been received and is being processed. We&apos;ll send you a confirmation shortly.</p>
                    <div className="px-4 py-2 bg-stone-50 rounded-lg border border-stone-100 mb-8">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-mono font-bold text-slate-900">{orderId}</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-8 py-3 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step !== 'success' && items.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-stone-500">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900">{formatUGX(total)}</span>
                </div>

                {step === 'cart' && (
                  <button
                    onClick={() => setStep('details')}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
                  >
                    Proceed to Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {step === 'details' && (
                  <div className="flex gap-3">
                    <button onClick={() => setStep('cart')} className="px-6 py-3.5 border border-stone-200 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors">
                      Back
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      disabled={!customer.name || !customer.email || !customer.phone || !customer.address}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
                    >
                      Choose Payment <CreditCard className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {step === 'payment' && (
                  <div className="flex gap-3">
                    <button onClick={() => setStep('details')} className="px-6 py-3.5 border border-stone-200 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors">
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={!selectedPayment || isSubmitting}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
