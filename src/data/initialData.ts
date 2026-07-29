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
