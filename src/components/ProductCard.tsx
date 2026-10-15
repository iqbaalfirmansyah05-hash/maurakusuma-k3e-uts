import React from 'react';
import { ShoppingBag, Eye, Star, Check, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default';

  // Category badge colors
  const categoryStyles: Record<string, string> = {
    'Pashmina': 'bg-rose-100 text-rose-800 border-rose-200',
    'Bergo & Instan': 'bg-amber-100 text-amber-800 border-amber-200',
    'Segi Empat': 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-rose-100/80 shadow-xs hover:shadow-xl hover:shadow-rose-100/60 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-4/5 overflow-hidden bg-rose-50/50 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500 text-white shadow-xs">
              {product.badge}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryStyles[product.category] || 'bg-gray-100 text-gray-800'}`}>
            {product.category}
          </span>
        </div>

        {/* Top Right: Wishlist Heart & Stock warning */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`p-1.5 rounded-full shadow-xs backdrop-blur-xs transition-all active:scale-90 ${
                isWishlisted
                  ? 'bg-white text-rose-500 ring-2 ring-rose-300'
                  : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
              }`}
              title={isWishlisted ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900/80 text-white backdrop-blur-xs">
              Habis
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs animate-pulse">
              Sisa {product.stock}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/90 text-white backdrop-blur-xs">
              Stok: {product.stock}
            </span>
          )}
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2.5 rounded-full bg-white text-rose-600 hover:bg-rose-50 shadow-md transform hover:scale-110 transition-transform"
            title="Lihat Detail Produk"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Review */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] text-gray-400 truncate max-w-[120px]" title={product.material}>
              {product.material.split(' ')[0]}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-medium text-sm text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Color preview dots */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] text-gray-400 mr-0.5">Warna:</span>
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs inline-block"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-gray-400 font-medium">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-rose-50 flex items-center justify-between gap-2">
          <div>
            <div className="text-rose-600 font-bold text-base sm:text-lg tracking-tight">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product, defaultColor)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-rose-50 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-200 hover:border-transparent active:scale-95'
            }`}
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
