import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Truck, Sparkles, Menu, X, Heart } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
  isAdminLoggedIn: boolean;
  selectedCategory: Category | 'Semua';
  onSelectCategory: (cat: Category | 'Semua') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenAdmin,
  onOpenTracking,
  isAdminLoggedIn,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: (Category | 'Semua')[] = ['Semua', 'Pashmina', 'Bergo & Instan', 'Segi Empat'];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 text-rose-950 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-rose-700 animate-pulse" />
        <span>Koleksi Pastel Ramadhan & Harian • Gunakan Kode Voucher <strong>PASTELCANTIK</strong> untuk Diskon 10%!</span>
        <span className="hidden sm:inline bg-rose-900/10 text-rose-900 px-2 py-0.5 rounded-full text-[10px] font-semibold">Gratis Ongkir s/d 20rb</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectCategory('Semua')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-400 to-rose-200 flex items-center justify-center shadow-md shadow-rose-200 text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.39 1.05-4.54 2.73-6.02.67 1.83 2.05 3.32 3.82 4.19C10.21 11.23 10 12.58 10 14h4c0-1.42-.21-2.77-.55-3.83 1.77-.87 3.15-2.36 3.82-4.19C18.95 7.46 20 9.61 20 12c0 4.41-3.59 8-8 8z" />
              </svg>
            </div>
            <div>
              <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-rose-950">
                Zahra Hijab
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-rose-500 uppercase">
                Pashmina & Butik Muslimah
              </span>
            </div>
          </div>

          {/* Search bar desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari jilbab pashmina, bergo, segi 4, bahan..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-rose-50/60 hover:bg-rose-50 focus:bg-white text-sm text-gray-800 placeholder-rose-300 rounded-full border border-rose-200/80 focus:outline-hidden focus:border-rose-400 focus:ring-3 focus:ring-rose-200/50 transition-all"
              />
              <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-xs text-rose-400 hover:text-rose-600 font-semibold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist / Favorit Button */}
            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                title="Buka Koleksi Jilbab Favorit Saya"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-600'}`} />
                <span className="hidden sm:inline text-xs font-semibold">Favorit</span>
                {wishlistCount > 0 && (
                  <span className="bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cek Resi / Status Order */}
            <button
              onClick={onOpenTracking}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-200 transition-colors"
              title="Lacak status pesanan dengan Nomor Order"
            >
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>Cek Status Order</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 flex items-center gap-2 transition-all transform active:scale-95"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Keranjang</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:static bg-white text-rose-600 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Panel button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border transition-all ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Panel Admin Webstore"
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-emerald-600' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Admin Aktif' : 'Login Admin'}
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-rose-900 hover:bg-rose-50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="flex items-center justify-between pb-3 pt-1 border-t border-rose-50 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white font-semibold shadow-xs shadow-rose-200'
                    : 'bg-rose-50/70 text-rose-900 hover:bg-rose-100/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-rose-400 font-medium">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300" /> 100% Pastel Authentic
            </span>
          </div>
        </nav>

        {/* Mobile Search & Menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-rose-100 space-y-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari jilbab, pashmina, bergo..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-rose-50 text-xs rounded-full border border-rose-200"
              />
              <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-2.5" />
            </div>
            {onOpenWishlist && (
              <button
                onClick={() => {
                  onOpenWishlist();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-800 bg-rose-50 rounded-lg border border-rose-200"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-600'}`} />
                <span>Koleksi Favorit ({wishlistCount})</span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-800 bg-rose-50 rounded-lg border border-rose-200"
            >
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>Cek Status / Lacak Order</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
