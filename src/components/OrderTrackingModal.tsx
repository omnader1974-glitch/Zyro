import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, OrderStatus } from '../types';
import { X, Search, PackageCheck, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { orders } = useStore();
  const [queryInput, setQueryInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    const term = queryInput.trim().toLowerCase();
    const found = orders.find(
      o => o.orderNumber.toLowerCase() === term || 
           o.primaryPhone.includes(term) || 
           o.id.toLowerCase() === term
    );

    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const steps = [
    { labelEn: 'Order Placed', labelAr: 'تم تسجيل الطلب', icon: Clock },
    { labelEn: 'Processing', labelAr: 'جاري التجهيز', icon: PackageCheck },
    { labelEn: 'Shipped', labelAr: 'تم الشحن', icon: Truck },
    { labelEn: 'Delivered', labelAr: 'تم التسليم', icon: CheckCircle },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
          >
          {/* Header */}
          <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif uppercase tracking-wider">
                {t('tracking.title')}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t('tracking.subtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  placeholder={t('tracking.placeholder')}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                {t('tracking.search')}
              </button>
            </form>

            {/* Results */}
            {hasSearched && (
              <div>
                {!matchedOrder ? (
                  <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm font-semibold">{t('tracking.noOrder')}</p>
                  </div>
                ) : (
                  <div className="space-y-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                    <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                      <div>
                        <span className="text-xs text-neutral-400 font-mono">ORDER REFERENCE</span>
                        <h3 className="text-lg font-bold font-mono text-neutral-900">
                          {matchedOrder.orderNumber}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Placed on: {new Date(matchedOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        matchedOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        matchedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        matchedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {matchedOrder.status}
                      </span>
                    </div>

                    {/* Progress Tracker Bar */}
                    {matchedOrder.status !== 'Cancelled' ? (
                      <div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {steps.map((step, idx) => {
                            const stepNum = idx + 1;
                            const isCompleted = stepNum <= getStatusStepIndex(matchedOrder.status);
                            const Icon = step.icon;

                            return (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  isCompleted ? 'bg-neutral-900 text-amber-400 shadow-md' : 'bg-neutral-200 text-neutral-400'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[11px] font-semibold ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                  {language === 'ar' ? step.labelAr : step.labelEn}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-100 text-red-800 rounded-lg text-xs font-bold text-center">
                        This order was cancelled.
                      </div>
                    )}

                    {/* Items Summary */}
                    <div className="border-t border-neutral-200 pt-4 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
                      {matchedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-neutral-800">
                            {language === 'ar' ? item.nameAr : item.nameEn} ({item.color}, {item.size}) x{item.quantity}
                          </span>
                          <span className="font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                        <span>Total Paid / Due</span>
                        <span className="text-amber-700">${matchedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
