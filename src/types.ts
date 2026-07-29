export type Language = 'en' | 'ar';

export interface ProductColorOption {
  nameEn: string;
  nameAr: string;
  hex: string;
  imageIndex?: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string; // Category slug or ID
  images: string[];
  colors: ProductColorOption[];
  sizes: string[]; // e.g. ['XS', 'S', 'M', 'L', 'XL']
  originalPrice: number;
  discountedPrice?: number;
  stock: number;
  sku: string;
  badge?: 'New' | 'Sale' | 'Best Seller' | 'Featured' | string;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  enabled: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  image?: string;
  order: number;
  visible: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expirationDate: string; // YYYY-MM-DD
  usageLimit: number;
  usedCount: number;
  enabled: boolean;
}

export interface ShippingZone {
  id: string;
  country: string; // e.g. 'Egypt', 'Saudi Arabia', 'UAE'
  governorateEn: string;
  governorateAr: string;
  cost: number;
  enabled: boolean;
}

export interface Settings {
  announcementEn: string;
  announcementAr: string;
  announcementEnabled: boolean;
  freeShippingThreshold: number;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappNumber: string;
  youtubeUrl: string;
  twitterUrl: string;
}

export interface OrderItem {
  productId: string;
  nameEn: string;
  nameAr: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  primaryPhone: string;
  secondaryPhone?: string;
  country: string;
  dialCode: string;
  governorate: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  titleEn?: string;
  titleAr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  link?: string;
  position: 'hero' | 'mid_page' | 'bottom_page' | 'category_top';
  order: number;
  enabled: boolean;
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnail?: string;
  titleEn?: string;
  titleAr?: string;
  productId?: string;
  enabled: boolean;
}

export interface CartItem {
  id: string; // unique cart item key: `${productId}-${color}-${size}`
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface CountryOption {
  code: string;
  nameEn: string;
  nameAr: string;
  dialCode: string;
  flag: string;
}
