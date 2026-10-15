import React from 'react';
import { Heart, ShieldCheck, Truck, Sparkles, MessageCircle } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (cat: Category | 'Semua') => void;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onOpenTracking
}) => {
  return (
    <footer className="bg-white border-t border-rose-100 pt-12 pb-8 mt-16 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-rose-100">
          {/* Brand & About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-400 to-rose-200 flex items-center justify-center text-white font-bold text-sm">
                Z
              </div>
              <span className="font-serif-display font-bold text-base text-gray-900">
                Zahra Hijab & Pashmina
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Butik busana muslimah dan jilbab bernuansa warna pastel cerah nan anggun. Menghadirkan kain Ceruty Baby Doll, Silk Pleated, Paris Japan, dan Bergo Maryam premium.
            </p>
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Database Connection Active</span>
            </div>
          </div>

          {/* Koleksi Jilbab */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase text-gray-900 tracking-wider">
              Kategori Koleksi
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>
                <button
                  onClick={() => onSelectCategory('Pashmina')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Pashmina Ceruty & Silk (4 Produk)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bergo & Instan')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Bergo Maryam & Instan (4 Produk)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Segi Empat')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Segi Empat Paris & Voal (4 Produk)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Semua')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Semua 12 Produk Lengkap
                </button>
              </li>
            </ul>
          </div>

          {/* Layanan Pelanggan */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase text-gray-900 tracking-wider">
              Bantuan & Layanan
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-rose-600 transition-colors text-left"
                >
                  Lacak Resi / Status Pesanan
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Customer Service WhatsApp</span>
                </a>
              </li>
              <li>
                <span>Pengiriman Tiap Hari (J&T, SiCepat, JNE)</span>
              </li>
              <li>
                <span>Metode Bayar: BCA, Mandiri, BRI & QRIS</span>
              </li>
            </ul>
          </div>

          {/* Admin & Store Operations */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase text-gray-900 tracking-wider">
              Akses Pengelola
            </h4>
            <p className="text-xs text-gray-500">
              Panel untuk mengelola stok, approve bukti transfer, data order, pelanggan, dan laporan sales.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-700 font-semibold text-xs border border-stone-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-stone-600" />
              <span>Masuk Panel Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <p>© 2026 Zahra Hijab & Pashmina Store. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Didesain dengan <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> warna cerah pastel untuk muslimah elegan
          </p>
        </div>
      </div>
    </footer>
  );
};
