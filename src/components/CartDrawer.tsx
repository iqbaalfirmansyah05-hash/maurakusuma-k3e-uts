import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  onProceedToCheckout: (appliedVoucher: { code: string; discountPercent: number; discountAmount: number } | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [voucherInput, setVoucherInput] = useState('PASTELCANTIK');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountPercent: number;
  } | null>({
    code: 'PASTELCANTIK',
    discountPercent: 10
  });
  const [voucherError, setVoucherError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher ? Math.round((subtotal * appliedVoucher.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherInput.trim().toUpperCase();
    if (code === 'PASTELCANTIK') {
      setAppliedVoucher({ code: 'PASTELCANTIK', discountPercent: 10 });
    } else if (code === 'ZAHRAHIJAB') {
      setAppliedVoucher({ code: 'ZAHRAHIJAB', discountPercent: 15 });
    } else {
      setVoucherError('Kode voucher tidak valid. Gunakan: PASTELCANTIK');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handleCheckout = () => {
    onProceedToCheckout(
      appliedVoucher
        ? {
            code: appliedVoucher.code,
            discountPercent: appliedVoucher.discountPercent,
            discountAmount
          }
        : null
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display font-bold text-base text-gray-900">
                Keranjang Belanja
              </h2>
              <p className="text-xs text-rose-500">
                {cartItems.length} jenis jilbab terpilih
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

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">Keranjang Anda Masih Kosong</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                Pilih jilbab pashmina, bergo, atau segi empat favorit Anda untuk mulai berbelanja.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-md shadow-rose-200 transition-all"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.productId}-${item.selectedColor}-${idx}`}
                className="flex items-center gap-3 p-3 bg-stone-50/70 hover:bg-stone-50 rounded-2xl border border-rose-100/60 transition-all"
              >
                {/* Thumbnail */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-xl bg-rose-100 shrink-0 border border-rose-100"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-xs text-gray-900 leading-snug line-clamp-1">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.productId, item.selectedColor)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100/80 text-rose-800 font-medium">
                      Warna: {item.selectedColor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-xs text-rose-600">
                      {formatRupiah(item.price)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-200 bg-white rounded-lg">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.selectedColor, item.quantity - 1)
                        }
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-rose-50 rounded-l-md font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.selectedColor, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-rose-50 rounded-r-md font-bold disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer & Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-rose-100 bg-white space-y-3.5">
            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="Kode Voucher Promo"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase font-medium bg-rose-50/60 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                  />
                  <Tag className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs rounded-xl transition-colors"
                >
                  Terapkan
                </button>
              </div>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Voucher <strong>{appliedVoucher.code}</strong> aktif (-{appliedVoucher.discountPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-red-500 hover:underline font-medium"
                  >
                    Hapus
                  </button>
                </div>
              )}
              {voucherError && (
                <p className="text-[11px] text-red-500">{voucherError}</p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} pcs)</span>
                <span className="font-semibold text-gray-800">{formatRupiah(subtotal)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Diskon Promo ({appliedVoucher.discountPercent}%)</span>
                  <span>- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-dashed border-rose-100">
                <span>Total Belanja</span>
                <span className="text-rose-600 text-base">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>Lanjut ke Pengiriman & Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
