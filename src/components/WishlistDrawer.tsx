import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCartFromWishlist: (product: Product) => void;
  onClearWishlist: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCartFromWishlist,
  onClearWishlist
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-base text-gray-900">
                Koleksi Favorit Saya
              </h2>
              <p className="text-xs text-rose-500 font-medium">
                {wishlistProducts.length} jilbab tersimpan di Wishlist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">Belum Ada Jilbab Favorit</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Ketuk ikon hati pada produk jilbab yang Anda sukai untuk menyimpannya ke daftar wishlist ini.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-md shadow-rose-200 transition-all"
              >
                Jelajahi 12 Koleksi Hijab
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-stone-50/80 hover:bg-stone-50 rounded-2xl border border-rose-100 transition-all group"
              >
                {/* Image */}
                <div className="relative shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-18 h-22 object-cover rounded-xl bg-rose-100 border border-rose-100"
                  />
                  <span className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/95 text-rose-700 border border-rose-200 shadow-2xs">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-xs text-gray-900 leading-snug line-clamp-1" title={product.name}>
                      {product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Hapus dari Favorit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 truncate">{product.material}</p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="font-bold text-xs text-rose-600">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock & Add to Cart button */}
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {product.stock > 0 ? `Stok: ${product.stock} pcs` : 'Stok Habis'}
                    </span>

                    <button
                      disabled={product.stock <= 0}
                      onClick={() => onAddToCartFromWishlist(product)}
                      className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[11px] shadow-2xs flex items-center gap-1 transition-all disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>+ Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-rose-100 bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{wishlistProducts.length} Produk Favorit Anda</span>
              <button
                onClick={onClearWishlist}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Hapus Semua
              </button>
            </div>

            <button
              onClick={() => {
                wishlistProducts.forEach(p => {
                  if (p.stock > 0) onAddToCartFromWishlist(p);
                });
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pindahkan Semua yang Ready ke Keranjang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
