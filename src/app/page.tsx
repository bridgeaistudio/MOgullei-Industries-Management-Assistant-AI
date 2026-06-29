'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, PackageOpen, ArrowRight, Leaf, MapPin, Phone, Mail, Building2, MessageSquare, Sparkles, Users, Award, Globe, ChevronUp, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CartProvider, useCart } from '@/components/Cart';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';

const products = [
  {
    name: 'Himalayan Lavender', type: 'Bar Soap',
    description: 'Classic relaxing lavender bar with 5% superfat for ultimate moisturizing. Made with pure lavender essential oil and organic olive oil base.',
    price: 'UGX 10,000',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=500&fit=crop',
    color: 'from-purple-100 to-purple-50',
    gallery: [
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547793549-70883f0cbc29?w=800&h=600&fit=crop',
    ],
    ingredients: ['Olive Oil', 'Coconut Oil', 'Shea Butter', 'Lavender Essential Oil', 'Sodium Hydroxide'],
    weight: '100g',
  },
  {
    name: 'Charcoal & Tea Tree', type: 'Facial Bar',
    description: 'Detoxifying facial bar with activated charcoal and pure tea tree oil. Deep cleanses pores while maintaining natural moisture balance.',
    price: 'UGX 12,000',
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&h=500&fit=crop',
    color: 'from-stone-200 to-stone-100',
    gallery: [
      'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601055903647-ddf1ee9701b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=600&fit=crop',
    ],
    ingredients: ['Olive Oil', 'Coconut Oil', 'Shea Butter', 'Activated Charcoal', 'Tea Tree Oil'],
    weight: '100g',
  },
  {
    name: 'Liquid Soap Fresh', type: 'Liquid Soap',
    description: 'Multi-purpose liquid soap, tough on stains but gentle on hands. Enriched with aloe vera and natural citrus extracts.',
    price: 'UGX 8,000',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=500&fit=crop',
    color: 'from-blue-100 to-blue-50',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop',
    ],
    ingredients: ['Potassium Hydroxide', 'Coconut Oil', 'Aloe Vera', 'Citrus Extract', 'Glycerin'],
    weight: '500ml',
  },
  {
    name: 'Shea Butter Gold', type: 'Body Butter',
    description: 'Pure northern Ugandan shea butter, unrefined and nutrient-rich. Deeply nourishes and protects skin naturally.',
    price: 'UGX 25,000',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=500&fit=crop',
    color: 'from-amber-100 to-amber-50',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547793549-70883f0cbc29?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=600&fit=crop',
    ],
    ingredients: ['Raw Shea Butter', 'Coconut Oil', 'Vitamin E', 'Beeswax', 'Essential Oils'],
    weight: '250g',
  },
];

const factoryImages = [
  { src: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&h=800&fit=crop', alt: 'African artisan at work', caption: 'Hand-pouring each batch' },
  { src: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&h=800&fit=crop', alt: 'Quality inspection process', caption: 'Quality assurance checks' },
  { src: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=800&fit=crop', alt: 'Production team member', caption: 'Our skilled production team' },
  { src: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=800&fit=crop', alt: 'Team packaging products', caption: 'Precision packaging line' },
];

const stats = [
  { label: 'Bars Crafted', value: 5000, suffix: '+', icon: Sparkles },
  { label: 'Organic Ingredients', value: 100, suffix: '%', icon: Leaf },
  { label: 'Partners Served', value: 50, suffix: '+', icon: Users },
  { label: 'Quality Score', value: 99, suffix: '%', icon: Award },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ProductCard({ product, idx, onViewDetails, onAddToCart }: { product: typeof products[0]; idx: number; onViewDetails: () => void; onAddToCart: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 14);
    setRotateY((centerX - x) / 14);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.12, type: 'spring' as const, stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_40px_rgba(6,95,70,0.06)] hover:shadow-[0_20px_60px_rgba(6,95,70,0.12)] transition-shadow duration-500 overflow-hidden cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/50 to-stone-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${product.color}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          initial={false}
          animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-700 shadow-lg"
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-[0.15em] shadow-sm">
            {product.type}
          </span>
        </div>
      </div>

      <div className="relative z-10 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight group-hover:text-emerald-800 transition-colors">{product.name}</h3>
        <p className="text-sm text-stone-500 mb-5 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <p className="text-lg font-bold text-slate-900">{product.price}</p>
          <div className="flex gap-2">
            <span className="px-3 py-2 bg-stone-50 text-stone-600 rounded-full text-xs font-semibold group-hover:bg-stone-100 transition-colors">
              Details
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              className="px-3 py-2 bg-emerald-600 text-white rounded-full text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetailModal({ product, onClose, onAddToCart }: { product: typeof products[0] | null; onClose: () => void; onAddToCart: (product: typeof products[0]) => void }) {
  const [activeImage, setActiveImage] = useState(0);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setImgLoaded({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveImage(i => (i + 1) % product.gallery.length);
      if (e.key === 'ArrowLeft') setActiveImage(i => (i - 1 + product.gallery.length) % product.gallery.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-500 hover:text-slate-900 hover:bg-white shadow-lg transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </motion.button>

            {/* Image Gallery Side */}
            <div className="lg:w-[55%] bg-stone-50 relative flex flex-col">
              {/* Main Image */}
              <div className="relative flex-1 min-h-[300px] lg:min-h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={product.gallery[activeImage]}
                    alt={`${product.name} - View ${activeImage + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onLoad={() => setImgLoaded(prev => ({ ...prev, [activeImage]: true }))}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Image counter */}
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-medium">
                  {activeImage + 1} / {product.gallery.length}
                </div>

                {/* Navigation arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i => (i - 1 + product.gallery.length) % product.gallery.length); }}
                    className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 shadow-lg hover:bg-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i => (i + 1) % product.gallery.length); }}
                    className="pointer-events-auto w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 shadow-lg hover:bg-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </motion.button>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 p-4 bg-white/80 backdrop-blur-md">
                {product.gallery.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-1 aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      activeImage === idx
                        ? 'ring-2 ring-emerald-600 ring-offset-2 shadow-lg'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Details Side */}
            <div className="lg:w-[45%] p-8 lg:p-10 overflow-y-auto flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-4">
                  <Leaf className="w-3 h-3" /> {product.type}
                </span>

                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-4">{product.name}</h2>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-emerald-700">{product.price}</span>
                  <span className="text-sm text-stone-400">/ {product.weight}</span>
                </div>

                <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>
              </motion.div>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mb-8"
              >
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.15em] mb-4">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, idx) => (
                    <motion.span
                      key={ing}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-full text-xs font-medium text-stone-600 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-colors cursor-default"
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="space-y-3 mb-8"
              >
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-[0.15em] mb-4">Product Highlights</h4>
                {['100% Organic & Natural', 'Handcrafted in Kampala, Uganda', 'Cold-process method', '28-day curing period'].map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-sm text-stone-600">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-auto pt-6 border-t border-stone-100 flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { if (product) { onAddToCart(product); onClose(); } }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-shadow flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-3.5 px-5 bg-stone-50 text-stone-700 rounded-xl font-semibold text-sm border border-stone-200 hover:bg-stone-100 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingPage() {
  return (
    <CartProvider>
      <LandingPageContent />
    </CartProvider>
  );
}

function LandingPageContent() {
  const router = useRouter();
  const { addItem, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 font-sans overflow-x-hidden">
      {/* Floating header with glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-[#FAFAF8]/90 border-b border-stone-200/60 shadow-sm' : 'backdrop-blur-xl bg-[#FAFAF8]/80 border-b border-stone-100/50'}`}>
        <div className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white font-serif italic text-xl shadow-lg shadow-emerald-900/20">M</div>
            <div>
              <h1 className="font-semibold tracking-tight text-lg">MOgullei Industries</h1>
              <p className="text-[9px] text-emerald-600 font-medium tracking-[0.3em] uppercase">AI Powered</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">Products</a>
            <a href="#about" className="text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">About</a>
            <a href="#partner" className="text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">Partner</a>
            <a href="#contact" className="text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors">Contact</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-stone-500 hover:text-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-full text-sm font-medium shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-shadow"
            >
              <LogIn className="w-4 h-4" /> Staff Login
            </motion.button>
          </nav>
        </div>
      </header>

      <div className="h-[72px]" />

      <main>
        {/* Hero Section - Full Viewport */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/60 to-transparent rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-stone-200/40 to-transparent rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-50/30 to-amber-50/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-32 right-[15%] w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-emerald-300/10 rounded-3xl border border-emerald-200/20 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-40 left-[10%] w-16 h-16 bg-gradient-to-br from-stone-200/30 to-stone-100/10 rounded-2xl border border-stone-200/20 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[60%] right-[8%] w-12 h-12 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full border border-emerald-100/20"
          />

          <div className="max-w-7xl mx-auto px-8 py-20 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-[0.15em] border border-emerald-100/60 shadow-sm mb-8"
              >
                <Leaf className="w-3.5 h-3.5" /> Handcrafted in Uganda
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-8xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-8"
              >
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="block"
                >
                  Purely Natural.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  className="block bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 bg-clip-text text-transparent"
                >
                  Expertly Crafted.
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-lg sm:text-xl text-stone-500 leading-relaxed max-w-xl mb-10 font-light"
              >
                We manufacture premium artisanal soaps and body care products using locally sourced, organic ingredients from across East Africa.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#products"
                  className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-medium shadow-xl shadow-slate-900/20 flex items-center gap-2 overflow-hidden hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Our Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <a
                  href="#partner"
                  className="px-8 py-4 bg-white/70 backdrop-blur-md text-slate-900 border border-stone-200/60 rounded-full font-medium hover:bg-white hover:border-stone-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  Partner with us
                </a>
              </motion.div>
            </div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=500&h=600&fit=crop"
                    alt="African artisan crafting soap"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Hand Crafted</span>
                  </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&h=400&fit=crop"
                    alt="Lavender soap bars"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=500&h=400&fit=crop"
                    alt="Charcoal soap products"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=500&h=600&fit=crop"
                    alt="Production team member"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Our Team</span>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        </section>

        {/* Factory / Behind the Scenes */}
        <section id="about" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <p className="text-emerald-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Behind The Scenes</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">From Our Factory Floor</h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed">See how our dedicated team in Kampala transforms raw, organic ingredients into the premium products our partners trust.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {factoryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                >
                  <div className="aspect-[3/4]">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-semibold text-sm">{img.caption}</p>
                    <p className="text-white/70 text-xs mt-1">MOgullei Industries, Kampala</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Factory feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {[
                { title: 'Cold Process Method', desc: 'Traditional soap-making that preserves glycerin and essential oil potency.' },
                { title: '28-Day Curing', desc: 'Every bar cures for a minimum of 28 days for the perfect hardness and lather.' },
                { title: 'Zero Waste Goal', desc: 'Scraps are reprocessed. Oils are sourced from certified sustainable farms.' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors duration-300"
                >
                  <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 to-emerald-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,95,70,0.3),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-emerald-300/80 text-sm font-medium tracking-[0.2em] uppercase mb-4">Trusted Across East Africa</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Numbers That Speak for Quality</h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:bg-white/[0.1] transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-4" />
                    <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-emerald-300/70 text-sm font-medium tracking-wide">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-28 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-20"
            >
              <p className="text-emerald-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Our Collection</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">Crafted With Intention</h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed">Discover our range of handcrafted care products, formulated with care, precision, and the finest organic ingredients.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={idx} product={product} idx={idx} onViewDetails={() => setSelectedProduct(product)} onAddToCart={() => { addItem({ id: product.name, name: product.name, type: product.type, price: parseInt(product.price.replace(/[^0-9]/g, '')), image: product.image }); }} />
              ))}
            </div>

            {/* Payment methods banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 bg-gradient-to-r from-stone-50 to-stone-100/50 rounded-3xl border border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Order Online, Pay Your Way</h4>
                <p className="text-sm text-stone-500">We accept multiple payment methods for your convenience</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-[#FFCC00] rounded-lg flex items-center justify-center font-black text-[#004F9F] text-[9px] shadow-sm">MTN</div>
                <div className="w-12 h-8 bg-[#ED1C24] rounded-lg flex items-center justify-center font-bold text-white text-[8px] shadow-sm">Airtel</div>
                <div className="w-12 h-8 bg-[#1A1F71] rounded-lg flex items-center justify-center shadow-sm">
                  <svg width="22" height="8" viewBox="0 0 48 16" fill="none"><path d="M17.4 1.2L11.5 14.8H7.8L4.9 4.2C4.7 3.4 4.5 3.1 3.9 2.8C2.9 2.3 1.3 1.8 0 1.5L0.1 1.2H6C6.8 1.2 7.5 1.7 7.7 2.7L9.3 11.3L12.9 1.2H17.4ZM34.4 10.3C34.4 6.7 29.4 6.5 29.4 4.9C29.5 4.4 30 3.8 31.1 3.7C31.6 3.6 33.1 3.6 34.7 4.3L35.4 1.6C34.5 1.3 33.4 1 32 1C27.8 1 24.8 3.3 24.8 6.5C24.8 8.9 26.9 10.2 28.5 10.9C30.1 11.7 30.7 12.2 30.6 12.9C30.6 13.9 29.4 14.4 28.3 14.4C26.5 14.4 25.5 14 24.7 13.6L24 16.4C24.9 16.8 26.5 17.2 28.2 17.2C32.7 17.2 35.5 14.9 34.4 10.3Z" fill="white"/><path d="M39.3 14.8H43L39.9 1.2H36.9C36.2 1.2 35.6 1.6 35.3 2.2L29 14.8H33.5L34.3 12.6H39.8L39.3 14.8ZM35.6 9.5L37.8 3.6L39.1 9.5H35.6Z" fill="white"/><path d="M24.2 1.2L20.6 14.8H16.3L19.9 1.2H24.2Z" fill="white"/></svg>
                </div>
                <div className="w-12 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                  <svg width="20" height="12" viewBox="0 0 32 20" fill="none"><circle cx="11" cy="10" r="9" fill="#EB001B"/><circle cx="21" cy="10" r="9" fill="#F79E1B"/><path d="M16 3.3A9 9 0 0 1 19.4 10 9 9 0 0 1 16 16.7 9 9 0 0 1 12.6 10 9 9 0 0 1 16 3.3Z" fill="#FF5F00"/></svg>
                </div>
                <div className="w-12 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partner / Contact Forms */}
        <section id="partner" className="py-28 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <p className="text-emerald-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Get In Touch</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">Let&apos;s Work Together</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registration Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative group"
              >
                <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-emerald-200/50 via-transparent to-stone-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 mb-5">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Partner With Us</h3>
                    <p className="text-stone-500 text-sm">Register your interest to become a distributor or raw material supplier.</p>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="text" placeholder=" " className="peer w-full px-4 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                        <label className="absolute left-4 top-3.5 text-stone-400 text-sm transition-all pointer-events-none peer-focus:text-[10px] peer-focus:-translate-y-2.5 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-emerald-600">First Name</label>
                      </div>
                      <div className="relative">
                        <input type="text" placeholder=" " className="peer w-full px-4 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                        <label className="absolute left-4 top-3.5 text-stone-400 text-sm transition-all pointer-events-none peer-focus:text-[10px] peer-focus:-translate-y-2.5 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-emerald-600">Last Name</label>
                      </div>
                    </div>
                    <div className="relative">
                      <input type="text" placeholder=" " className="peer w-full px-4 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                      <label className="absolute left-4 top-3.5 text-stone-400 text-sm transition-all pointer-events-none peer-focus:text-[10px] peer-focus:-translate-y-2.5 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-emerald-600">Company Name</label>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-[0.15em] mb-2">Partnership Type</label>
                      <select className="w-full px-4 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 text-sm">
                        <option>I want to be a Distributor</option>
                        <option>I am a Raw Material Supplier</option>
                        <option>Other Business Inquiry</option>
                      </select>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-shadow mt-2"
                    >
                      Submit Application
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* Feedback Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-emerald-400/20 via-transparent to-slate-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-slate-900 p-10 rounded-[2rem] border border-slate-800/80 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,95,70,0.15),transparent_60%)]" />
                  <div className="relative z-10">
                    <div className="mb-8">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-5">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight mb-2">Share Feedback</h3>
                      <p className="text-slate-400 text-sm">Have you used our products? Let us know your experience to help us improve.</p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="relative">
                        <input type="text" placeholder=" " className="peer w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-white text-sm" />
                        <label className="absolute left-4 top-3.5 text-slate-500 text-sm transition-all pointer-events-none peer-focus:text-[10px] peer-focus:-translate-y-2.5 peer-focus:text-emerald-400 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-emerald-400">Your Name (Optional)</label>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Product Used</label>
                        <select className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-white text-sm">
                          {products.map((p, i) => <option key={i}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <textarea rows={4} placeholder=" " className="peer w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-white text-sm resize-none" />
                        <label className="absolute left-4 top-3.5 text-slate-500 text-sm transition-all pointer-events-none peer-focus:text-[10px] peer-focus:-translate-y-2.5 peer-focus:text-emerald-400 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-emerald-400">Your Message</label>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/30 hover:shadow-xl transition-shadow mt-2"
                      >
                        Send Feedback
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="bg-white/50 backdrop-blur-md py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white font-serif italic text-lg shadow-md shadow-emerald-900/20">M</div>
                <div>
                  <h2 className="font-semibold tracking-tight text-slate-900">MOgullei Industries</h2>
                  <p className="text-[9px] text-emerald-600 font-medium tracking-[0.3em] uppercase">AI Powered</p>
                </div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                Pioneering intelligent, high-quality manufacturing of organic soap products in the heart of East Africa.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-[0.15em] text-xs mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-stone-500">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Plot 45, Kampala Road<br/>Kampala, Uganda</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>+256 700 000 000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>hello@mogullie.co.ug</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-[0.15em] text-xs mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li><a href="#" className="hover:text-emerald-700 transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-emerald-700 transition-colors">Products</a></li>
                <li><a href="#partner" className="hover:text-emerald-700 transition-colors">Become a Partner</a></li>
                <li><a href="#" className="hover:text-emerald-700 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400 font-medium tracking-wider">
            <p>&copy; {new Date().getFullYear()} MOgullei Industries. All rights reserved.</p>
            <p>Powered by BridgeAI Studio</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={(p) => { addItem({ id: p.name, name: p.name, type: p.type, price: parseInt(p.price.replace(/[^0-9]/g, '')), image: p.image }); }} />
      <CheckoutDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-full shadow-lg shadow-emerald-900/30 flex items-center justify-center hover:shadow-xl hover:shadow-emerald-900/40 transition-shadow"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
