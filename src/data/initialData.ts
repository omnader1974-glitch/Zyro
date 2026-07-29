import { Product, Category, Coupon, ShippingZone, Settings, Banner, Reel, CountryOption } from '../types';

export const COUNTRIES: CountryOption[] = [
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', dialCode: '+971', flag: '🇦🇪' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'عُمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
];

export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    nameEn: 'All Products',
    nameAr: 'جميع المنتجات',
    slug: 'all',
    order: 1,
    visible: true,
  },
  {
    nameEn: 'Men Collection',
    nameAr: 'تشكيلة الرجال',
    slug: 'men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
    order: 2,
    visible: true,
  },
  {
    nameEn: 'Women Collection',
    nameAr: 'تشكيلة النساء',
    slug: 'women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    order: 3,
    visible: true,
  },
  {
    nameEn: 'New Arrivals',
    nameAr: 'وصل حديثاً',
    slug: 'new-arrivals',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    order: 4,
    visible: true,
  },
  {
    nameEn: 'Accessories',
    nameAr: 'الإكسسوارات',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    order: 5,
    visible: true,
  },
  {
    nameEn: 'Footwear & Shoes',
    nameAr: 'الأحذية',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    order: 6,
    visible: true,
  }
];

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    nameEn: 'ZYRO Architectural Linen Blazer',
    nameAr: 'سترة زيرو الكتان بأبعاد هندسية',
    descriptionEn: 'Tailored minimalist blazer constructed from premium Egyptian linen with structured shoulders and horn buttons.',
    descriptionAr: 'سترة أنيقة مصممة من الكتان المصري الفاخر بكتف مهيكل وأزرار من العاج الطبيعي.',
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000'
    ],
    colors: [
      { nameEn: 'Oatmeal', nameAr: 'شوفاني', hex: '#E0D8CB' },
      { nameEn: 'Midnight Black', nameAr: 'أسود ميلي', hex: '#111111' },
      { nameEn: 'Olive Grey', nameAr: 'زيتي رمادي', hex: '#4A5240' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    originalPrice: 240,
    discountedPrice: 189,
    stock: 25,
    sku: 'ZY-M-BLZ-001',
    badge: 'Sale',
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isFeatured: true,
    enabled: true,
    createdAt: Date.now() - 100000,
  },
  {
    nameEn: 'ZYRO Silk Satin Wrap Evening Dress',
    nameAr: 'فستان زيرو الساتان الحريري',
    descriptionEn: 'Flowing Italian silk satin maxi dress featuring an asymmetrical drape, subtle split, and fluid movement.',
    descriptionAr: 'فستان ماكسي من الساتان الحريري الإيطالي بتصميم انسيابي وفتحة جانبية راقية.',
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000'
    ],
    colors: [
      { nameEn: 'Emerald Green', nameAr: 'زمردي', hex: '#0F5257' },
      { nameEn: 'Champagne Gold', nameAr: 'ذهبي شامبين', hex: '#E6C594' },
      { nameEn: 'Jet Black', nameAr: 'أسود داكن', hex: '#1A1A1A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    originalPrice: 320,
    discountedPrice: 280,
    stock: 18,
    sku: 'ZY-W-DRS-002',
    badge: 'Featured',
    isNew: true,
    isSale: false,
    isBestSeller: true,
    isFeatured: true,
    enabled: true,
    createdAt: Date.now() - 90000,
  },
  {
    nameEn: 'ZYRO Sculpted Italian Leather Boots',
    nameAr: 'حذاء زيرو الجلدي المصقول',
    descriptionEn: 'Handcrafted full-grain calfskin leather chelsea boots with cushioned welt sole and refined silhouette.',
    descriptionAr: 'حذاء تشيلسي مصنع يدوياً من جلد العجل الإيطالي الفاخر بنعل مريح وتصميم عصري.',
    category: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000'
    ],
    colors: [
      { nameEn: 'Cognac Brown', nameAr: 'بني كونياك', hex: '#633A2B' },
      { nameEn: 'Matte Black', nameAr: 'أسود مطفي', hex: '#222222' }
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    originalPrice: 290,
    stock: 12,
    sku: 'ZY-S-BOT-003',
    badge: 'New',
    isNew: true,
    isSale: false,
    isBestSeller: false,
    isFeatured: true,
    enabled: true,
    createdAt: Date.now() - 80000,
  },
  {
    nameEn: 'ZYRO Monogram Leather Shoulder Bag',
    nameAr: 'حقيبة زيرو الجلدية بلمسة مونوغرام',
    descriptionEn: 'Minimalist leather shoulder handbag with gold-finish hardware, interior suede lining and adjustable strap.',
    descriptionAr: 'حقيبة كتف جلدية مع هاردوير باللون الذهبي وبطانة مخملية وحزام قابل للتعديل.',
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'
    ],
    colors: [
      { nameEn: 'Caramel', nameAr: 'كراميل', hex: '#A86544' },
      { nameEn: 'Ivory White', nameAr: 'أبيض عاجي', hex: '#F5F5EC' },
      { nameEn: 'Noir', nameAr: 'أسود فاخر', hex: '#111111' }
    ],
    sizes: ['One Size'],
    originalPrice: 210,
    discountedPrice: 175,
    stock: 30,
    sku: 'ZY-A-BAG-004',
    badge: 'Best Seller',
    isNew: false,
    isSale: true,
    isBestSeller: true,
    isFeatured: true,
    enabled: true,
    createdAt: Date.now() - 70000,
  },
  {
    nameEn: 'ZYRO Relaxed Heavyweight Cotton Hoodie',
    nameAr: 'هودي زيرو من القطن الممشط الثقيل',
    descriptionEn: '480gsm ultra-soft French terry cotton hoodie featuring a drop shoulder cut and signature embroidered logo.',
    descriptionAr: 'هودي فاخر برؤية عصرية من القطن الممشط بقصة واسعة وطبعة محفورة بلمسة زيرو.',
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000'
    ],
    colors: [
      { nameEn: 'Sand Beige', nameAr: 'بيج رملي', hex: '#D2C4B3' },
      { nameEn: 'Charcoal', nameAr: 'فحمي', hex: '#333333' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    originalPrice: 120,
    discountedPrice: 95,
    stock: 40,
    sku: 'ZY-M-HD-005',
    badge: 'Sale',
    isNew: true,
    isSale: true,
    isBestSeller: false,
    isFeatured: true,
    enabled: true,
    createdAt: Date.now() - 60000,
  }
];

export const INITIAL_SHIPPING: Omit<ShippingZone, 'id'>[] = [
  { country: 'Egypt', governorateEn: 'Cairo', governorateAr: 'القاهرة', cost: 50, enabled: true },
  { country: 'Egypt', governorateEn: 'Giza', governorateAr: 'الجيزة', cost: 50, enabled: true },
  { country: 'Egypt', governorateEn: 'Alexandria', governorateAr: 'الإسكندرية', cost: 65, enabled: true },
  { country: 'Egypt', governorateEn: 'Dakahlia / Mansoura', governorateAr: 'الدقهلية / المنصورة', cost: 70, enabled: true },
  { country: 'Egypt', governorateEn: 'Red Sea / Hurghada', governorateAr: 'البحر الأحمر / الغردقة', cost: 95, enabled: true },
  { country: 'Saudi Arabia', governorateEn: 'Riyadh', governorateAr: 'الرياض', cost: 35, enabled: true },
  { country: 'Saudi Arabia', governorateEn: 'Jeddah', governorateAr: 'جدة', cost: 40, enabled: true },
  { country: 'Saudi Arabia', governorateEn: 'Dammam / Eastern', governorateAr: 'الدمام / المنطقة الشرقية', cost: 40, enabled: true },
  { country: 'United Arab Emirates', governorateEn: 'Dubai', governorateAr: 'دبي', cost: 30, enabled: true },
  { country: 'United Arab Emirates', governorateEn: 'Abu Dhabi', governorateAr: 'أبوظبي', cost: 35, enabled: true },
  { country: 'United Arab Emirates', governorateEn: 'Sharjah', governorateAr: 'الشارقة', cost: 30, enabled: true },
  { country: 'Kuwait', governorateEn: 'Kuwait City', governorateAr: 'عاصمة الكويت', cost: 3, enabled: true },
  { country: 'Qatar', governorateEn: 'Doha', governorateAr: 'الدوحة', cost: 30, enabled: true }
];

export const INITIAL_COUPONS: Omit<Coupon, 'id'>[] = [
  {
    code: 'ZYRO10',
    type: 'percentage',
    value: 10,
    expirationDate: '2028-12-31',
    usageLimit: 1000,
    usedCount: 42,
    enabled: true,
  },
  {
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    expirationDate: '2028-12-31',
    usageLimit: 500,
    usedCount: 18,
    enabled: true,
  },
  {
    code: 'VIP50',
    type: 'fixed',
    value: 50,
    expirationDate: '2028-12-31',
    usageLimit: 100,
    usedCount: 5,
    enabled: true,
  }
];

export const INITIAL_SETTINGS: Settings = {
  announcementEn: '✨ Welcome to ZYRO Official Store — Complimentary Express Delivery on Orders Over $150 | Use Code ZYRO10',
  announcementAr: '✨ مرحباً بكم في متجر زيرو الرسمي — شحن سريع مجاني على الطلبات الأكثر من 150 $ | استخدم الكود ZYRO10',
  announcementEnabled: true,
  freeShippingThreshold: 150,
  facebookUrl: 'https://facebook.com/zyro',
  instagramUrl: 'https://instagram.com/zyro',
  tiktokUrl: 'https://tiktok.com/@zyro',
  whatsappNumber: '201000000000',
  youtubeUrl: 'https://youtube.com/@zyro',
  twitterUrl: 'https://x.com/zyro',
};

export const INITIAL_BANNERS: Omit<Banner, 'id'>[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
    titleEn: 'THE AUTUMN / WINTER ARCHITECTURE',
    titleAr: 'مجموعة الخريف والشتاء المعمارية',
    subtitleEn: 'Clean tailoring, sculpted linen, and Italian craftsmanship.',
    subtitleAr: 'حياكة عصرية بلمسات فاخرة من أفضل الخامات العالمية',
    link: '#shop',
    position: 'hero',
    order: 1,
    enabled: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600',
    titleEn: 'EXCLUSIVE EVENING CAPSULE',
    titleAr: 'مجموعة السهرات الحصرية',
    subtitleEn: 'Elegance redefined for high fashion enthusiasts.',
    subtitleAr: 'عنوان الأناقة والرقي لإطلالة لا تُنسى',
    link: '#shop',
    position: 'hero',
    order: 2,
    enabled: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
    titleEn: 'ZYRO ATELIER ESSENTIALS',
    titleAr: 'أساسيات زيرو أتيليه',
    subtitleEn: 'Discover everyday luxury minimalist wardrobe pieces.',
    subtitleAr: 'اكتشف قطع الموضة الأساسية المصممة بعناية فائقة',
    link: '#shop',
    position: 'hero',
    order: 3,
    enabled: true,
  }
];

export const INITIAL_REELS: Omit<Reel, 'id'>[] = [
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-wearing-a-hat-40118-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    titleEn: 'Architectural Linen Lookbook',
    titleAr: 'إطلالة الكتان الهندسي',
    enabled: true,
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-the-camera-41584-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
    titleEn: 'Italian Silk Drape',
    titleAr: 'سحر الحرير الإيطالي',
    enabled: true,
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-man-in-sunglasses-41587-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600',
    titleEn: 'Leather Craftsmanship Behind ZYRO',
    titleAr: 'صناعة الجلود الفاخرة في زيرو',
    enabled: true,
  }
];
