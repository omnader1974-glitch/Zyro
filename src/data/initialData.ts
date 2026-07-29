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

export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [];

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [];

export const INITIAL_SHIPPING: Omit<ShippingZone, 'id'>[] = [];

export const INITIAL_COUPONS: Omit<Coupon, 'id'>[] = [];

export const INITIAL_SETTINGS: Settings = {
  announcementEn: '',
  announcementAr: '',
  announcementEnabled: false,
  freeShippingThreshold: 0,
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  whatsappNumber: '',
  youtubeUrl: '',
  twitterUrl: '',
};

export const INITIAL_BANNERS: Omit<Banner, 'id'>[] = [];

export const INITIAL_REELS: Omit<Reel, 'id'>[] = [];
