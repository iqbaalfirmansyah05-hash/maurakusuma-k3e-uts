import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isSelectedColorAvailable = product.colors.find(c => c.name === selectedColor)?.inStock ?? true;

  const handleAddToCart = () => {
    if (isOutOfStock || !isSelectedColorAvailable) return;
    onAddToCart(product, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Image Column */}
        <div className="md:w-1/2 relative bg-rose-50 flex items-center justify-center min-h-[300px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover max-h-[460px]"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-500 text-white shadow-md">
              {product.badge}
            </span>
          )}
          <span className="absolute top-4 right-4 md:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 backdrop-blur-xs text-gray-700 hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </span>
        </div>

        {/* Right Info Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Close Button Desktop */}
            <div className="hidden md:flex justify-end">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-rose-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} ulasan)</span>
              </div>
            </div>

            {/* Title & Price */}
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-rose-600">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                Hemat {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed border-t border-b border-rose-50 py-2.5">
              {product.description}
            </p>

            {/* Specifications: Material & Size */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/60">
              <div>
                <span className="text-gray-400 block text-[10px]">Bahan Kain:</span>
                <span className="font-semibold text-gray-800">{product.material}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Ukuran / Dimensi:</span>
                <span className="font-semibold text-gray-800">{product.size}</span>
              </div>
            </div>

            {/* Color Variants Selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-gray-800">Pilih Varian Warna Pastel:</span>
                <span className="text-rose-600 font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                      selectedColor === c.name
                        ? 'border-rose-500 bg-rose-50/80 font-bold text-rose-900 ring-2 ring-rose-200'
                        : 'border-gray-200 hover:border-rose-200 text-gray-700 bg-white'
                    } ${!c.inStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    disabled={!c.inStock}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {selectedColor === c.name && <Check className="w-3 h-3 text-rose-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Stock Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-700">Jumlah:</span>
                <div className="flex items-center border border-rose-200 rounded-xl bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-1 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-l-xl font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-800 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-1 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-r-xl font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock notification */}
              <div className="text-right">
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Stok Habis
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    Sisa Stok: <strong className="text-emerald-600">{product.stock} pcs</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart CTA & Wishlist Toggle */}
          <div className="pt-3 border-t border-rose-100 flex items-center gap-2">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-2xl border transition-all active:scale-95 flex items-center justify-center shrink-0 ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-rose-200 hover:border-rose-300 bg-white text-gray-500 hover:text-rose-500'
                }`}
                title={isWishlisted ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !isSelectedColorAvailable}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 ${
                addedSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : isOutOfStock || !isSelectedColorAvailable
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 hover:shadow-lg'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Ditambahkan ke Keranjang!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah ke Keranjang • {formatRupiah(product.price * quantity)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
