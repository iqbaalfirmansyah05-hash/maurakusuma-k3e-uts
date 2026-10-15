import type { Product, Order, Customer } from '../src/types/index.ts';

export const INITIAL_PRODUCTS: Product[] = [
  // --- KATEGORI 1: PASHMINA (4 Produk) ---
  {
    id: 'pash-ceruty-babydoll',
    name: 'Pashmina Ceruty Baby Doll Premium Armani',
    category: 'Pashmina',
    price: 45000,
    originalPrice: 65000,
    stock: 48,
    description: 'Pashmina bertekstur pasir lembut khas ceruty Armani original. Bahan flowy, adem, sangat mudah dibentuk dahi tegak tanpa letoy, jahitan tepi jahit kelim rapi kualitas butik.',
    material: 'Ceruty Baby Doll Armani Super Soft',
    size: '180 x 75 cm',
    rating: 4.9,
    reviewCount: 342,
    badge: 'Terlaris',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Dusty Pink Pastel', hex: '#F4B6C2', inStock: true },
      { name: 'Sage Green Soft', hex: '#B2D2B0', inStock: true },
      { name: 'Nude Almond', hex: '#DEC1AB', inStock: true },
      { name: 'Lilac Mist', hex: '#D8B4E2', inStock: true },
      { name: 'Buttercream Oat', hex: '#F9F1D8', inStock: true },
    ]
  },
  {
    id: 'pash-silk-plisket',
    name: 'Pashmina Silk Plisket Lidi Luxury Doff',
    category: 'Pashmina',
    price: 58000,
    originalPrice: 79000,
    stock: 35,
    description: 'Pashmina plisket lidi rapat tanpa lipatan tengah (full lidi). Kilau doff silk mewah yang tidak licin, tidak perlu disetrika, anti-kusut dan memberikan kesan jenjang serta elegan.',
    material: 'Heavy Silk Chiffon Pleated',
    size: '175 x 75 cm',
    rating: 4.8,
    reviewCount: 218,
    badge: 'Best Seller',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Rose Gold Shimmer', hex: '#E7B2A5', inStock: true },
      { name: 'Champagne Cream', hex: '#F6E6D3', inStock: true },
      { name: 'Soft Lavender', hex: '#CAB8D9', inStock: true },
      { name: 'Mocha Mauve', hex: '#A88D83', inStock: true },
    ]
  },
  {
    id: 'pash-shimmer-silk',
    name: 'Pashmina Shimmer Silk Organza Glamour',
    category: 'Pashmina',
    price: 65000,
    originalPrice: 89000,
    stock: 22,
    description: 'Sentuhan kilau mewah memikat saat terkena cahaya. Bagian luar berkilau elegan, bagian dalam bertekstur matte sehingga nyaman di kepala dan tidak mudah merosot saat dipakai kondangan atau wisuda.',
    material: 'Luxury Shimmer Silk Crepe',
    size: '180 x 75 cm',
    rating: 4.9,
    reviewCount: 189,
    badge: 'Favorit Pesta',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Pearl Blush', hex: '#F8D7DA', inStock: true },
      { name: 'Silver Sky Pastel', hex: '#D1DCE5', inStock: true },
      { name: 'Rose Taupe', hex: '#CBB2AC', inStock: true },
      { name: 'Golden Honey', hex: '#EED9B3', inStock: false },
    ]
  },
  {
    id: 'pash-jersey-flowy',
    name: 'Pashmina Jersey Premium Flowy Anti-Pentul',
    category: 'Pashmina',
    price: 49000,
    originalPrice: 60000,
    stock: 40,
    description: 'Pashmina berbahan jersey spandex rayon super adem, jatuh, dan fleksibel. Menempel pas di kepala tanpa butuh banyak peniti atau jarum pentul. Nyaman untuk aktivitas harian dari pagi sampai malam.',
    material: 'High-Grade Rayon Spandex Jersey',
    size: '180 x 80 cm',
    rating: 4.9,
    reviewCount: 290,
    badge: 'Anti Ribet',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Matcha Soft', hex: '#BDD2A6', inStock: true },
      { name: 'Cotton Candy', hex: '#FAD2E1', inStock: true },
      { name: 'Caramel Latte', hex: '#CDB4A2', inStock: true },
      { name: 'Cloud Grey', hex: '#E0E3E8', inStock: true },
    ]
  },

  // --- KATEGORI 2: BERGO & INSTAN (4 Produk) ---
  {
    id: 'bergo-maryam-crepe',
    name: 'Bergo Maryam Diamond Crepe Non-Pet Tali',
    category: 'Bergo & Instan',
    price: 35000,
    originalPrice: 48000,
    stock: 60,
    description: 'Bergo harian favorit muslimah sejuta umat! Dilengkapi tali ikat belakang praktis. Bahan Diamond Italiano bertekstur stretch halus, ringan, tidak panas, dan menutup dada dengan syari anggun.',
    material: 'Original Diamond Italiano Crepe',
    size: 'Depan 75 cm / Belakang 85 cm',
    rating: 4.8,
    reviewCount: 520,
    badge: 'Paling Laris',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Peach Salmon', hex: '#FFBEA3', inStock: true },
      { name: 'Avocado Milk', hex: '#CFE0C3', inStock: true },
      { name: 'Baby Pink', hex: '#FADBE2', inStock: true },
      { name: 'Soft Mocca', hex: '#B89B88', inStock: true },
      { name: 'Broken White', hex: '#FAF9F6', inStock: true },
    ]
  },
  {
    id: 'bergo-sport-airflow',
    name: 'Bergo Sport Jersey Airflow Pet Antem Active',
    category: 'Bergo & Instan',
    price: 32000,
    originalPrice: 45000,
    stock: 55,
    description: 'Jilbab instan khusus olahraga (gym, jogging, cycling) atau santai di rumah. Dilengkapi pet mini anti-tembem yang kokoh, bahan cepat kering, adem, dan pori-pori sirkulasi udara maksimal.',
    material: 'Dry-Fit Airflow Jersey Knit',
    size: 'Depan 65 cm / Belakang 75 cm',
    rating: 4.9,
    reviewCount: 310,
    badge: 'Olahraga',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Lilac Soft', hex: '#DDD0E8', inStock: true },
      { name: 'Sage Mint', hex: '#A3C9A8', inStock: true },
      { name: 'Coral Rose', hex: '#F2A6A6', inStock: true },
      { name: 'Oatmeal Natural', hex: '#EAE1D2', inStock: true },
    ]
  },
  {
    id: 'pashmina-instan-inner',
    name: 'Pashmina Instan 2-in-1 Inner Ninja Rayon',
    category: 'Bergo & Instan',
    price: 55000,
    originalPrice: 75000,
    stock: 30,
    description: 'Inovasi pashmina instan yang langsung menyatu dengan inner ninja ciput rayon premium. Hanya butuh 3 detik pakai tanpa ribet pasang jarum atau ciput terpisah. Lubang telinga ergonomis untuk kacamata dan masker.',
    material: 'Ceruty Babydoll + Inner Rayon Kaos Super',
    size: '180 x 75 cm + Inner Ninja',
    rating: 5.0,
    reviewCount: 412,
    badge: 'Produk Baru',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Nude Warmth', hex: '#D7B49E', inStock: true },
      { name: 'Dusty Rose', hex: '#E29578', inStock: true },
      { name: 'Soft Olive', hex: '#B5C49C', inStock: true },
      { name: 'Lavender Gray', hex: '#C2B9D2', inStock: true },
    ]
  },
  {
    id: 'bergo-hamidah-daily',
    name: 'Bergo Hamidah Daily Soft Pet Busa Antem',
    category: 'Bergo & Instan',
    price: 38000,
    originalPrice: 50000,
    stock: 45,
    description: 'Bergo berpet busa fleksibel anti penyok yang membuat pipi tampak tirus natural. Bahan jersey tebal jatuh dan tidak terawang. Cutting oval anggun menutup dada sempurna.',
    material: 'Premium Jersey Spandek Soft',
    size: 'Depan 70 cm / Belakang 80 cm',
    rating: 4.8,
    reviewCount: 265,
    badge: 'Daily Nyaman',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Cream Vanilla', hex: '#F7E7CE', inStock: true },
      { name: 'Pastel Pistachio', hex: '#C8D6AF', inStock: true },
      { name: 'Blush Velvet', hex: '#F0B7B3', inStock: true },
      { name: 'Smoky Mauve', hex: '#B29DA0', inStock: true },
    ]
  },

  // --- KATEGORI 3: SEGI EMPAT (4 Produk) ---
  {
    id: 'segi4-paris-premium',
    name: 'Segi Empat Paris Premium Voal Japan Authentic',
    category: 'Segi Empat',
    price: 42000,
    originalPrice: 59000,
    stock: 50,
    description: 'Hijab segi empat Paris Japan original berlabel Red Rose. Tegak melengkung sempurna di dahi tanpa semprotan hairspray, serat padat, adem dipakai seharian, jahitan neci butik rapat.',
    material: 'Paris Cotton Voal Japan Quality',
    size: '115 x 115 cm',
    rating: 4.9,
    reviewCount: 680,
    badge: 'Wajib Punya',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Pastel Blush', hex: '#FAD4D8', inStock: true },
      { name: 'Sage Celadon', hex: '#BCE3C5', inStock: true },
      { name: 'Almond Biscuit', hex: '#E3CBB3', inStock: true },
      { name: 'Lilac Whisper', hex: '#E4D7F5', inStock: true },
      { name: 'Broken White Pure', hex: '#FDFBF7', inStock: true },
    ]
  },
  {
    id: 'segi4-bella-square',
    name: 'Segi Empat Bella Square Polycotton Halus',
    category: 'Segi Empat',
    price: 25000,
    originalPrice: 35000,
    stock: 80,
    description: 'Jilbab segi empat polycotton double hycon super lembut dan tidak licin. Sangat mudah diatur, ringan, adem, dan merupakan pilihan utama untuk kuliah, sekolah, maupun kerja harian.',
    material: 'Double Hycon Polycotton Superfine',
    size: '115 x 115 cm',
    rating: 4.8,
    reviewCount: 940,
    badge: 'Super Hemat',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Rose Nude', hex: '#F3C5BA', inStock: true },
      { name: 'Soft Mint', hex: '#C2E8CE', inStock: true },
      { name: 'Milky Peach', hex: '#FFDFBA', inStock: true },
      { name: 'Taro Ice', hex: '#D5C6E0', inStock: true },
      { name: 'Milo Cream', hex: '#C4A482', inStock: true },
    ]
  },
  {
    id: 'segi4-voal-motif-botanica',
    name: 'Segi Empat Voal Motif Watercolor Pastel Botanica',
    category: 'Segi Empat',
    price: 68000,
    originalPrice: 95000,
    stock: 28,
    description: 'Motif floral bunga mekar watercolor bernuansa pastel cerah eksklusif Zahra Hijab. Dicetak dengan digital print resolusi tinggi pada kain Voal Watersplash yang anti cipratan air dan tegak paripurna.',
    material: 'Voal Watersplash Sublim Digital Print',
    size: '115 x 115 cm',
    rating: 4.9,
    reviewCount: 156,
    badge: 'Limited Edition',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Botanica Blush Pink', hex: '#F4B0B7', inStock: true },
      { name: 'Botanica Sage Mist', hex: '#B8D5B8', inStock: true },
      { name: 'Botanica Lavender Sky', hex: '#D0C3E8', inStock: true },
      { name: 'Botanica Peach Blossom', hex: '#F7C9A9', inStock: true },
    ]
  },
  {
    id: 'segi4-voal-miracle-lasercut',
    name: 'Segi Empat Voal Miracle Finishing Laser Cut Wave',
    category: 'Segi Empat',
    price: 49000,
    originalPrice: 65000,
    stock: 38,
    description: 'Kain voal miracle grade A dengan finishing tepian laser cut bermotif gelombang anggun dan presisi tinggi. Tanpa benang bertiras, look lebih clean, mewah, dan serasi untuk outfit formal maupun casual.',
    material: 'Ultrafine Voal Miracle + Laser Cut Edge',
    size: '115 x 115 cm',
    rating: 4.9,
    reviewCount: 204,
    badge: 'Laser Cut',
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Soft Cinnamon', hex: '#D2AB99', inStock: true },
      { name: 'Rosewater', hex: '#EBBAB9', inStock: true },
      { name: 'Sage Meadow', hex: '#9BB899', inStock: true },
      { name: 'Cloudy Lilac', hex: '#CDBBD7', inStock: true },
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-20261014-7291',
    createdAt: '2026-10-14T08:30:00.000Z',
    customer: {
      name: 'Aisyah Putri Rahmawati',
      phone: '081234567890',
      email: 'aisyah.putri@gmail.com',
      address: 'Jl. Melati No. 45, RT 03 / RW 07, Sukajadi',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40161',
      notes: 'Mohon dibungkus plastik rangkap ya kak, makasih banyak!'
    },
    items: [
      {
        productId: 'pash-ceruty-babydoll',
        productName: 'Pashmina Ceruty Baby Doll Premium Armani',
        category: 'Pashmina',
        color: 'Dusty Pink Pastel',
        price: 45000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'segi4-paris-premium',
        productName: 'Segi Empat Paris Premium Voal Japan Authentic',
        category: 'Segi Empat',
        color: 'Sage Celadon',
        price: 42000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 132000,
    shippingCost: 10000,
    discount: 13200,
    voucherCode: 'PASTELCANTIK',
    totalAmount: 128800,
    courier: 'J&T Express',
    paymentMethod: 'bca',
    status: 'Menunggu Approval',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      senderBank: 'BCA (Bank Central Asia)',
      senderName: 'Aisyah Putri Rahmawati',
      accountNumber: '8291038472',
      transferAmount: 128800,
      notes: 'Transfer via BCA Mobile m-Banking, sudah pas Rp 128.800',
      uploadedAt: '2026-10-14T09:15:00.000Z'
    },
    statusHistory: [
      { status: 'Menunggu Pembayaran', timestamp: '2026-10-14T08:30:00.000Z', note: 'Pesanan dibuat oleh pelanggan' },
      { status: 'Menunggu Approval', timestamp: '2026-10-14T09:15:00.000Z', note: 'Bukti transfer BCA berhasil diunggah' }
    ]
  },
  {
    id: 'ORD-20261013-4102',
    createdAt: '2026-10-13T14:20:00.000Z',
    customer: {
      name: 'Nabila Khairunnisa',
      phone: '085799881122',
      email: 'nabila.khairun@gmail.com',
      address: 'Perumahan Griya Indah Blok C3 No. 12, Sleman',
      city: 'Yogyakarta',
      province: 'DI Yogyakarta',
      postalCode: '55281',
      notes: 'Warna jangan sampai ketukar ya'
    },
    items: [
      {
        productId: 'pashmina-instan-inner',
        productName: 'Pashmina Instan 2-in-1 Inner Ninja Rayon',
        category: 'Bergo & Instan',
        color: 'Nude Warmth',
        price: 55000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'bergo-maryam-crepe',
        productName: 'Bergo Maryam Diamond Crepe Non-Pet Tali',
        category: 'Bergo & Instan',
        color: 'Peach Salmon',
        price: 35000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 145000,
    shippingCost: 12000,
    discount: 0,
    totalAmount: 157000,
    courier: 'SiCepat',
    paymentMethod: 'qris',
    status: 'Diproses',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
      senderBank: 'QRIS Gopay',
      senderName: 'Nabila Khairunnisa',
      transferAmount: 157000,
      uploadedAt: '2026-10-13T14:25:00.000Z',
      approvedAt: '2026-10-13T15:10:00.000Z',
      approvedBy: 'Admin Zahra'
    },
    statusHistory: [
      { status: 'Menunggu Pembayaran', timestamp: '2026-10-13T14:20:00.000Z' },
      { status: 'Menunggu Approval', timestamp: '2026-10-13T14:25:00.000Z' },
      { status: 'Diproses', timestamp: '2026-10-13T15:10:00.000Z', note: 'Pembayaran QRIS diverifikasi' }
    ]
  },
  {
    id: 'ORD-20261012-9851',
    createdAt: '2026-10-12T11:00:00.000Z',
    customer: {
      name: 'Fathimah Zahro',
      phone: '081398765432',
      email: 'fathimah.zahro@gmail.com',
      address: 'Jl. Tebet Barat Dalam VII No. 18',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12810',
    },
    items: [
      {
        productId: 'segi4-voal-motif-botanica',
        productName: 'Segi Empat Voal Motif Watercolor Pastel Botanica',
        category: 'Segi Empat',
        color: 'Botanica Blush Pink',
        price: 68000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'pash-silk-plisket',
        productName: 'Pashmina Silk Plisket Lidi Luxury Doff',
        category: 'Pashmina',
        color: 'Champagne Cream',
        price: 58000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 126000,
    shippingCost: 9000,
    discount: 10000,
    totalAmount: 125000,
    courier: 'JNE Reguler',
    paymentMethod: 'mandiri',
    status: 'Dikirim',
    trackingNumber: 'JNE88921049281',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      senderBank: 'Mandiri Livin',
      senderName: 'Fathimah Zahro',
      transferAmount: 125000,
      uploadedAt: '2026-10-12T11:45:00.000Z',
      approvedAt: '2026-10-12T12:00:00.000Z',
      approvedBy: 'Admin Zahra'
    },
    statusHistory: [
      { status: 'Menunggu Pembayaran', timestamp: '2026-10-12T11:00:00.000Z' },
      { status: 'Diproses', timestamp: '2026-10-12T12:00:00.000Z' },
      { status: 'Dikirim', timestamp: '2026-10-12T16:30:00.000Z', note: 'No Resi: JNE88921049281' }
    ]
  },
  {
    id: 'ORD-20261011-3319',
    createdAt: '2026-10-11T09:10:00.000Z',
    customer: {
      name: 'Salma Salsabila',
      phone: '087811223344',
      email: 'salma.salsa@yahoo.com',
      address: 'Jl. Riau No. 88, Tampan',
      city: 'Pekanbaru',
      province: 'Riau',
      postalCode: '28292',
    },
    items: [
      {
        productId: 'segi4-bella-square',
        productName: 'Segi Empat Bella Square Polycotton Halus',
        category: 'Segi Empat',
        color: 'Rose Nude',
        price: 25000,
        quantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'pash-ceruty-babydoll',
        productName: 'Pashmina Ceruty Baby Doll Premium Armani',
        category: 'Pashmina',
        color: 'Sage Green Soft',
        price: 45000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 120000,
    shippingCost: 22000,
    discount: 12000,
    totalAmount: 130000,
    courier: 'J&T Express',
    paymentMethod: 'bri',
    status: 'Selesai',
    trackingNumber: 'JT9021884711',
    paymentProof: {
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      senderBank: 'BRImo',
      senderName: 'Salma Salsabila',
      transferAmount: 130000,
      uploadedAt: '2026-10-11T09:40:00.000Z',
      approvedAt: '2026-10-11T10:15:00.000Z',
      approvedBy: 'Admin Zahra'
    },
    statusHistory: [
      { status: 'Menunggu Pembayaran', timestamp: '2026-10-11T09:10:00.000Z' },
      { status: 'Diproses', timestamp: '2026-10-11T10:15:00.000Z' },
      { status: 'Dikirim', timestamp: '2026-10-11T14:00:00.000Z' },
      { status: 'Selesai', timestamp: '2026-10-14T11:00:00.000Z', note: 'Pesanan telah diterima oleh pembeli' }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-081234567890',
    name: 'Aisyah Putri Rahmawati',
    phone: '081234567890',
    email: 'aisyah.putri@gmail.com',
    address: 'Jl. Melati No. 45, Sukajadi',
    city: 'Bandung',
    totalOrders: 1,
    totalSpent: 128800,
    firstOrderDate: '2026-10-14T08:30:00.000Z',
    lastOrderDate: '2026-10-14T08:30:00.000Z'
  },
  {
    id: 'CUST-085799881122',
    name: 'Nabila Khairunnisa',
    phone: '085799881122',
    email: 'nabila.khairun@gmail.com',
    address: 'Griya Indah Blok C3 No. 12',
    city: 'Yogyakarta',
    totalOrders: 1,
    totalSpent: 157000,
    firstOrderDate: '2026-10-13T14:20:00.000Z',
    lastOrderDate: '2026-10-13T14:20:00.000Z'
  },
  {
    id: 'CUST-081398765432',
    name: 'Fathimah Zahro',
    phone: '081398765432',
    email: 'fathimah.zahro@gmail.com',
    address: 'Jl. Tebet Barat Dalam VII No. 18',
    city: 'Jakarta Selatan',
    totalOrders: 2,
    totalSpent: 275000,
    firstOrderDate: '2026-10-01T10:00:00.000Z',
    lastOrderDate: '2026-10-12T11:00:00.000Z'
  },
  {
    id: 'CUST-087811223344',
    name: 'Salma Salsabila',
    phone: '087811223344',
    email: 'salma.salsa@yahoo.com',
    address: 'Jl. Riau No. 88, Tampan',
    city: 'Pekanbaru',
    totalOrders: 1,
    totalSpent: 130000,
    firstOrderDate: '2026-10-11T09:10:00.000Z',
    lastOrderDate: '2026-10-11T09:10:00.000Z'
  }
];
