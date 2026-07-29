import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { COUNTRIES } from '../data/initialData';
import { Order } from '../types';
import { X, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { 
    cart, 
    shippingZones, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    createOrder, 
    clearCart,
    settings 
  } = useStore();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('EG');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedGovernorateId, setSelectedGovernorateId] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const activeCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  // Available governorates filtered by selected country from Shipping Settings in dashboard
  const availableGovernorates = shippingZones.filter(
    z => z.enabled && z.country.toLowerCase() === activeCountry.nameEn.toLowerCase()
  );

  // Set default governorate if list exists
  useEffect(() => {
    if (availableGovernorates.length > 0 && !selectedGovernorateId) {
      setSelectedGovernorateId(availableGovernorates[0].id);
    }
  }, [availableGovernorates, selectedGovernorateId]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const selectedZone = shippingZones.find(z => z.id === selectedGovernorateId);
  const freeShippingThreshold = settings.freeShippingThreshold || 150;
  
  let shippingCost = selectedZone ? selectedZone.cost : 0;
  if (subtotal >= freeShippingThreshold) {
    shippingCost = 0; // Free shipping condition met
  }

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMsg(res.message);
    if (res.success) setCouponInput('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !primaryPhone || !address || !selectedGovernorateId) {
      alert(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const govName = selectedZone 
        ? (language === 'ar' ? selectedZone.governorateAr : selectedZone.governorateEn)
        : 'Default';

      const fullPrimaryPhone = `${activeCountry.dialCode}${primaryPhone.replace(/^0+/, '')}`;

      const orderData = {
        customerName,
        primaryPhone: fullPrimaryPhone,
        secondaryPhone: secondaryPhone ? `${activeCountry.dialCode}${secondaryPhone.replace(/^0+/, '')}` : '',
        country: activeCountry.nameEn,
        dialCode: activeCountry.dialCode,
        governorate: govName,
        address,
        items: cart.map(item => ({
          productId: item.productId,
          nameEn: item.product.nameEn,
          nameAr: item.product.nameAr,
          image: item.product.images[0],
          color: item.selectedColor,
          size: item.selectedSize,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        shippingCost,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || '',
        total: finalTotal,
        status: 'Pending' as const,
      };

      const order = await createOrder(orderData);
      setPlacedOrder(order);
      clearCart();
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp confirmation message builder
  const getWhatsAppUrl = () => {
    if (!placedOrder) return '#';
    const storeWhatsapp = settings.whatsappNumber || '201000000000';
    const itemsText = placedOrder.items
      .map(i => `- ${i.nameEn} (${i.color}, ${i.size}) x${i.quantity}: $${i.price * i.quantity}`)
      .join('%0A');

    const msg = language === 'ar'
      ? `مرحباً زيرو! أريد تأكيد طلبي رقم *${placedOrder.orderNumber}*%0A%0A*الاسم:* ${placedOrder.customerName}%0A*الهاتف:* ${placedOrder.primaryPhone}%0A*العنوان:* ${placedOrder.governorate} - ${placedOrder.address}%0A%0A*المنتجات:*%0A${itemsText}%0A%0A*الإجمالي النهائي:* $${placedOrder.total}`
      : `Hello ZYRO! I would like to confirm my order *${placedOrder.orderNumber}*%0A%0A*Name:* ${placedOrder.customerName}%0A*Phone:* ${placedOrder.primaryPhone}%0A*Address:* ${placedOrder.governorate} - ${placedOrder.address}%0A%0A*Items:*%0A${itemsText}%0A%0A*Total Amount:* $${placedOrder.total}`;

    return `https://wa.me/${storeWhatsapp}?text=${msg}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-neutral-200"
          >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-neutral-900 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif uppercase tracking-wider">
                {t('checkout.title')}
              </h2>
              <p className="text-xs text-neutral-400">
                {language === 'ar' ? 'ادخل بيانات الشحن والتسليم لإتمام طلبك' : 'Enter shipping details to complete your order'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success Screen */}
          {placedOrder ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif text-neutral-900">
                  {t('checkout.successTitle')}
                </h3>
                <p className="text-sm text-neutral-600 mt-2">{t('checkout.successMsg')}</p>
                <div className="mt-4 inline-block bg-neutral-100 px-4 py-2 rounded-lg font-mono text-sm font-bold text-neutral-900 border border-neutral-300">
                  {t('checkout.orderNumber')} <span className="text-amber-700">{placedOrder.orderNumber}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{t('checkout.whatsappConfirm')}</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-all"
                >
                  {t('checkout.continueShopping')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Customer Info Form */}
              <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                  1. Shipping Information
                </h3>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.fullName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Omar Mansour"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                {/* Country Selector with Dial Code */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.country')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCountryCode}
                    onChange={e => {
                      setSelectedCountryCode(e.target.value);
                      setSelectedGovernorateId(''); // Reset governorate when country changes
                    }}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {language === 'ar' ? c.nameAr : c.nameEn} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.primaryPhone')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg border border-r-0 rtl:border-r rtl:border-l-0 border-neutral-300 bg-neutral-200 text-neutral-700 text-xs font-mono font-bold">
                      {activeCountry.dialCode}
                    </span>
                    <input
                      type="tel"
                      required
                      value={primaryPhone}
                      onChange={e => setPrimaryPhone(e.target.value)}
                      placeholder="1012345678"
                      className="flex-1 px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                    />
                  </div>
                </div>

                {/* Secondary Phone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.secondaryPhone')}
                  </label>
                  <input
                    type="tel"
                    value={secondaryPhone}
                    onChange={e => setSecondaryPhone(e.target.value)}
                    placeholder="Optional secondary number"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>

                {/* Governorate Dropdown (Live from Shipping Settings) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.governorate')} <span className="text-red-500">*</span>
                  </label>
                  {availableGovernorates.length > 0 ? (
                    <select
                      required
                      value={selectedGovernorateId}
                      onChange={e => setSelectedGovernorateId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 font-semibold text-neutral-900"
                    >
                      {availableGovernorates.map(gov => (
                        <option key={gov.id} value={gov.id}>
                          {language === 'ar' ? gov.governorateAr : gov.governorateEn} — Shipping: ${gov.cost}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      No specific governorates defined for this country yet. Default standard shipping applied.
                    </div>
                  )}
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {t('checkout.address')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street name, building number, floor, apartment..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Order Summary & Live Totals */}
              <div className="p-6 bg-neutral-50 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-2">
                    2. {t('checkout.orderSummary')}
                  </h3>

                  {/* Items list snippet */}
                  <div className="max-h-48 overflow-y-auto space-y-2 py-3 border-b border-neutral-200">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <img src={item.product.images[0]} alt="" className="w-8 h-10 object-cover rounded bg-white" />
                          <div>
                            <span className="font-semibold block line-clamp-1">
                              {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                            </span>
                            <span className="text-neutral-400 text-[10px]">
                              {item.selectedColor} / {item.selectedSize} (x{item.quantity})
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Optional Input */}
                  <div className="pt-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value)}
                          placeholder={t('cart.couponPlaceholder')}
                          className="w-full pl-9 pr-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs uppercase font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg"
                      >
                        {t('cart.applyCoupon')}
                      </button>
                    </div>

                    {appliedCoupon && (
                      <div className="mt-2 flex justify-between items-center text-xs text-emerald-700 bg-emerald-100 p-2 rounded">
                        <span>Coupon ({appliedCoupon.code}) Applied</span>
                        <button type="button" onClick={removeCoupon} className="font-bold text-red-600">Remove</button>
                      </div>
                    )}
                    {couponMsg && !appliedCoupon && (
                      <p className="text-[11px] text-neutral-500 mt-1">{couponMsg}</p>
                    )}
                  </div>

                  {/* Live Calculation Table */}
                  <div className="space-y-2 text-xs pt-4">
                    <div className="flex justify-between text-neutral-600">
                      <span>{t('checkout.subtotal')}</span>
                      <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-neutral-600">
                      <span>{t('checkout.shipping')} ({selectedZone ? (language === 'ar' ? selectedZone.governorateAr : selectedZone.governorateEn) : 'Standard'})</span>
                      <span className="font-mono font-bold">
                        {shippingCost === 0 ? <span className="text-emerald-600 uppercase font-bold">FREE</span> : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>{t('checkout.discount')}</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-300">
                      <span>{t('checkout.total')}</span>
                      <span className="font-mono text-xl text-amber-700">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span>{t('checkout.placingOrder')}</span>
                    ) : (
                      <>
                        <span>{t('checkout.placeOrder')}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Secure Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
