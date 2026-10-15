import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with 20MB limit to handle image / receipt uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logger for development insight
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// --- API ROUTES ---

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Zahra Hijab & Pashmina Store',
    timestamp: new Date().toISOString()
  });
});

// 2. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Default demo credentials
  if (
    (email === 'admin@zahrahijab.id' || email === 'admin') &&
    password === 'admin123'
  ) {
    return res.json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'Ustadzah Siti Aminah (Owner)',
        email: 'admin@zahrahijab.id',
        role: 'superadmin'
      },
      token: 'zahra-hijab-admin-jwt-token-2026'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Email atau password admin salah. Gunakan admin@zahrahijab.id / admin123'
  });
});

// 3. Products Endpoints
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const products = db.getProducts(category as string, search as string);
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const { name, category, price, stock, description, material, size, colors, imageUrl, badge } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Data produk tidak lengkap' });
    }
    const newProduct = db.addProduct({
      name,
      category,
      price: Number(price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
      stock: Number(stock) || 0,
      description: description || '',
      material: material || 'Premium Hijab Fabric',
      size: size || 'Standard',
      rating: 5.0,
      reviewCount: 0,
      colors: Array.isArray(colors) && colors.length > 0 ? colors : [
        { name: 'Pastel Rose', hex: '#F4B6C2', inStock: true },
        { name: 'Sage Soft', hex: '#B2D2B0', inStock: true }
      ],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      badge: badge || 'New'
    });
    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    res.json({ success: true, message: 'Produk dan stok berhasil diperbarui', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Orders Endpoints
app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const orders = db.getOrders(status as string, search as string);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, subtotal, shippingCost, discount, voucherCode, totalAmount, courier, paymentMethod, paymentProof } = req.body;
    if (!customer || !items || !items.length || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Formulir order tidak lengkap' });
    }

    const order = db.createOrder({
      customer,
      items,
      subtotal: Number(subtotal),
      shippingCost: Number(shippingCost) || 0,
      discount: Number(discount) || 0,
      voucherCode,
      totalAmount: Number(totalAmount),
      courier: courier || 'J&T Express',
      paymentMethod: paymentMethod || 'bca',
      paymentProof
    });

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload Bukti Pembayaran dari Pelanggan
app.post('/api/orders/:id/payment-proof', (req: Request, res: Response) => {
  try {
    const { imageUrl, senderBank, senderName, accountNumber, transferAmount, notes } = req.body;
    if (!imageUrl || !senderBank || !senderName) {
      return res.status(400).json({ success: false, message: 'Foto bukti dan nama pengirim wajib diisi' });
    }

    const order = db.uploadPaymentProof(req.params.id, {
      imageUrl,
      senderBank,
      senderName,
      accountNumber,
      transferAmount: Number(transferAmount) || 0,
      notes,
      uploadedAt: new Date().toISOString()
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.json({ success: true, message: 'Bukti pembayaran berhasil diunggah! Menunggu approval admin.', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approval Bukti Pembayaran oleh Admin
app.post('/api/orders/:id/approve', (req: Request, res: Response) => {
  try {
    const { adminName } = req.body;
    const order = db.approvePayment(req.params.id, adminName || 'Admin Zahra');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Bukti pembayaran disetujui! Pesanan kini siap diproses.', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Tolak Bukti Pembayaran oleh Admin
app.post('/api/orders/:id/reject', (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Alasan penolakan wajib dicantumkan' });
    }
    const order = db.rejectPayment(req.params.id, reason);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Bukti pembayaran ditolak dengan catatan untuk pelanggan.', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Status Order & Input No. Resi
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status wajib ditentukan' });
    }
    const order = db.updateOrderStatus(req.params.id, status, trackingNumber, note);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }
    res.json({ success: true, message: `Status pesanan berhasil diubah menjadi ${status}`, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Customers Endpoint
app.get('/api/customers', (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const customers = db.getCustomers(search as string);
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Sales Report Endpoint
app.get('/api/reports/sales', (req: Request, res: Response) => {
  try {
    const { timeframe } = req.query;
    const report = db.getSalesReport((timeframe as any) || 'all');
    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Reset Database Endpoint (useful for demo/testing)
app.post('/api/database/reset', (req: Request, res: Response) => {
  try {
    const data = db.resetToDefaults();
    res.json({
      success: true,
      message: 'Database berhasil di-reset ke 12 produk awal dan contoh pesanan.',
      productsCount: data.products.length,
      ordersCount: data.orders.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  const distExists = fs.existsSync(path.resolve('./dist/index.html'));
  const isProd = process.env.NODE_ENV === 'production' || (distExists && process.env.NODE_ENV !== 'development');

  if (isProd && distExists) {
    console.log('📦 Serving production build from ./dist');
    app.use(express.static(path.resolve('./dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('./dist/index.html'));
    });
  } else {
    console.log('⚡ Starting in Vite middleware development mode');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌸 Zahra Hijab & Pashmina Store server is running on port ${PORT}`);
  });
}

startServer();
