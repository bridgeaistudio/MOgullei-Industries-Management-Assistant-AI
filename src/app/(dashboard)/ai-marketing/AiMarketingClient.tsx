'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Instagram, Facebook, TrendingUp, Hash, Zap, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface FinishedGood {
  id: string;
  sku: string;
  scent: string;
  size: string;
  priceRetail: number;
  priceWholesale: number;
  onHandCount: number;
}

interface Batch {
  id: string;
  status: string;
}

interface AiMarketingClientProps {
  finishedGoods: FinishedGood[];
  batches: Batch[];
}

export function AiMarketingClient({ finishedGoods, batches }: AiMarketingClientProps) {
  const { formatCurrency } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'social'>('campaigns');

  const highStockProducts = finishedGoods.filter(fg => fg.onHandCount > 300).sort((a, b) => b.onHandCount - a.onHandCount);
  const upcomingBatches = batches.filter(b => b.status === 'curing');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Marketing Hub
          </h3>
          <p className="text-sm text-stone-500 mt-1">Intelligent campaigns and social media generation based on your factory data.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Analyzing Data...' : 'Refresh AI Insights'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: AI Suggestions based on Data */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" /> AI Strategy Pulse
            </h4>

            <div className="space-y-4">
              {highStockProducts.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-indigo-200 mb-1">Inventory Alert</p>
                  <p className="text-sm font-medium">You have an excess of {highStockProducts[0].scent} ({highStockProducts[0].onHandCount} units). Suggest running a flash sale to wholesale clients.</p>
                </div>
              )}

              {upcomingBatches.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-xs text-indigo-200 mb-1">Coming Soon</p>
                  <p className="text-sm font-medium">Batch #{upcomingBatches[0].id} is curing. Let's start a teaser campaign on Instagram to build hype before launch.</p>
                </div>
              )}

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-indigo-200 mb-1">Trending Audience</p>
                <p className="text-sm font-medium">Your natural soap posts are performing 45% better with women aged 25-34 in Kampala. Focus messaging on "organic ingredients".</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4">Recommended Hashtags</h4>
            <div className="flex flex-wrap gap-2">
              {['#UgandaMade', '#OrganicSoap', '#CottageIndustry', '#KampalaBusiness', '#NaturalSkincare', '#HandmadeUG'].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium border border-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Content Generation & Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4 border-b border-stone-200 pb-2">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'campaigns' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
            >
              Smart Campaigns
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'social' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
            >
              Social Media Posts
            </button>
          </div>

          {activeTab === 'social' && (
            <div className="grid gap-6">
              {/* Instagram Post */}
              {highStockProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-48 bg-stone-100 flex items-center justify-center p-6 border-r border-stone-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-inner border border-white flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-pink-600 opacity-50" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-bold uppercase tracking-wider border border-pink-100">
                          <Instagram className="w-3.5 h-3.5" /> Instagram
                        </span>
                        <span className="text-xs text-stone-400 font-medium">Auto-generated</span>
                      </div>
                      <p className="text-slate-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                        Transform your daily routine with our {highStockProducts[0].scent} soap. Handcrafted in small batches using locally sourced ingredients, it's the perfect way to start your morning.
                        {"\n\n"}
                        Grab yours today for {formatCurrency(highStockProducts[0].priceRetail)}! Tap the link in our bio.
                        {"\n\n"}
                        #OrganicSoap #KampalaLife #HandmadeUG #SkincareRoutine
                      </p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors">Edit Text</button>
                      <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                        <Send className="w-4 h-4" /> Schedule Post
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Facebook Post */}
              {upcomingBatches.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-48 bg-stone-100 flex items-center justify-center p-6 border-r border-stone-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-inner border border-white flex items-center justify-center">
                      <Facebook className="w-8 h-8 text-blue-600 opacity-50" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                          <Facebook className="w-3.5 h-3.5" /> Facebook
                        </span>
                        <span className="text-xs text-stone-400 font-medium">Auto-generated</span>
                      </div>
                      <p className="text-slate-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                        Sneak peek alert! Our production team is currently curing Batch #{upcomingBatches[0].id}. We're making sure it hits the perfect firmness and scent profile before it reaches you.
                        {"\n\n"}
                        Comment below if you want to be the first to know when it drops!
                      </p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors">Edit Text</button>
                      <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                        <Send className="w-4 h-4" /> Schedule Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-slate-800">B2B Wholesale Outreach</h4>
                    <p className="text-sm text-stone-500 mt-1">AI drafted email campaign to clear excess inventory.</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
                    High Conversion
                  </span>
                </div>

                <div className="bg-stone-50 rounded-xl p-5 border border-stone-100 mb-6">
                  <p className="text-sm font-medium text-slate-700 mb-2">Subject: Exclusive Restock Offer on {highStockProducts[0]?.scent || 'Handmade Soap'}</p>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                    Hi [Client Name],
                    {"\n\n"}
                    We've just finished curing a beautiful new batch of our {highStockProducts[0]?.scent || 'bestselling soap'}. Knowing how quickly these move in your stores, we wanted to give you early access to order before we open it to the public.
                    {"\n\n"}
                    Your wholesale price is {formatCurrency(highStockProducts[0]?.priceWholesale || 0)} per unit.
                    {"\n\n"}
                    Let me know if you'd like us to set aside a box for you this week.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="px-5 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors">Preview List (12 Clients)</button>
                  <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                    <Send className="w-4 h-4" /> Launch Email Campaign
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-slate-800">"Local Craft" Paid Ads Strategy</h4>
                    <p className="text-sm text-stone-500 mt-1">AI recommended structure for Meta Ads targeting Kampala.</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wider border border-stone-200">
                    Draft
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Targeting</p>
                      <p className="text-xs text-stone-500">Radius: 20km around Kampala. Interests: Organic products, Skincare, Local Business.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Budget Recommendation</p>
                      <p className="text-xs text-stone-500">{formatCurrency(20000)} / day for 7 days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Ad Creative</p>
                      <p className="text-xs text-stone-500">Carousel highlighting 3 main scents. Call to action: "Shop Local".</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="px-5 py-2 border border-stone-200 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">Edit Strategy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
