import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Globe, Search, ShoppingBag, Heart, PackageCheck, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { cart, wishlist, searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLanguageToggle = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Controls: Mobile Menu & Language Switcher */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-black lg:hidden focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold tracking-wider text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer shadow-xs"
              title="Switch Language / تغيير اللغة"
            >
              <Globe className="w-4 h-4 text-amber-600" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>

          {/* Center Brand Title */}
          <div className="flex-1 text-center">
            <a href="#" className="inline-block group">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-neutral-900 font-serif group-hover:opacity-80 transition-opacity">
                ZYRO
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-neutral-600 uppercase font-sans -mt-1 font-medium">
                LUXURY ATELIER
              </span>
            </a>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Order Tracking */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 p-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
              title={t('nav.trackOrder')}
            >
              <PackageCheck className="w-5 h-5 text-neutral-700" />
              <span className="hidden md:inline">{t('nav.trackOrder')}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors relative flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 rtl:space-x-reverse py-3 border-t border-neutral-100 text-xs tracking-wider uppercase font-medium text-neutral-600">
          {categories.filter(c => c.visible).map(cat => {
            const isSelected = selectedCategory === cat.slug;
            const catName = language === 'ar' ? cat.nameAr : cat.nameEn;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`transition-all py-1 border-b-2 ${
                  isSelected
                    ? 'border-neutral-900 text-neutral-900 font-bold'
                    : 'border-transparent hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Expandable Search Input */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-200 bg-neutral-50 px-4 py-3"
          >
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full bg-white border border-neutral-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="p-1 text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3"
          >
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest pb-1 border-b border-neutral-100">
              {t('nav.allCategories')}
            </div>
            <div className="flex flex-col space-y-2 text-sm font-medium">
              {categories.filter(c => c.visible).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-start py-2 px-3 rounded-md transition-colors ${
                    selectedCategory === cat.slug ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </button>
              ))}
              <button
                onClick={() => {
                  onOpenTracking();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-start py-2 px-3 rounded-md text-amber-700 font-semibold hover:bg-amber-50"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{t('nav.trackOrder')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
