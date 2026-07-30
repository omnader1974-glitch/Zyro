import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroVideo } from './components/HeroVideo';
import { BannerCarousel } from './components/BannerCarousel';
import { ReelsCarousel } from './components/ReelsCarousel';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product } from './types';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

function StoreMainContent() {
  const { language, t } = useLanguage();
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    selectedBadge, 
    setSelectedBadge, 
    searchQuery, 
    sortBy, 
    setSortBy,
    isAdminLoggedIn,
    isLoading
  } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Filter products by category, search query, and badge tag
  let filteredProducts = products.filter(p => p.enabled);

  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (selectedBadge && selectedBadge !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.badge?.toLowerCase() === selectedBadge.toLowerCase() ||
      (selectedBadge === 'new' && p.isNew) ||
      (selectedBadge === 'sale' && p.isSale) ||
      (selectedBadge === 'bestseller' && p.isBestSeller) ||
      (selectedBadge === 'featured' && p.isFeatured)
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      p.nameEn.toLowerCase().includes(q) ||
      p.nameAr.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q) ||
      p.descriptionAr.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    const priceA = a.discountedPrice || a.originalPrice;
    const priceB = b.discountedPrice || b.originalPrice;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
    return 0; // featured
  });

  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Homepage Background Hero Video */}
      <HeroVideo />

      {/* Hero Banner Carousel (if banners are added from admin) */}
      <BannerCarousel position="hero" />

      {/* Primary Catalog Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Filter & Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          
          {/* Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', labelEn: 'All Items', labelAr: 'الكل' },
              { id: 'new', labelEn: 'New Arrivals', labelAr: 'وصل حديثاً' },
              { id: 'sale', labelEn: 'Sale & Offers', labelAr: 'تخفيضات' },
              { id: 'bestseller', labelEn: 'Best Sellers', labelAr: 'الأكثر مبيعاً' },
              { id: 'featured', labelEn: 'Featured', labelAr: 'قطع مميزة' },
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBadge(b.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedBadge === b.id
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {language === 'ar' ? b.labelAr : b.labelEn}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="featured">Featured Collection</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 stroke-1 mx-auto text-amber-500 animate-pulse" />
            <h3 className="text-2xl font-bold font-serif text-neutral-900">
              {language === 'ar' ? 'المتجر فارغ ونظيف حالياً' : 'Store is Clean & Ready'}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {language === 'ar'
                ? 'تم إزالة جميع المنتجات والتصنيفات التلقائية. يمكنك إضافة منتجات وتصنيفات جديدة مباشرة من لوحة التحكم.'
                : 'All automatic demo products and categories have been removed. Add your real products and categories from the Admin Dashboard to see them live in real-time.'}
            </p>
            <button
              onClick={handleAdminTrigger}
              className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all shadow-md"
            >
              {language === 'ar' ? 'فتح لوحة التحكم (Admin)' : 'Open Admin Dashboard'}
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <Filter className="w-12 h-12 stroke-1 mx-auto text-neutral-300" />
            <h3 className="text-xl font-bold font-serif text-neutral-800">
              {language === 'ar' ? 'لا توجد منتجات تطابق البحث' : 'No products match your criteria.'}
            </h3>
            <p className="text-xs text-neutral-500">
              {language === 'ar' ? 'جرّب إعادة ضبط الفلاتر أو البحث عن كلمة أخرى.' : 'Try clearing filters or searching for another keyword.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBadge('all');
              }}
              className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-black"
            >
              {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Reels / Video Carousel Section */}
      <ReelsCarousel />

      {/* Footer */}
      <Footer onOpenAdminLogin={handleAdminTrigger} />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminDashboardOpen(true)}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <StoreMainContent />
      </StoreProvider>
    </LanguageProvider>
  );
}
