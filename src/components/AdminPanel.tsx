import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, Users, CheckSquare, BarChart3, Plus, Edit, Trash2,
  Search, RefreshCw, Eye, Check, X, Truck, AlertCircle, ArrowUpRight,
  LogOut, ShieldAlert, Sparkles, Printer, FileText, ArrowLeft, ExternalLink,
  ChevronRight, Calendar, DollarSign, Layers
} from 'lucide-react';
import { Product, Order, Customer, SalesReport, Category, OrderStatus } from '../types';
import { formatRupiah, formatDateTime, formatDate } from '../utils/formatters';
import { api } from '../services/api';

interface AdminPanelProps {
  onClose: () => void;
  onLogout: () => void;
  currentUser: any;
  onDataChanged: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onLogout,
  currentUser,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'approvals' | 'customers' | 'reports'>('products');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<Category | 'Semua'>('Semua');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('Semua');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [statusNoteInput, setStatusNoteInput] = useState('');

  // Payment Proof Approval State
  const [viewingProofOrder, setViewingProofOrder] = useState<Order | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Nominal transfer tidak sesuai dengan total tagihan pesanan.');

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');

  // Sales Report State
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [reportTimeframe, setReportTimeframe] = useState<'all' | '30days' | '7days' | 'today'>('all');

  // Loading & notification states
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Fetch data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, custs, rep] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCustomers(),
        api.getSalesReport(reportTimeframe)
      ]);
      setProducts(prods);
      setOrders(ords);
      setCustomers(custs);
      setSalesReport(rep);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reportTimeframe]);

  // Orders awaiting approval count
  const pendingApprovalsCount = orders.filter(o => o.status === 'Menunggu Approval').length;

  // --- PRODUCT CRUD HANDLERS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category || editingProduct?.price === undefined) {
      alert('Nama, kategori, dan harga wajib diisi');
      return;
    }

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
        showToast('Produk dan stok berhasil diperbarui!');
      } else {
        await api.createProduct(editingProduct as any);
        showToast('Produk baru berhasil ditambahkan ke database!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await loadData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}" dari database?`)) {
      try {
        await api.deleteProduct(id);
        showToast(`Produk "${name}" berhasil dihapus.`);
        await loadData();
        onDataChanged();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleQuickStockChange = async (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    try {
      await api.updateProduct(productId, { stock: newStock });
      setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
      onDataChanged();
    } catch (err: any) {
      alert('Gagal mengupdate stok');
    }
  };

  // --- ORDER & APPROVAL HANDLERS ---
  const handleApprovePayment = async (orderId: string) => {
    try {
      await api.approvePayment(orderId, currentUser?.name || 'Admin Siti Aminah');
      showToast(`Bukti pembayaran untuk ${orderId} berhasil DISETUJUI! Status: Diproses.`);
      setViewingProofOrder(null);
      await loadData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Gagal menyetujui pembayaran');
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectingOrder) return;
    try {
      await api.rejectPayment(rejectingOrder.id, rejectReason);
      showToast(`Bukti pembayaran untuk ${rejectingOrder.id} DITOLAK dengan catatan.`);
      setRejectingOrder(null);
      setViewingProofOrder(null);
      await loadData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Gagal menolak bukti transfer');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, trackingInput || undefined, statusNoteInput || undefined);
      showToast(`Status pesanan ${orderId} diubah menjadi: ${newStatus}`);
      setSelectedOrderDetails(null);
      setTrackingInput('');
      setStatusNoteInput('');
      await loadData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status order');
    }
  };

  // Reset demo database
  const handleResetDatabase = async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset database ke kondisi default (12 produk jilbab, contoh pesanan & pelanggan)?')) {
      try {
        await api.resetDatabase();
        showToast('Database berhasil di-reset ke 12 produk awal!');
        await loadData();
        onDataChanged();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Print sales report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-100 flex flex-col">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Kembali ke Webstore"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-display font-bold text-lg text-rose-950">
                    Panel Admin Butik
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {currentUser?.name || 'Ustadzah Siti Aminah'} • Zahra Hijab & Pashmina
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                disabled={isLoading}
                className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 transition-colors"
                title="Refresh Data dari Database"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-rose-50 pt-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-rose-600'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>1. Data Produk & Stok ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-rose-600'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>2. Data Order & Riwayat ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'approvals'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-rose-600'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>3. Approval Bukti Pembayaran</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                  {pendingApprovalsCount} baru
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-rose-600'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Data Pelanggan ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                  : 'border-transparent text-gray-600 hover:text-rose-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>5. Laporan Sales & Omset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* ========================================== */}
        {/* TAB 1: KELOLA PRODUK DAN STOK */}
        {/* ========================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top KPI Cards for Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Total Jenis Produk</span>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{products.length} SKU</p>
                  <span className="text-[11px] text-rose-500">3 Kategori Hijab</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Total Stok Fisik Tersedia</span>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {products.reduce((sum, p) => sum + p.stock, 0)} pcs
                  </p>
                  <span className="text-[11px] text-emerald-600">Real-time di Database</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckSquare className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Produk Perlu Restock (&lt;10 pcs)</span>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {products.filter(p => p.stock < 10).length} Produk
                  </p>
                  <span className="text-[11px] text-amber-600">Perhatikan persediaan</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter and Add Button Header */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Cari nama, bahan, deskripsi produk..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-rose-50/40 rounded-xl border border-rose-200"
                  />
                  <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-white border border-rose-200 rounded-xl text-gray-700"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Bergo & Instan">Bergo & Instan</option>
                  <option value="Segi Empat">Segi Empat</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetDatabase}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-rose-600 bg-gray-50 rounded-xl border border-gray-200"
                  title="Kembalikan ke data 12 produk awal jika terhapus"
                >
                  Reset Demo
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      category: 'Pashmina',
                      price: 45000,
                      stock: 30,
                      description: 'Jilbab bahan premium nyaman dan adem.',
                      material: 'Ceruty / Voal Premium',
                      size: '175 x 75 cm',
                      colors: [
                        { name: 'Dusty Pink', hex: '#F4B6C2', inStock: true },
                        { name: 'Sage Soft', hex: '#B2D2B0', inStock: true },
                        { name: 'Nude Almond', hex: '#DEC1AB', inStock: true }
                      ],
                      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                      badge: 'New Arrival'
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-rose-50/60 text-gray-800 font-bold uppercase text-[10px] tracking-wider border-b border-rose-100">
                    <tr>
                      <th className="py-3 px-4">Foto & Nama Hijab</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga Jual</th>
                      <th className="py-3 px-4 text-center">Kelola Stok</th>
                      <th className="py-3 px-4">Warna & Bahan</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {products
                      .filter(p => {
                        const matchCat = selectedProductCategory === 'Semua' || p.category === selectedProductCategory;
                        const matchQ = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
                        return matchCat && matchQ;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-12 h-14 object-cover rounded-xl bg-rose-100 border border-rose-100 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{p.name}</h4>
                                <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                                {p.badge && (
                                  <span className="block mt-0.5 text-[9px] font-bold text-rose-600 uppercase">
                                    ★ {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-100/80 text-rose-800">
                              {p.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-gray-900">
                            {formatRupiah(p.price)}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleQuickStockChange(p.id, -1)}
                                disabled={p.stock <= 0}
                                className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center disabled:opacity-30"
                              >
                                -
                              </button>
                              <span
                                className={`px-2.5 py-0.5 rounded-lg font-bold text-xs ${
                                  p.stock <= 0
                                    ? 'bg-red-100 text-red-800'
                                    : p.stock < 10
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleQuickStockChange(p.id, 1)}
                                className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                {p.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-3 h-3 rounded-full border border-black/15"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400 block">{p.material}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 transition-colors"
                                title="Edit Produk & Detail"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: KELOLA ORDER DAN RIWAYAT */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            {/* Filter Status Pills */}
            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['Semua', 'Menunggu Pembayaran', 'Menunggu Approval', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      orderFilterStatus === st
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-rose-50/70 text-gray-700 hover:bg-rose-100'
                    }`}
                  >
                    {st} ({orders.filter(o => st === 'Semua' ? true : o.status === st).length})
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari No. Order, Nama, WhatsApp..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-rose-50/40 rounded-xl border border-rose-200"
                />
                <Search className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-rose-50/60 text-gray-800 font-bold uppercase text-[10px] tracking-wider border-b border-rose-100">
                    <tr>
                      <th className="py-3 px-4">No. Order & Tanggal</th>
                      <th className="py-3 px-4">Data Pelanggan</th>
                      <th className="py-3 px-4">Item Dipesan</th>
                      <th className="py-3 px-4">Total & Bayar</th>
                      <th className="py-3 px-4">Status & Resi</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {orders
                      .filter(o => {
                        const matchStatus = orderFilterStatus === 'Semua' || o.status === orderFilterStatus;
                        const matchQ = !orderSearch ||
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.phone.includes(orderSearch);
                        return matchStatus && matchQ;
                      })
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-gray-900 block">{o.id}</span>
                            <span className="text-[10px] text-gray-400">{formatDateTime(o.createdAt)}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 block">{o.customer.name}</span>
                            <span className="text-[11px] text-gray-500 font-mono">{o.customer.phone}</span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[150px]">{o.customer.city}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-800 block">
                              {o.items.reduce((s, i) => s + i.quantity, 0)} Pcs ({o.items.length} Model)
                            </span>
                            <span className="text-[10px] text-gray-500 line-clamp-1 truncate max-w-[180px]">
                              {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-rose-600 text-xs block">{formatRupiah(o.totalAmount)}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">
                              {o.paymentMethod} • {o.courier}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                o.status === 'Diproses'
                                  ? 'bg-purple-100 text-purple-800'
                                  : o.status === 'Dikirim'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : o.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'Menunggu Approval'
                                  ? 'bg-blue-100 text-blue-800'
                                  : o.status === 'Dibatalkan'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {o.status}
                            </span>
                            {o.trackingNumber && (
                              <span className="block text-[10px] font-mono text-gray-500 mt-0.5">
                                Resi: {o.trackingNumber}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {o.paymentProof && (
                                <button
                                  onClick={() => setViewingProofOrder(o)}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                  title="Lihat Bukti Transfer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedOrderDetails(o)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] transition-colors"
                              >
                                Kelola Status
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: APPROVAL BUKTI PEMBAYARAN */}
        {/* ========================================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  Antrean Approval Bukti Transfer Pelanggan
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  Terdapat <strong>{pendingApprovalsCount}</strong> pesanan yang menunggu verifikasi bukti transfer.
                </p>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 bg-white text-blue-700 rounded-xl text-xs font-semibold border border-blue-200 hover:bg-blue-50"
              >
                Cek Data Baru
              </button>
            </div>

            {pendingApprovalsCount === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-rose-100 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Semua Bukti Pembayaran Telah Di-Approve</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Tidak ada antrean approval saat ini. Ketika ada pelanggan yang mengunggah bukti transfer, akan otomatis muncul di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders
                  .filter(o => o.status === 'Menunggu Approval')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-bold text-sm text-gray-900 block">{order.id}</span>
                            <span className="text-[10px] text-gray-400">Dipesan: {formatDateTime(order.createdAt)}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            Menunggu Approval
                          </span>
                        </div>

                        {/* Customer & Total Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-gray-400 block text-[10px]">Pelanggan:</span>
                            <span className="font-semibold text-gray-800">{order.customer.name}</span>
                            <p className="text-[11px] text-gray-500">{order.customer.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">Total Harus Dibayar:</span>
                            <span className="font-bold text-rose-600 text-sm">{formatRupiah(order.totalAmount)}</span>
                            <p className="text-[10px] text-gray-500 uppercase">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Payment Proof Preview Box */}
                        {order.paymentProof && (
                          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
                            <img
                              src={order.paymentProof.imageUrl}
                              alt="Bukti Transfer"
                              onClick={() => setViewingProofOrder(order)}
                              className="w-16 h-20 object-cover rounded-lg bg-white border border-blue-200 cursor-pointer shadow-xs shrink-0"
                            />
                            <div className="text-xs space-y-0.5">
                              <span className="text-[10px] font-bold text-blue-900 uppercase">Informasi Transfer</span>
                              <p className="font-semibold text-gray-800">{order.paymentProof.senderBank}</p>
                              <p className="text-gray-600">a/n {order.paymentProof.senderName}</p>
                              <span className="text-[10px] text-gray-400 block">
                                Diunggah: {formatDateTime(order.paymentProof.uploadedAt)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Approval Action Buttons */}
                      <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => handleApprovePayment(order.id)}
                          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Setujui (Approve)</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectingOrder(order);
                            setRejectReason('Nominal transfer kurang / bukti tidak terbaca.');
                          }}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: DATA PELANGGAN */}
        {/* ========================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-5">
            {/* Customer Search & Overview */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Cari nama, WhatsApp, kota pelanggan..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-rose-50/40 rounded-xl border border-rose-200"
                />
                <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-2.5" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Total <strong>{customers.length}</strong> pelanggan terdaftar di database
              </span>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-rose-50/60 text-gray-800 font-bold uppercase text-[10px] tracking-wider border-b border-rose-100">
                    <tr>
                      <th className="py-3 px-4">Nama Pelanggan</th>
                      <th className="py-3 px-4">Kontak WhatsApp & Email</th>
                      <th className="py-3 px-4">Kota Pengiriman</th>
                      <th className="py-3 px-4 text-center">Total Order</th>
                      <th className="py-3 px-4">Total Belanja (LTV)</th>
                      <th className="py-3 px-4">Terakhir Belanja</th>
                      <th className="py-3 px-4 text-right">Hubungi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {customers
                      .filter(c => {
                        if (!customerSearch) return true;
                        const q = customerSearch.toLowerCase();
                        return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
                      })
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {c.name}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-gray-800 block">{c.phone}</span>
                            <span className="text-[10px] text-gray-400">{c.email || '-'}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {c.city}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-gray-800">
                            {c.totalOrders}x
                          </td>
                          <td className="py-3 px-4 font-bold text-rose-600">
                            {formatRupiah(c.totalSpent)}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-gray-500">
                            {formatDate(c.lastOrderDate)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Halo Kak ${c.name}, terima kasih telah berbelanja di Zahra Hijab Store!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200 transition-colors"
                            >
                              <span>Chat WA</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: LAPORAN SALES */}
        {/* ========================================== */}
        {activeTab === 'reports' && salesReport && (
          <div className="space-y-6">
            {/* Controls & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Periode:</span>
                <div className="flex items-center gap-1 bg-rose-50/70 p-1 rounded-xl border border-rose-100">
                  {[
                    { id: 'today', label: 'Hari Ini' },
                    { id: '7days', label: '7 Hari Terakhir' },
                    { id: '30days', label: '30 Hari' },
                    { id: 'all', label: 'Semua Waktu' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setReportTimeframe(p.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        reportTimeframe === p.id
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'text-gray-600 hover:text-rose-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePrintReport}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Print Laporan</span>
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-xs font-medium text-gray-500">Total Omset Penjualan</span>
                <p className="text-2xl font-bold text-rose-600 mt-1">
                  {formatRupiah(salesReport.totalRevenue)}
                </p>
                <span className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Transaksi Valid & Disetujui
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-xs font-medium text-gray-500">Total Transaksi Selesai</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {salesReport.totalCompletedOrders} Pesanan
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Pending: {salesReport.totalPendingOrders} Pesanan
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-xs font-medium text-gray-500">Rata-rata Nilai Order (AOV)</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatRupiah(salesReport.averageOrderValue)}
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">Per Keranjang Belanja</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-xs font-medium text-gray-500">Total Jilbab Terjual</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {salesReport.totalProductsSold} Helai
                </p>
                <span className="text-[11px] text-emerald-600 mt-1 block">Semua Kategori</span>
              </div>
            </div>

            {/* Daily Trend & Category Proportion */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Bar Chart */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-rose-100 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-500" />
                  Grafik Penjualan 7 Hari Terakhir
                </h4>

                <div className="pt-4 flex items-end justify-between gap-2 h-44 border-b border-rose-100 pb-2">
                  {salesReport.recentDailySales.map((day) => {
                    const maxRev = Math.max(...salesReport.recentDailySales.map(d => d.revenue), 100000);
                    const heightPercent = Math.min(100, Math.max(10, Math.round((day.revenue / maxRev) * 100)));

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[9px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatRupiah(day.revenue)}
                        </span>
                        <div
                          className="w-full max-w-[36px] bg-gradient-to-t from-rose-500 to-rose-300 rounded-t-lg transition-all group-hover:from-rose-600 group-hover:to-rose-400"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-gray-600 font-medium truncate">
                          {day.formattedDate.split(',')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Revenue Breakdown */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-rose-100 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Proporsi Omset per Kategori Hijab
                </h4>

                <div className="space-y-3 pt-2">
                  {(Object.entries(salesReport.salesByCategory) as [Category, number][]).map(([cat, rev]) => {
                    const totalRev = salesReport.totalRevenue || 1;
                    const percent = Math.round((rev / totalRev) * 100);

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-800">{cat}</span>
                          <span className="font-bold text-rose-600">{formatRupiah(rev)} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Best Selling Hijab Products */}
            <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Produk Hijab Terlaris (Top Selling)
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-rose-50/60 text-gray-800 font-bold uppercase text-[10px] tracking-wider border-b border-rose-100">
                    <tr>
                      <th className="py-2.5 px-3">Produk</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-center">Unit Terjual</th>
                      <th className="py-2.5 px-3 text-right">Total Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {salesReport.topProducts.map((p, idx) => (
                      <tr key={p.productId}>
                        <td className="py-2.5 px-3 font-semibold text-gray-900 flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <img src={p.imageUrl} className="w-8 h-10 object-cover rounded-md" />
                          <span>{p.productName}</span>
                        </td>
                        <td className="py-2.5 px-3">{p.category}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{p.unitsSold} Pcs</td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-600">{formatRupiah(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Tambah / Edit Produk */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-rose-100 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/70">
              <h3 className="font-serif-display font-bold text-base text-gray-900">
                {editingProduct.id ? 'Edit Data Produk & Stok' : 'Tambah Produk Jilbab Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 overflow-y-auto flex-1">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200"
                  placeholder="cth. Pashmina Ceruty Baby Doll"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={editingProduct.category || 'Pashmina'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                  >
                    <option value="Pashmina">Pashmina</option>
                    <option value="Bergo & Instan">Bergo & Instan</option>
                    <option value="Segi Empat">Segi Empat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Badge Produk</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                    placeholder="cth. Terlaris, Best Seller"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Harga Jual (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Stok Fisik Tersedia *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-rose-50/30 rounded-xl border border-rose-200 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Bahan Kain</label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                    placeholder="cth. Ceruty Armani / Voal Ultra"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Ukuran / Dimensi</label>
                  <input
                    type="text"
                    value={editingProduct.size || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                    placeholder="cth. 180 x 75 cm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-bold text-white shadow-xs"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Kelola Status Order & Resi */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-rose-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-mono">KELOLA STATUS ORDER</span>
                <h3 className="font-bold text-sm text-gray-900">{selectedOrderDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 bg-stone-50 p-3 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-500">Pelanggan:</span>
                <span className="font-bold text-gray-800">{selectedOrderDetails.customer.name} ({selectedOrderDetails.customer.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Belanja:</span>
                <span className="font-bold text-rose-600">{formatRupiah(selectedOrderDetails.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Saat Ini:</span>
                <span className="font-bold text-blue-700">{selectedOrderDetails.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Nomor Resi Pengiriman (Khusus status "Dikirim")
                </label>
                <input
                  type="text"
                  value={trackingInput || selectedOrderDetails.trackingNumber || ''}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="cth. JT9827103819 atau JNE12983719"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Catatan Riwayat (Opsional)
                </label>
                <input
                  type="text"
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  placeholder="cth. Paket diserahkan ke kurir J&T"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-rose-200"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-gray-700 block">Pilih Status Baru:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Diproses')}
                    className="p-2 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                  >
                    Set: Diproses
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Dikirim')}
                    className="p-2 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                  >
                    Set: Dikirim (+ Resi)
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Selesai')}
                    className="p-2 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  >
                    Set: Selesai
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, 'Dibatalkan')}
                    className="p-2 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                  >
                    Set: Dibatalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pratinjau Foto Bukti Transfer */}
      {viewingProofOrder && viewingProofOrder.paymentProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-rose-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-mono">BUKTI TRANSFER PELANGGAN</span>
                <h3 className="font-bold text-sm text-gray-900">{viewingProofOrder.id}</h3>
              </div>
              <button
                onClick={() => setViewingProofOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[380px] overflow-hidden rounded-2xl bg-black/5 flex items-center justify-center border border-gray-200">
              <img
                src={viewingProofOrder.paymentProof.imageUrl}
                alt="Bukti Transfer"
                className="max-h-[380px] w-auto object-contain"
              />
            </div>

            <div className="text-xs space-y-1 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Pengirim:</span>
                <span className="font-semibold">{viewingProofOrder.paymentProof.senderBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama Rekening Pengirim:</span>
                <span className="font-semibold">{viewingProofOrder.paymentProof.senderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nominal Tagihan:</span>
                <span className="font-bold text-rose-600">{formatRupiah(viewingProofOrder.totalAmount)}</span>
              </div>
            </div>

            {viewingProofOrder.status === 'Menunggu Approval' && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleApprovePayment(viewingProofOrder.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui Pembayaran</span>
                </button>
                <button
                  onClick={() => {
                    setRejectingOrder(viewingProofOrder);
                    setRejectReason('Nominal transfer kurang dari total belanja.');
                  }}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200"
                >
                  Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Input Alasan Penolakan Bukti Transfer */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-rose-100 p-6 space-y-4">
            <h3 className="font-bold text-sm text-red-950 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Tolak Bukti Transfer ({rejectingOrder.id})
            </h3>
            <p className="text-xs text-gray-600">
              Cantumkan catatan alasan penolakan agar pelanggan dapat memperbaikinya di menu Cek Status Order.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-red-50/40 rounded-xl border border-red-200 focus:outline-hidden"
                placeholder="cth. Nominal transfer kurang Rp 10.000 / Foto struk buram"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingOrder(null)}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleRejectPayment}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-bold text-white shadow-xs"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
