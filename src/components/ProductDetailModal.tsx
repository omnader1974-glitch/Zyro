import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left: Gallery */}
              <div className="p-6 bg-neutral-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200">
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-xs mb-4">
                  <img
                    src={activeImage}
                    alt={title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === img ? 'border-neutral-900 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info & Controls */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                      {product.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">SKU: {product.sku}</span>
                  </div>

                  <h2 className="text-2xl font-bold font-serif text-neutral-900 mt-2">
                    {title}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mt-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-2xl font-extrabold text-red-600">
                          ${product.discountedPrice}
                        </span>
                        <span className="text-base text-neutral-400 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(((product.originalPrice - product.discountedPrice!) / product.originalPrice) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-extrabold text-neutral-900">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
                    {description}
                  </p>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        {t('product.selectColor')}: <span className="font-normal text-neutral-900">{activeColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
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
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full border border-white shadow-xs" style={{ backgroundColor: c.hex }} />
                              <span>{language === 'ar' ? c.nameAr : c.nameEn}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        {t('product.selectSize')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s, i) => {
                          const isSelected = activeSize === s;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedSize(s)}
                              className={`min-w-[44px] h-10 px-3 rounded-lg border text-xs font-bold transition-all ${
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
                  )}

                  {/* Quantity */}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-neutral-900 text-white hover:bg-black'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>{language === 'ar' ? 'تمت الإضافة للحقيبة!' : 'Added to Bag!'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>{t('product.addToCart')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isWishlisted 
                          ? 'border-red-500 bg-red-50 text-red-600' 
                          : 'border-neutral-300 hover:border-neutral-500 text-neutral-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>

                  {/* Value Propositions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-neutral-500 text-center font-medium">
                    <div className="flex flex-col items-center gap-1 p-2 bg-neutral-50 rounded-lg">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>Fast Express Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-neutral-50 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>100% Authentic Luxury</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-neutral-50 rounded-lg">
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
