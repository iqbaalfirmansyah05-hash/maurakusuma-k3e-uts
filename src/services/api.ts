import { Product, Order, Customer, SalesReport, Category, OrderStatus, PaymentProof } from '../types';

export const api = {
  // Products
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`/api/products?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal memuat produk');
    return json.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Produk tidak ditemukan');
    return json.data;
  },

  async createProduct(product: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal menambah produk');
    return json.data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal mengupdate produk');
    return json.data;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal menghapus produk');
    return true;
  },

  // Orders
  async getOrders(status?: string, search?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status && status !== 'Semua') params.append('status', status);
    if (search) params.append('search', search);

    const res = await fetch(`/api/orders?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal memuat pesanan');
    return json.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Pesanan tidak ditemukan');
    return json.data;
  },

  async createOrder(payload: {
    customer: Order['customer'];
    items: Order['items'];
    subtotal: number;
    shippingCost: number;
    discount: number;
    voucherCode?: string;
    totalAmount: number;
    courier: string;
    paymentMethod: Order['paymentMethod'];
    paymentProof?: PaymentProof;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal membuat pesanan');
    return json.data;
  },

  async uploadPaymentProof(orderId: string, proof: PaymentProof): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/payment-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proof)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal mengunggah bukti transfer');
    return json.data;
  },

  async approvePayment(orderId: string, adminName: string = 'Admin Zahra'): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminName })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal menyetujui bukti pembayaran');
    return json.data;
  },

  async rejectPayment(orderId: string, reason: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal menolak bukti transfer');
    return json.data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, note?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber, note })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal memperbarui status order');
    return json.data;
  },

  // Customers
  async getCustomers(search?: string): Promise<Customer[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const res = await fetch(`/api/customers?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal memuat pelanggan');
    return json.data;
  },

  // Reports
  async getSalesReport(timeframe: 'all' | '30days' | '7days' | 'today' = 'all'): Promise<SalesReport> {
    const res = await fetch(`/api/reports/sales?timeframe=${timeframe}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Gagal memuat laporan sales');
    return json.data;
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{ success: boolean; user?: any; token?: string; message?: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  // Reset demo
  async resetDatabase(): Promise<any> {
    const res = await fetch('/api/database/reset', { method: 'POST' });
    return await res.json();
  }
};
