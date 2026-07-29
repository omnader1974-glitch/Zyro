import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { language, t } = useLanguage();
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    settings 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Free shipping progress calculation
  const freeShippingThreshold = settings.freeShippingThreshold || 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

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
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider text-neutral-900">
                {t('cart.title')}
              </h2>
              <span className="text-xs bg-neutral-900 text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-neutral-900 text-white text-xs">
            <div className="flex items-center gap-2 mb-1.5 font-medium">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  {t('cart.freeShippingProgress').replace('{amount}', `$${remainingForFreeShipping.toFixed(0)}`)}
                </span>
              ) : (
                <span className="text-amber-300 font-bold">{t('cart.freeShippingEarned')}</span>
              )}
            </div>
            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-12">
                <ShoppingBag className="w-16 h-16 stroke-1 mb-4 text-neutral-300" />
                <p className="text-base font-medium text-neutral-700">{t('cart.empty')}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors"
                >
                  {language === 'ar' ? 'استكشف المنتجات' : 'Explore Store'}
                </button>
              </div>
            ) : (
              cart.map(item => {
                const itemTitle = language === 'ar' ? item.product.nameAr : item.product.nameEn;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 shadow-2xs"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={itemTitle}
                      className="w-20 h-24 object-cover rounded-lg bg-white shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                            {itemTitle}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex gap-2 text-[11px] text-neutral-500 mt-1">
                          {item.selectedColor && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-bold">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-extrabold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 font-bold hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-xs text-neutral-600 font-bold hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t('cart.couponPlaceholder')}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase rounded-lg hover:bg-black transition-colors"
                >
                  {t('cart.applyCoupon')}
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-semibold">
                    Code <strong className="font-mono">{appliedCoupon.code}</strong> applied (-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponMsg && !appliedCoupon && (
                <p className={`text-xs ${couponMsg.success ? 'text-emerald-600' : 'text-red-600'}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-bold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <p className="text-[11px] text-neutral-400">
                  {t('cart.shippingNote')}
                </p>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                <span>{t('cart.checkout')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
