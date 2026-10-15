import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: Category | 'Semua';
  onSelectCategory: (cat: Category | 'Semua') => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  wishlistIds = [],
  onToggleWishlist,
  isLoading,
  onRefresh
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating' | 'stock'>('default');

  const categories: { label: string; value: Category | 'Semua'; count: number }[] = [
    { label: 'Semua Koleksi', value: 'Semua', count: products.length },
    { label: 'Pashmina', value: 'Pashmina', count: products.filter(p => p.category === 'Pashmina').length },
    { label: 'Bergo & Instan', value: 'Bergo & Instan', count: products.filter(p => p.category === 'Bergo & Instan').length },
    { label: 'Segi Empat', value: 'Segi Empat', count: products.filter(p => p.category === 'Segi Empat').length },
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'Semua') return true;
    return p.category === selectedCategory;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'stock') return b.stock - a.stock;
    return 0;
  });

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Jilbab Muslimah Pastel</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900">
            {selectedCategory === 'Semua' ? '12 Koleksi Pilihan Jilbab' : `Koleksi ${selectedCategory}`}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Menampilkan <strong>{sortedProducts.length}</strong> produk jilbab siap kirim dengan real-time database stok.
          </p>
        </div>

        {/* Filter Pills & Sort dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Tabs */}
          <div className="flex items-center bg-rose-50/80 p-1 rounded-2xl border border-rose-100">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => onSelectCategory(c.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === c.value
                    ? 'bg-white text-rose-600 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                {c.label} ({c.count})
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="default">Urutan: Rekomendasi</option>
              <option value="price-low">Harga: Termurah</option>
              <option value="price-high">Harga: Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="stock">Stok Terbanyak</option>
            </select>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-gray-600 hover:text-rose-600 shadow-2xs transition-all"
              title="Perbarui Data dari Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Products */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Tidak ada jilbab yang sesuai dengan filter atau kata kunci pencarian Anda. Coba ubah kategori atau bersihkan pencarian.
          </p>
          <button
            onClick={() => onSelectCategory('Semua')}
            className="mt-4 px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
          >
            Tampilkan Semua 12 Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
};
