import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { wishlist, products, toggleWishlist, addToCart } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider text-neutral-900">
                {t('nav.wishlist')}
              </h2>
              <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                {wishlistedProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                <Heart className="w-16 h-16 stroke-1 mb-4 text-neutral-300" />
                <p className="text-base font-medium text-neutral-700">
                  {language === 'ar' ? 'قائمة المفضلة فارغة.' : 'Your wishlist is empty.'}
                </p>
              </div>
            ) : (
              wishlistedProducts.map(product => {
                const title = language === 'ar' ? product.nameAr : product.nameEn;
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 shadow-2xs items-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={title}
                      className="w-16 h-20 object-cover rounded-lg bg-white shrink-0 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-xs font-bold text-neutral-900 line-clamp-1 cursor-pointer hover:text-amber-700"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                      >
                        {title}
                      </h4>
                      <p className="text-sm font-extrabold text-neutral-900 mt-1">
                        ${product.discountedPrice || product.originalPrice}
                      </p>
                      
                      <button
                        onClick={() => {
                          addToCart(product, product.colors[0]?.nameEn || 'Default', product.sizes[0] || 'Standard', 1);
                        }}
                        className="mt-2 text-[11px] font-bold text-neutral-900 bg-white border border-neutral-300 px-3 py-1 rounded-md hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-neutral-400 hover:text-red-600 p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
