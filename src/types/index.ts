export type Category = 'Pashmina' | 'Bergo & Instan' | 'Segi Empat';

export interface ColorVariant {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  material: string;
  size: string;
  rating: number;
  reviewCount: number;
  colors: ColorVariant[];
  imageUrl: string;
  badge?: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  category: Category;
  selectedColor: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
}

export type OrderStatus =
  | 'Menunggu Pembayaran'
  | 'Menunggu Approval'
  | 'Diproses'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan';

export interface PaymentProof {
  imageUrl: string; // Base64 data URL or external URL
  senderBank: string;
  senderName: string;
  accountNumber?: string;
  transferAmount: number;
  notes?: string;
  uploadedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  color: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  voucherCode?: string;
  totalAmount: number;
  courier: string;
  paymentMethod: 'bca' | 'mandiri' | 'bri' | 'qris';
  status: OrderStatus;
  paymentProof?: PaymentProof;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
}

export interface SalesReport {
  totalRevenue: number;
  totalCompletedOrders: number;
  totalPendingOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  salesByCategory: Record<Category, number>;
  topProducts: Array<{
    productId: string;
    productName: string;
    category: string;
    unitsSold: number;
    revenue: number;
    imageUrl: string;
  }>;
  recentDailySales: Array<{
    date: string;
    formattedDate: string;
    revenue: number;
    orderCount: number;
  }>;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}
