/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Product, CartItem, Category, Order } from './types';
import { api } from './services/api';

export default function App() {
  // Products & Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Wishlist / Favorites State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zahra_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zahra_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Customer Tracking Modal State
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialOrderId, setTrackingInitialOrderId] = useState('');

  // Admin Panel & Auth State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      const saved = sessionStorage.getItem('zahra_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zahra_wishlist', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zahra_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Load products from real database
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await api.getProducts(selectedCategory, searchQuery);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products from database:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Cart Management
  const handleAddToCart = (product: Product, selectedColor: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            category: product.category,
            selectedColor,
            price: product.price,
            quantity: Math.min(product.stock, quantity),
            imageUrl: product.imageUrl,
            maxStock: product.stock
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, selectedColor);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.selectedColor === selectedColor) {
          return { ...item, quantity: Math.min(item.maxStock, newQty) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, selectedColor: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.productId === productId && item.selectedColor === selectedColor))
    );
  };

  const handleProceedToCheckout = (voucher: any) => {
    setAppliedVoucher(voucher);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    // Clear cart
    setCartItems([]);
    setAppliedVoucher(null);
    // Refresh products so stock updates
    fetchProducts();
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev =>
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
  };

  const handleAddToCartFromWishlist = (product: Product) => {
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default';
    handleAddToCart(product, defaultColor, 1);
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Admin Auth Handlers
  const handleOpenAdmin = () => {
    if (adminUser) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user: any) => {
    setAdminUser(user);
    sessionStorage.setItem('zahra_admin', JSON.stringify(user));
    setIsAdminPanelOpen(true);
  };

  const handleLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('zahra_admin');
    setIsAdminPanelOpen(false);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fdfaf8] text-gray-800 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* 1. Header & Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenTracking={() => {
          setTrackingInitialOrderId('');
          setIsTrackingOpen(true);
        }}
        isAdminLoggedIn={!!adminUser}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* 2. Hero Banner (Pastel Aesthetic & Category Highlights) */}
      <HeroBanner
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Product Catalog Grid (12 Products in 3 Categories) */}
      <main className="flex-1">
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProduct={(product) => setSelectedProductDetail(product)}
          onAddToCart={(product, color) => handleAddToCart(product, color, 1)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          isLoading={isLoadingProducts}
          onRefresh={fetchProducts}
        />
      </main>

      {/* 4. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
        onOpenTracking={() => {
          setTrackingInitialOrderId('');
          setIsTrackingOpen(true);
        }}
      />

      {/* 5. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={(product, color, qty) => handleAddToCart(product, color, qty)}
        isWishlisted={selectedProductDetail ? wishlistIds.includes(selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 6. Wishlist / Favorites Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCartFromWishlist={handleAddToCartFromWishlist}
        onClearWishlist={handleClearWishlist}
      />

      {/* 7. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 7. Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 8. Order Status Tracking Modal */}
      <OrderStatusModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingInitialOrderId}
      />

      {/* 9. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 10. Admin Panel (Full Dashboard) */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          onLogout={handleLogout}
          currentUser={adminUser}
          onDataChanged={() => fetchProducts()}
        />
      )}
    </div>
  );
}
