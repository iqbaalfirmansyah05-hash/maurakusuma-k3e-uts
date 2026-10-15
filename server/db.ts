import fs from 'fs';
import path from 'path';
import type { Product, Order, Customer, SalesReport, OrderStatus, Category, PaymentProof } from '../src/types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from './initialData.ts';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  lastUpdated: string;
}

const DATA_DIR = path.resolve('./data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class DatabaseManager {
  private data: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    this.data = {
      products: [],
      orders: [],
      customers: [],
      lastUpdated: new Date().toISOString()
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          orders: parsed.orders || INITIAL_ORDERS,
          customers: parsed.customers || INITIAL_CUSTOMERS,
          lastUpdated: parsed.lastUpdated || new Date().toISOString()
        };
      } else {
        // Seed default 12 products and sample orders
        this.data = {
          products: INITIAL_PRODUCTS,
          orders: INITIAL_ORDERS,
          customers: INITIAL_CUSTOMERS,
          lastUpdated: new Date().toISOString()
        };
        this.persist();
      }
      this.isInitialized = true;
    } catch (err) {
      console.error('Error initializing database, using initial data:', err);
      this.data = {
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
        customers: INITIAL_CUSTOMERS,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private persist() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public resetToDefaults() {
    this.data = {
      products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
      orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
      customers: JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)),
      lastUpdated: new Date().toISOString()
    };
    this.persist();
    return this.data;
  }

  // --- PRODUCTS ---
  public getProducts(category?: string, search?: string): Product[] {
    let result = [...this.data.products];
    if (category && category !== 'Semua') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newId = `${slug}-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...product,
      id: newId,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : this.data.products[index].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : this.data.products[index].stock
    };
    this.persist();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(status?: string, search?: string): Order[] {
    let result = [...this.data.orders];
    if (status && status !== 'Semua') {
      result = result.filter(o => o.status === status);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toUpperCase() === id.toUpperCase());
  }

  public createOrder(orderPayload: {
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
  }): Order {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${dateStr}-${randomCode}`;

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customer: orderPayload.customer,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      shippingCost: orderPayload.shippingCost,
      discount: orderPayload.discount,
      voucherCode: orderPayload.voucherCode,
      totalAmount: orderPayload.totalAmount,
      courier: orderPayload.courier,
      paymentMethod: orderPayload.paymentMethod,
      status: orderPayload.paymentProof ? 'Menunggu Approval' : 'Menunggu Pembayaran',
      paymentProof: orderPayload.paymentProof,
      statusHistory: [
        {
          status: 'Menunggu Pembayaran',
          timestamp: new Date().toISOString(),
          note: 'Pesanan baru dibuat via webstore'
        }
      ]
    };

    if (orderPayload.paymentProof) {
      newOrder.statusHistory?.push({
        status: 'Menunggu Approval',
        timestamp: new Date().toISOString(),
        note: `Bukti pembayaran bank ${orderPayload.paymentProof.senderBank} diunggah saat checkout`
      });
    }

    // Decrement stock for ordered items
    for (const item of orderPayload.items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    // Update or create customer record
    this.recordCustomerTransaction(orderPayload.customer, orderPayload.totalAmount);

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public uploadPaymentProof(orderId: string, proof: PaymentProof): Order | null {
    const order = this.data.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (!order) return null;

    order.paymentProof = {
      ...proof,
      uploadedAt: new Date().toISOString()
    };
    order.status = 'Menunggu Approval';
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: 'Menunggu Approval',
      timestamp: new Date().toISOString(),
      note: `Bukti transfer ${proof.senderBank} atas nama ${proof.senderName} berhasil dikirim`
    });

    this.persist();
    return order;
  }

  public approvePayment(orderId: string, adminName = 'Admin Zahra'): Order | null {
    const order = this.data.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (!order) return null;

    order.status = 'Diproses';
    if (order.paymentProof) {
      order.paymentProof.approvedAt = new Date().toISOString();
      order.paymentProof.approvedBy = adminName;
    }
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: 'Diproses',
      timestamp: new Date().toISOString(),
      note: `Bukti pembayaran diverifikasi oleh ${adminName}. Pesanan disiapkan.`
    });

    this.persist();
    return order;
  }

  public rejectPayment(orderId: string, reason: string): Order | null {
    const order = this.data.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (!order) return null;

    order.status = 'Menunggu Pembayaran';
    if (order.paymentProof) {
      order.paymentProof.rejectedAt = new Date().toISOString();
      order.paymentProof.rejectionReason = reason;
    }
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: 'Menunggu Pembayaran',
      timestamp: new Date().toISOString(),
      note: `Bukti pembayaran ditolak: "${reason}". Silakan upload bukti yang valid.`
    });

    this.persist();
    return order;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (!order) return null;

    const previousStatus = order.status;
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    // If order was cancelled, restore stock
    if (status === 'Dibatalkan' && previousStatus !== 'Dibatalkan') {
      for (const item of order.items) {
        const prod = this.data.products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
        }
      }
    }

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || (trackingNumber ? `Status diubah ke ${status} (No. Resi: ${trackingNumber})` : `Status diubah ke ${status}`)
    });

    this.persist();
    return order;
  }

  // --- CUSTOMERS ---
  private recordCustomerTransaction(customerInfo: Order['customer'], amount: number) {
    const cleanPhone = customerInfo.phone.replace(/[^0-9]/g, '');
    let customer = this.data.customers.find(c => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

    const now = new Date().toISOString();
    if (customer) {
      customer.name = customerInfo.name;
      customer.email = customerInfo.email || customer.email;
      customer.address = customerInfo.address;
      customer.city = customerInfo.city;
      customer.totalOrders += 1;
      customer.totalSpent += amount;
      customer.lastOrderDate = now;
    } else {
      customer = {
        id: `CUST-${cleanPhone || Date.now()}`,
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        totalOrders: 1,
        totalSpent: amount,
        firstOrderDate: now,
        lastOrderDate: now
      };
      this.data.customers.unshift(customer);
    }
  }

  public getCustomers(search?: string): Customer[] {
    let result = [...this.data.customers];
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
  }

  // --- SALES REPORT ---
  public getSalesReport(timeframe: 'all' | '30days' | '7days' | 'today' = 'all'): SalesReport {
    const now = new Date();
    let filterDate = new Date(0);

    if (timeframe === 'today') {
      filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (timeframe === '7days') {
      filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === '30days') {
      filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredOrders = this.data.orders.filter(o => new Date(o.createdAt) >= filterDate);
    const validOrders = filteredOrders.filter(o => o.status !== 'Dibatalkan' && o.status !== 'Menunggu Pembayaran');

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCompletedOrders = filteredOrders.filter(o => o.status === 'Selesai' || o.status === 'Dikirim' || o.status === 'Diproses').length;
    const totalPendingOrders = filteredOrders.filter(o => o.status === 'Menunggu Approval' || o.status === 'Menunggu Pembayaran').length;

    let totalProductsSold = 0;
    const productSalesMap: Record<string, { name: string; category: string; units: number; revenue: number; imageUrl: string }> = {};
    const categoryRevenueMap: Record<Category, number> = {
      'Pashmina': 0,
      'Bergo & Instan': 0,
      'Segi Empat': 0
    };

    for (const order of validOrders) {
      for (const item of order.items) {
        totalProductsSold += item.quantity;
        const cat = (item.category as Category) || 'Pashmina';
        if (categoryRevenueMap[cat] !== undefined) {
          categoryRevenueMap[cat] += item.price * item.quantity;
        }

        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            category: item.category,
            units: 0,
            revenue: 0,
            imageUrl: item.imageUrl
          };
        }
        productSalesMap[item.productId].units += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      }
    }

    const topProducts = Object.entries(productSalesMap)
      .map(([id, info]) => ({
        productId: id,
        productName: info.name,
        category: info.category,
        unitsSold: info.units,
        revenue: info.revenue,
        imageUrl: info.imageUrl
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Group sales by day for recent 7 days
    const dailyMap: Record<string, { revenue: number; orderCount: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { revenue: 0, orderCount: 0 };
    }

    for (const order of validOrders) {
      const dayKey = order.createdAt.slice(0, 10);
      if (dailyMap[dayKey]) {
        dailyMap[dayKey].revenue += order.totalAmount;
        dailyMap[dayKey].orderCount += 1;
      }
    }

    const recentDailySales = Object.entries(dailyMap).map(([date, val]) => {
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      return {
        date,
        formattedDate,
        revenue: val.revenue,
        orderCount: val.orderCount
      };
    });

    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    return {
      totalRevenue,
      totalCompletedOrders,
      totalPendingOrders,
      totalProductsSold,
      averageOrderValue,
      salesByCategory: categoryRevenueMap,
      topProducts,
      recentDailySales
    };
  }
}

export const db = new DatabaseManager();
