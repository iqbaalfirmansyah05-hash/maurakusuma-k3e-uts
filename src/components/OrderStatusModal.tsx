import React, { useState } from 'react';
import { X, Search, Truck, Clock, CheckCircle2, AlertCircle, Upload, MessageCircle, Package, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { api } from '../services/api';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = ''
}) => {
  if (!isOpen) return null;

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'ORD-20261014-7291');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Payment upload state inside tracking
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [proofImage, setProofImage] = useState('');
  const [senderBank, setSenderBank] = useState('BCA');
  const [senderName, setSenderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleSearchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) return;

    setIsLoading(true);
    setSearchError('');
    setUploadSuccess('');
    try {
      const data = await api.getOrderById(orderIdInput.trim());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setSearchError('Nomor pesanan tidak ditemukan di database. Pastikan nomor order benar (contoh: ORD-20261014-7291).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !proofImage || !senderName) return;

    setIsUploading(true);
    try {
      const updatedOrder = await api.uploadPaymentProof(order.id, {
        imageUrl: proofImage,
        senderBank,
        senderName,
        transferAmount: order.totalAmount,
        uploadedAt: new Date().toISOString()
      });
      setOrder(updatedOrder);
      setUploadSuccess('Bukti transfer berhasil dikirim ke database! Admin akan segera memverifikasi.');
      setShowUploadForm(false);
      setProofImage('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah bukti');
    } finally {
      setIsUploading(false);
    }
  };

  const statusBadges: Record<string, { bg: string; text: string; icon: any }> = {
    'Menunggu Pembayaran': { bg: 'bg-amber-100 border-amber-300 text-amber-800', text: 'Menunggu Pembayaran', icon: Clock },
    'Menunggu Approval': { bg: 'bg-blue-100 border-blue-300 text-blue-800', text: 'Menunggu Approval Admin', icon: Clock },
    'Diproses': { bg: 'bg-purple-100 border-purple-300 text-purple-800', text: 'Sedang Dipacking / Diproses', icon: Package },
    'Dikirim': { bg: 'bg-indigo-100 border-indigo-300 text-indigo-800', text: 'Sedang Dalam Pengiriman', icon: Truck },
    'Selesai': { bg: 'bg-emerald-100 border-emerald-300 text-emerald-800', text: 'Pesanan Selesai / Diterima', icon: CheckCircle2 },
    'Dibatalkan': { bg: 'bg-red-100 border-red-300 text-red-800', text: 'Pesanan Dibatalkan', icon: AlertCircle }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-serif-display font-bold text-base text-gray-900">
                Lacak Status Pesanan Pelanggan
              </h3>
              <p className="text-[11px] text-gray-500">
                Koneksi langsung ke database Zahra Hijab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Search Box */}
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan Nomor Order (cth. ORD-20261014-7291)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-semibold bg-rose-50/40 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
              />
              <Search className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              {isLoading ? 'Mencari...' : 'Cari Order'}
            </button>
          </form>

          {/* Quick Demo ID links */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 flex-wrap">
            <span>Coba ID demo:</span>
            <button
              type="button"
              onClick={() => {
                setOrderIdInput('ORD-20261014-7291');
              }}
              className="text-rose-600 hover:underline font-mono bg-rose-50 px-2 py-0.5 rounded-md"
            >
              ORD-20261014-7291
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderIdInput('ORD-20261012-9851');
              }}
              className="text-rose-600 hover:underline font-mono bg-rose-50 px-2 py-0.5 rounded-md"
            >
              ORD-20261012-9851
            </button>
          </div>

          {searchError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Result Card */}
          {order && (
            <div className="space-y-4 pt-2">
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-rose-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100/70 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block">NOMOR PESANAN</span>
                    <span className="font-mono font-bold text-sm text-gray-900">{order.id}</span>
                  </div>
                  {(() => {
                    const badge = statusBadges[order.status] || statusBadges['Menunggu Pembayaran'];
                    const Icon = badge.icon;
                    return (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.text}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Tracking Number if shipped */}
                {order.trackingNumber && (
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between text-xs text-indigo-950">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span>Nomor Resi ({order.courier}):</span>
                    </div>
                    <span className="font-mono font-bold">{order.trackingNumber}</span>
                  </div>
                )}

                {/* Recipient & Payment summary */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Penerima:</span>
                    <span className="font-semibold text-gray-800">{order.customer.name}</span>
                    <p className="text-[11px] text-gray-500">{order.customer.city}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Total Tagihan:</span>
                    <span className="font-bold text-rose-600 text-sm">{formatRupiah(order.totalAmount)}</span>
                    <p className="text-[11px] text-gray-500 uppercase">{order.paymentMethod} • {order.courier}</p>
                  </div>
                </div>

                {/* Products in this order */}
                <div className="pt-2 border-t border-rose-100/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Daftar Produk Jilbab:
                  </span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 truncate max-w-[280px]">
                        {item.quantity}x {item.productName} ({item.color})
                      </span>
                      <span className="font-medium text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Riwayat Perjalanan Pesanan
                  </h4>
                  <div className="border-l-2 border-rose-200 ml-2 pl-3 space-y-3">
                    {order.statusHistory.map((h, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                        <span className="font-semibold text-xs text-gray-800 block">
                          {h.status}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {formatDateTime(h.timestamp)}
                        </span>
                        {h.note && (
                          <p className="text-xs text-gray-600 bg-rose-50/50 p-1.5 rounded-lg border border-rose-100 mt-1">
                            {h.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection notice if rejected */}
              {order.paymentProof?.rejectedAt && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-1">
                  <span className="font-bold block flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-red-600" /> Bukti Pembayaran Sebelumnya Ditolak
                  </span>
                  <p>Alasan dari Admin: "{order.paymentProof.rejectionReason}"</p>
                  <p className="text-gray-600">Silakan kirim ulang bukti transfer yang jelas di bawah ini.</p>
                </div>
              )}

              {/* Upload Proof Button if Waiting for Payment or was rejected */}
              {(!order.paymentProof || order.paymentProof.rejectedAt) && (
                <div className="pt-2">
                  {!showUploadForm ? (
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(true)}
                      className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Unggah Bukti Transfer Sekarang</span>
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitProof} className="p-3.5 bg-stone-50 rounded-2xl border border-rose-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-xs text-gray-800">Formulir Kirim Bukti Transfer</h5>
                        <button
                          type="button"
                          onClick={() => setShowUploadForm(false)}
                          className="text-gray-400 text-xs hover:underline"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Nama Pengirim *</label>
                          <input
                            type="text"
                            required
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="Sesuai nama rekening"
                            className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Bank / E-Wallet</label>
                          <input
                            type="text"
                            value={senderBank}
                            onChange={(e) => setSenderBank(e.target.value)}
                            placeholder="BCA / Mandiri / QRIS"
                            className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-gray-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Foto Struk / Screenshot Bukti *</label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleImageFileChange}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-rose-100 file:text-rose-700"
                        />
                      </div>

                      {proofImage && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-rose-200">
                          <img src={proofImage} alt="Bukti" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {isUploading ? 'Mengunggah...' : 'Kirim Bukti ke Database'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* WhatsApp direct assistance */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Admin Zahra Hijab, saya ingin bertanya tentang pesanan dengan nomor: ${order.id}. Terima kasih!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Hubungi Admin via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
