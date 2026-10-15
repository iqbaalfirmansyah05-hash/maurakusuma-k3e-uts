import React, { useState } from 'react';
import { X, Check, Truck, CreditCard, QrCode, Upload, ArrowRight, ShieldCheck, AlertCircle, Copy, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, CustomerInfo } from '../types';
import { formatRupiah } from '../utils/formatters';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedVoucher: { code: string; discountAmount: number } | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedVoucher,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  // Customer Form State
  const [formData, setFormData] = useState<CustomerInfo>({
    name: 'Fathiyyah Rahmah',
    phone: '081298765432',
    email: 'fathiyyah.rahmah@gmail.com',
    address: 'Jl. Anggrek No. 24, RT 02 / RW 05, Cilandak',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12430',
    notes: 'Jilbab tolong dicek jahitannya sebelum dikirim ya min, terimakasih'
  });

  // Shipping & Courier
  const couriers = [
    { id: 'J&T Express', name: 'J&T Express', cost: 10000, etd: '1-2 Hari' },
    { id: 'SiCepat', name: 'SiCepat Reguler', cost: 12000, etd: '1-2 Hari' },
    { id: 'JNE Reguler', name: 'JNE Reguler', cost: 9000, etd: '2-3 Hari' }
  ];
  const [selectedCourier, setSelectedCourier] = useState(couriers[0]);

  interface PaymentMethodOption {
    id: 'bca' | 'mandiri' | 'bri' | 'qris';
    name: string;
    accountNumber: string;
    accountName: string;
    type: 'bank' | 'qris';
  }

  // Payment Method
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'bca',
      name: 'Bank BCA',
      accountNumber: '8291-038-472',
      accountName: 'Zahra Hijab Store',
      type: 'bank'
    },
    {
      id: 'mandiri',
      name: 'Bank Mandiri',
      accountNumber: '137-00-1928374-1',
      accountName: 'Zahra Hijab Store',
      type: 'bank'
    },
    {
      id: 'bri',
      name: 'Bank BRI',
      accountNumber: '0341-01-002938-50-3',
      accountName: 'Zahra Hijab Store',
      type: 'bank'
    },
    {
      id: 'qris',
      name: 'QRIS Realtime (GoPay / BCA / ShopeePay / OVO)',
      accountNumber: 'NMID: ID1020268472910',
      accountName: 'Zahra Hijab Store Official',
      type: 'qris'
    }
  ];
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodOption>(paymentMethods[0]);

  // Payment Proof Upload state
  const [hasProofNow, setHasProofNow] = useState(true);
  const [proofImage, setProofImage] = useState<string>('');
  const [senderBank, setSenderBank] = useState('BCA Mobile');
  const [senderName, setSenderName] = useState('Fathiyyah Rahmah');
  const [proofNotes, setProofNotes] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const shippingCost = selectedCourier.cost;
  const totalAmount = Math.max(0, subtotal - discount + shippingCost);

  // Handle image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 8 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit order to real database
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setErrorMessage('Mohon lengkapi Nama, No. WhatsApp, Alamat dan Kota pengiriman.');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        color: item.selectedColor,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));

      const paymentProofPayload = (hasProofNow && proofImage) ? {
        imageUrl: proofImage,
        senderBank: senderBank || selectedPayment.name,
        senderName: senderName || formData.name,
        transferAmount: totalAmount,
        notes: proofNotes,
        uploadedAt: new Date().toISOString()
      } : undefined;

      const order = await api.createOrder({
        customer: formData,
        items: itemsPayload,
        subtotal,
        shippingCost,
        discount,
        voucherCode: appliedVoucher?.code,
        totalAmount,
        courier: selectedCourier.name,
        paymentMethod: selectedPayment.id as any,
        paymentProof: paymentProofPayload
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setCreatedOrder(order);
      onOrderSuccess(order);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Nomor berhasil disalin: ${text}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* If Order Already Created Successfully -> Show Success View */}
        {createdOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                Pesanan Berhasil Tercatat di Database
              </span>
              <h2 className="font-serif-display text-2xl font-bold text-gray-900">
                Alhamdulillah! Terima Kasih Telah Berbelanja
              </h2>
              <p className="text-xs text-gray-500">
                Pesanan Anda telah resmi terdaftar di database Zahra Hijab dengan status{' '}
                <strong className="text-emerald-700">
                  {createdOrder.status}
                </strong>
                .
              </p>
            </div>

            {/* Order Badge Box */}
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Nomor Pesanan:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-rose-900">{createdOrder.id}</span>
                  <button
                    onClick={() => copyToClipboard(createdOrder.id)}
                    className="p-1 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-[10px]"
                    title="Salin No. Order"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Penerima:</span>
                <span className="font-medium text-gray-800">{createdOrder.customer.name} ({createdOrder.customer.phone})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total Pembayaran:</span>
                <span className="font-bold text-rose-600 text-sm">{formatRupiah(createdOrder.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Metode & Kurir:</span>
                <span className="font-medium text-gray-800">{createdOrder.paymentMethod.toUpperCase()} • {createdOrder.courier}</span>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Langkah Selanjutnya:</strong> Admin butik kami akan memverifikasi bukti transfer dan segera menyiapkan hijab pesanan Anda. Anda dapat mengecek status pesanan sewaktu-waktu melalui tombol <strong>Cek Status Order</strong>.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo Admin Zahra Hijab, saya sudah membuat pesanan di webstore dengan nomor order: ${createdOrder.id} atas nama ${createdOrder.customer.name} total ${formatRupiah(createdOrder.totalAmount)}. Mohon diproses ya kak. Terima kasih!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi ke WhatsApp Admin</span>
              </a>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          /* Normal Checkout Form Flow */
          <>
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="font-serif-display font-bold text-base text-gray-900">
                    Formulir Checkout & Pembayaran
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Isi alamat pengiriman dan unggah bukti transfer
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

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Data Penerima */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-[10px] flex items-center justify-center">1</span>
                  Informasi Penerima & Alamat Kirim
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Nama Lengkap Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                      placeholder="cth. Nabila Khairunnisa"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                      placeholder="cth. 081234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Alamat Email (opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                      placeholder="email@anda.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                      placeholder="cth. Bandung / Jakarta Selatan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Alamat Lengkap Pengiriman (Jalan, No Rumah, RT/RW, Patokan) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-400"
                    placeholder="Alamat detail agar kurir mudah menemukan lokasi Anda"
                  />
                </div>
              </div>

              {/* 2. Pilihan Ekspedisi Kurir */}
              <div className="space-y-2 pt-2 border-t border-rose-100">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-[10px] flex items-center justify-center">2</span>
                  Pilih Jasa Pengiriman
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {couriers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCourier(c)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedCourier.id === c.id
                          ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-200 font-bold'
                          : 'border-gray-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <span className="block text-xs text-gray-900">{c.name}</span>
                      <span className="block text-[11px] text-rose-600 font-semibold">{formatRupiah(c.cost)}</span>
                      <span className="block text-[10px] text-gray-400">{c.etd}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Metode Pembayaran & Rekening Bank / QRIS */}
              <div className="space-y-3 pt-2 border-t border-rose-100">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-[10px] flex items-center justify-center">3</span>
                  Pilih Rekening Tujuan Transfer / QRIS
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPayment(m)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedPayment.id === m.id
                          ? 'border-rose-500 bg-rose-50/80 font-bold text-rose-900 ring-2 ring-rose-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-rose-200'
                      }`}
                    >
                      <span className="block text-xs">{m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}</span>
                    </button>
                  ))}
                </div>

                {/* Display Chosen Account Details */}
                <div className="p-3.5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                      Rekening Resmi Zahra Hijab
                    </span>
                    <p className="font-bold text-sm text-gray-900">{selectedPayment.name}</p>
                    <p className="font-mono text-base font-extrabold text-rose-800 tracking-wider">
                      {selectedPayment.accountNumber}
                    </p>
                    <p className="text-xs text-gray-600">a.n. <strong>{selectedPayment.accountName}</strong></p>
                  </div>

                  {selectedPayment.type === 'qris' ? (
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-rose-200 text-center shrink-0">
                      <div className="w-20 h-20 bg-rose-50 flex items-center justify-center text-rose-700 mx-auto rounded-lg">
                        <QrCode className="w-14 h-14" />
                      </div>
                      <span className="text-[9px] text-gray-500 font-semibold block mt-1">Scan QRIS Instan</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedPayment.accountNumber)}
                      className="px-3 py-1.5 bg-white text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold hover:bg-rose-50 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin No. Rek</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Unggah Bukti Pembayaran */}
              <div className="space-y-3 pt-2 border-t border-rose-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-[10px] flex items-center justify-center">4</span>
                    Unggah Bukti Transfer (Opsional Sekarang)
                  </h4>
                  <label className="text-xs flex items-center gap-1.5 cursor-pointer text-gray-600">
                    <input
                      type="checkbox"
                      checked={hasProofNow}
                      onChange={(e) => setHasProofNow(e.target.checked)}
                      className="rounded-sm text-rose-500 focus:ring-rose-400"
                    />
                    <span>Upload sekarang</span>
                  </label>
                </div>

                {hasProofNow ? (
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-dashed border-rose-300 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">
                          Nama Pengirim di Rekening/Akun *
                        </label>
                        <input
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Nama pemilik rekening"
                          className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">
                          Bank / Aplikasi Pengirim *
                        </label>
                        <input
                          type="text"
                          value={senderBank}
                          onChange={(e) => setSenderBank(e.target.value)}
                          placeholder="cth. BCA Mobile / Gopay / Livin"
                          className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-gray-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-700 mb-1">
                        Pilih Foto Struk / Screenshot Bukti Transfer
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 cursor-pointer"
                      />
                    </div>

                    {proofImage && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-rose-200 bg-white shadow-xs">
                        <img src={proofImage} alt="Bukti Transfer" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setProofImage('')}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full text-xs hover:bg-black"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    Anda dapat menyelesaikan pemesanan terlebih dahulu dan mengunggah bukti transfer nanti melalui menu "Cek Status Order".
                  </p>
                )}
              </div>

              {/* Order Items Review */}
              <div className="pt-2 border-t border-rose-100 space-y-2">
                <span className="text-xs font-bold text-gray-700">Ringkasan Pesanan ({cartItems.length} produk):</span>
                <div className="bg-rose-50/40 p-3 rounded-2xl border border-rose-100/80 space-y-2 text-xs">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-700">
                      <span className="truncate max-w-[240px]">
                        {item.quantity}x {item.productName} ({item.selectedColor})
                      </span>
                      <span className="font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-rose-100 space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal Produk</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Diskon Voucher ({appliedVoucher?.code})</span>
                        <span>- {formatRupiah(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Ongkir ({selectedCourier.name})</span>
                      <span>{formatRupiah(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-rose-200">
                      <span>Total Harus Ditransfer</span>
                      <span className="text-rose-600 font-extrabold">{formatRupiah(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Menyimpan ke Real Database...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Buat Pesanan & Bayar {formatRupiah(totalAmount)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
