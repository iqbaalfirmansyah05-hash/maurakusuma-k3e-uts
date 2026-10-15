import React from 'react';
import { Sparkles, CheckCircle2, Shield, HeartHandshake, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: Category | 'Semua') => void;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory, onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-rose-100/40 to-stone-50 border-b border-rose-100/60 pb-8 pt-6 sm:py-12">
      {/* Decorative Pastel Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Koleksi Eksklusif Muslimah 2026</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Pesona Cantik Berhijab dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600">
                Warna Pastel Lembut
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Temukan 12 pilihan jilbab premium: <strong>Pashmina Ceruty & Silk</strong>, <strong>Bergo Maryam Instan</strong>, dan <strong>Segi Empat Paris Voal</strong>. Bahan adem, jatuh sempurna, tidak menerawang, dan tegak rapi di dahi sepanjang hari.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start pt-1">
              <button
                onClick={() => onSelectCategory('Pashmina')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-xs font-medium text-rose-800 border border-rose-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Pashmina (Ceruty, Silk, Jersey)
              </button>
              <button
                onClick={() => onSelectCategory('Bergo & Instan')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-xs font-medium text-amber-900 border border-amber-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Bergo & Instan (Maryam, Sport, 2-in-1)
              </button>
              <button
                onClick={() => onSelectCategory('Segi Empat')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-xs font-medium text-emerald-900 border border-emerald-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Segi Empat (Paris, Bella, Voal Motif)
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Lihat 12 Produk Unggulan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>Real-Time Database • Ready Stock</span>
              </div>
            </div>
          </div>

          {/* Right Cards / Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Main Card */}
              <div className="rounded-3xl p-3 bg-white shadow-xl shadow-rose-100 border border-rose-100 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-rose-50">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
                    alt="Zahra Hijab Collection"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider">
                        Favorite Look
                      </span>
                      <h2 className="text-base font-semibold mt-1">Pashmina Ceruty Baby Doll Pastel</h2>
                      <p className="text-xs text-rose-100">Jatuh lembut, adem & mudah di-styling</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 grid grid-cols-3 gap-2 text-center pt-3 border-t border-rose-50 mt-2">
                  <div className="bg-rose-50/70 p-2 rounded-xl">
                    <span className="block text-xs font-bold text-rose-900">12</span>
                    <span className="text-[10px] text-rose-500">Pilihan Produk</span>
                  </div>
                  <div className="bg-amber-50/70 p-2 rounded-xl">
                    <span className="block text-xs font-bold text-amber-900">3</span>
                    <span className="text-[10px] text-amber-600">Kategori Utama</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-xl">
                    <span className="block text-xs font-bold text-emerald-900">100%</span>
                    <span className="text-[10px] text-emerald-600">Bahan Premium</span>
                  </div>
                </div>
              </div>

              {/* Floating mini review badge */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-rose-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                  ★ 4.9
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">1.200+ Ulasan Puas</p>
                  <p className="text-[10px] text-gray-500">Warna pastel cantik & anti-letoy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions Strip */}
        <div className="mt-8 pt-6 border-t border-rose-100/70 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700">
          <div className="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-xl border border-rose-100/50">
            <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
            <span><strong>Koleksi 12 Produk:</strong> 3 Kategori Jilbab Lengkap</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-xl border border-rose-100/50">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Real Database:</strong> Stok & Order Selalu Tersinkron</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-xl border border-rose-100/50">
            <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Approval Cepat:</strong> Verifikasi Bukti Transfer Rapi</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-xl border border-rose-100/50">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <span><strong>Shopping Cart:</strong> Otomatis Voucher & Multi-Kurir</span>
          </div>
        </div>
      </div>
    </div>
  );
};
