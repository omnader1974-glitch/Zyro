import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, ArrowLeft, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { language, t } = useLanguage();
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const activeImage = selectedImage || (product?.images?.[0] || '');
  const activeColor = selectedColor || (product?.colors?.[0]?.nameEn || '');
  const activeSize = selectedSize || (product?.sizes?.[0] || '');

  const title = product ? (language === 'ar' ? product.nameAr : product.nameEn) : '';
  const description = product ? (language === 'ar' ? product.descriptionAr : product.descriptionEn) : '';
  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const hasDiscount = Boolean(product?.discountedPrice && product.discountedPrice < product.originalPrice);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, activeColor, activeSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col border border-neutral-100"
          >
            {/* Modal Top Sticky Header Bar with Prominent Back Button */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200/80 bg-white shadow-2xs z-30">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md group cursor-pointer"
              >
                <ArrowLeft className={`w-4 h-4 text-amber-400 transition-transform group-hover:-translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                <span>{language === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}</span>
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium">
                  {language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Close product view"
                  title={language === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
              
              {/* Left: Gallery (Compact 1:1 Square Layout) */}
              <div className="p-4 sm:p-5 bg-neutral-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200/80">
                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-xl overflow-hidden bg-white shadow-2xs mb-3 flex items-center justify-center p-3 border border-neutral-200/60">
                  <img
                    src={activeImage}
                    alt={title}
                    className="w-full h-full object-contain object-center"
                  />
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-12 h-12 aspect-square rounded-lg overflow-hidden border-2 p-1 bg-white transition-all ${
                          activeImage === img ? 'border-neutral-900 scale-105 shadow-xs' : 'border-neutral-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info & Controls (Compact Vertical Rhythm) */}
              <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-amber-700 font-bold">
                      {product.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">SKU: {product.sku}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 mt-1 leading-snug">
                    {title}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-2.5 mt-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-xl sm:text-2xl font-extrabold text-red-600">
                          ${product.discountedPrice}
                        </span>
                        <span className="text-sm text-neutral-400 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(((product.originalPrice - product.discountedPrice!) / product.originalPrice) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                    {description}
                  </p>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        {t('product.selectColor')}: <span className="font-normal text-neutral-900">{activeColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((c, i) => {
                          const isSelected = activeColor === c.nameEn;
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedColor(c.nameEn);
                                if (c.imageUrl) {
                                  setSelectedImage(c.imageUrl);
                                } else if (c.imageIndex !== undefined && product.images[c.imageIndex]) {
                                  setSelectedImage(product.images[c.imageIndex]);
                                }
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                              }`}
                            >
                              <span className="w-3 h-3 rounded-full border border-white shadow-xs" style={{ backgroundColor: c.hex }} />
                              <span>{language === 'ar' ? c.nameAr : c.nameEn}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selector & Size Chart */}
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                          {t('product.selectSize')}
                        </label>
                        {product.sizeChartUrl && (
                          <button
                            type="button"
                            onClick={() => setShowSizeChart(true)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-amber-200/80 shadow-2xs"
                          >
                            <Ruler className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === 'ar' ? 'دليل المقاسات' : 'Size Chart'}</span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes.map((s, i) => {
                          const isSelected = activeSize === s;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedSize(s)}
                              className={`min-w-[38px] h-8 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                                isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : product.sizeChartUrl ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowSizeChart(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-amber-200 shadow-2xs"
                      >
                        <Ruler className="w-4 h-4 text-amber-600" />
                        <span>{language === 'ar' ? 'عرض جدول المقاسات' : 'View Size Chart'}</span>
                      </button>
                    </div>
                  ) : null}

                  {/* Quantity */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-3 border-t border-neutral-200/80">
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className={`flex-1 py-3 px-5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-neutral-900 text-white hover:bg-black'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{language === 'ar' ? 'تمت الإضافة للحقيبة!' : 'Added to Bag!'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{t('product.addToCart')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        isWishlisted 
                          ? 'border-red-500 bg-red-50 text-red-600' 
                          : 'border-neutral-300 hover:border-neutral-500 text-neutral-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  {/* Value Propositions */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[9px] text-neutral-500 text-center font-medium">
                    <div className="flex flex-col items-center gap-0.5 p-1.5 bg-neutral-50 rounded-md">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 p-1.5 bg-neutral-50 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>100% Authentic</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 p-1.5 bg-neutral-50 rounded-md">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Size Chart Image Lightbox Modal */}
      {showSizeChart && product && product.sizeChartUrl && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-2xl w-full bg-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center max-h-[85vh] border border-neutral-200"
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  {language === 'ar' ? 'جدول المقاسات' : 'Size Chart'} — {title}
                </h3>
              </div>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close size chart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex-1 overflow-auto flex items-center justify-center bg-neutral-50 rounded-xl p-3 border border-neutral-100">
              <img
                src={product.sizeChartUrl}
                alt={language === 'ar' ? 'دليل المقاسات' : 'Size Chart'}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-xs"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
