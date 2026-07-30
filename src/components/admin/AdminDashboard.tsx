import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Product, 
  Category, 
  Coupon, 
  ShippingZone, 
  Order,
  OrderStatus, 
  Banner, 
  Reel 
} from '../../types';
import { COUNTRIES } from '../../data/initialData';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Tag, 
  Megaphone, 
  Truck, 
  Share2, 
  ShoppingBag, 
  Image as ImageIcon, 
  Film, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  MessageCircle, 
  X, 
  Check, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { 
    products, 
    categories, 
    coupons, 
    shippingZones, 
    settings, 
    orders, 
    banners, 
    reels,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    addShippingZone,
    updateShippingZone,
    deleteShippingZone,
    updateSettings,
    updateOrderStatus,
    deleteOrder,
    addBanner,
    updateBanner,
    deleteBanner,
    addReel,
    updateReel,
    deleteReel,
    adminLogout
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'coupons' | 'announcement' | 'shipping' | 'social' | 'orders' | 'banners' | 'reels'
  >('overview');

  // Modals inside admin
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newColorNameInput, setNewColorNameInput] = useState('');
  const [newColorHexInput, setNewColorHexInput] = useState('#000000');
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [editingShipping, setEditingShipping] = useState<Partial<ShippingZone> | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [editingReel, setEditingReel] = useState<Partial<Reel> | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  // Localized string helpers
  const getLocalizedName = (item?: { nameEn?: string; nameAr?: string }) => {
    if (!item) return '';
    if (language === 'ar') return item.nameAr || item.nameEn || '';
    return item.nameEn || item.nameAr || '';
  };

  const getLocalizedTitle = (item?: { titleEn?: string; titleAr?: string }) => {
    if (!item) return '';
    if (language === 'ar') return item.titleAr || item.titleEn || '';
    return item.titleEn || item.titleAr || '';
  };

  const getLocalizedGov = (item?: { governorateEn?: string; governorateAr?: string }) => {
    if (!item) return '';
    if (language === 'ar') return item.governorateAr || item.governorateEn || '';
    return item.governorateEn || item.governorateAr || '';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': return t('admin.statusPending', 'Pending');
      case 'Processing': return t('admin.statusProcessing', 'Processing');
      case 'Shipped': return t('admin.statusShipped', 'Shipped');
      case 'Delivered': return t('admin.statusDelivered', 'Delivered');
      case 'Cancelled': return t('admin.statusCancelled', 'Cancelled');
      default: return status;
    }
  };

  const getPositionLabel = (pos: string) => {
    switch (pos) {
      case 'hero': return t('admin.heroPosition', 'Hero Main Slider');
      case 'mid_page': return t('admin.midPagePosition', 'Mid Page Section');
      case 'bottom_page': return t('admin.bottomPagePosition', 'Bottom Page Banner');
      case 'category_top': return t('admin.categoryTopPosition', 'Category Header Banner');
      default: return pos;
    }
  };

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Total Revenue calculation
  const totalRevenue = orders.reduce((acc, o) => o.status !== 'Cancelled' ? acc + o.total : acc, 0);

  // Handle Settings submit
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    alert(t('admin.settingsSaved', 'Settings updated successfully!'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-hidden flex flex-col text-neutral-100">
        
        {/* Top Navigation Bar */}
        <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
              ZYRO <span className="text-amber-500 font-sans text-xs font-bold uppercase tracking-widest">{t('admin.headerTag', 'ADMIN PANEL')}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                adminLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg border border-red-900/50 hover:bg-red-950/50"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('admin.logout')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Tabs */}
          <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-4 space-y-1.5 overflow-y-auto shrink-0 hidden md:block">
            {[
              { id: 'overview', label: t('admin.tabOverview'), icon: LayoutDashboard },
              { id: 'products', label: `${t('admin.tabProducts')} (${products.length})`, icon: Package },
              { id: 'categories', label: `${t('admin.tabCategories')} (${categories.length})`, icon: FolderTree },
              { id: 'coupons', label: `${t('admin.tabCoupons')} (${coupons.length})`, icon: Tag },
              { id: 'announcement', label: t('admin.tabAnnouncement'), icon: Megaphone },
              { id: 'shipping', label: `${t('admin.tabShipping')} (${shippingZones.length})`, icon: Truck },
              { id: 'social', label: t('admin.tabSocial'), icon: Share2 },
              { id: 'orders', label: `${t('admin.tabOrders')} (${orders.length})`, icon: ShoppingBag },
              { id: 'banners', label: `${t('admin.tabBanners')} (${banners.length})`, icon: ImageIcon },
              { id: 'reels', label: `${t('admin.tabReels')} (${reels.length})`, icon: Film },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Content View */}
          <main className="flex-1 bg-neutral-900 overflow-y-auto p-4 sm:p-8">
            
            {/* Mobile Tab Bar Selector */}
            <div className="md:hidden mb-6">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 text-amber-400 text-sm font-bold p-3 rounded-xl"
              >
                <option value="overview">{t('admin.tabOverview')}</option>
                <option value="products">{t('admin.tabProducts')} ({products.length})</option>
                <option value="categories">{t('admin.tabCategories')} ({categories.length})</option>
                <option value="coupons">{t('admin.tabCoupons')} ({coupons.length})</option>
                <option value="announcement">{t('admin.tabAnnouncement')}</option>
                <option value="shipping">{t('admin.tabShipping')} ({shippingZones.length})</option>
                <option value="social">{t('admin.tabSocial')}</option>
                <option value="orders">{t('admin.tabOrders')} ({orders.length})</option>
                <option value="banners">{t('admin.tabBanners')} ({banners.length})</option>
                <option value="reels">{t('admin.tabReels')} ({reels.length})</option>
              </select>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold font-serif text-white">{t('admin.overviewTitle')}</h1>
                  <p className="text-xs text-neutral-400">{t('admin.overviewSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-bold uppercase">{t('admin.totalRevenue')}</span>
                    <h3 className="text-3xl font-extrabold text-amber-400 font-mono mt-2">${totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-bold uppercase">{t('admin.totalOrders')}</span>
                    <h3 className="text-3xl font-extrabold text-white font-mono mt-2">{orders.length}</h3>
                  </div>
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-bold uppercase">{t('admin.activeProducts')}</span>
                    <h3 className="text-3xl font-extrabold text-white font-mono mt-2">{products.filter(p => p.enabled).length}</h3>
                  </div>
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-bold uppercase">{t('admin.activeCoupons')}</span>
                    <h3 className="text-3xl font-extrabold text-white font-mono mt-2">{coupons.filter(c => c.enabled).length}</h3>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('admin.recentOrders')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-neutral-300">
                      <thead className="bg-neutral-900 uppercase text-neutral-400 text-[10px]">
                        <tr>
                          <th className="p-3">{t('admin.orderRef')}</th>
                          <th className="p-3">{t('admin.customer')}</th>
                          <th className="p-3">{t('admin.governorate')}</th>
                          <th className="p-3">{t('admin.total')}</th>
                          <th className="p-3">{t('admin.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="border-b border-neutral-900">
                            <td className="p-3 font-mono font-bold text-amber-400">{o.orderNumber}</td>
                            <td className="p-3">{o.customerName}</td>
                            <td className="p-3">{o.governorate}</td>
                            <td className="p-3 font-mono">${o.total.toFixed(2)}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-amber-400">
                                {getStatusLabel(o.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.productsTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.productsSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingProduct({
                      nameEn: '',
                      nameAr: '',
                      descriptionEn: '',
                      descriptionAr: '',
                      category: categories[0]?.slug || 'all',
                      images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'],
                      colors: [{ nameEn: 'Black', nameAr: 'أسود', hex: '#000000' }],
                      sizes: ['S', 'M', 'L', 'XL'],
                      originalPrice: 100,
                      discountedPrice: 85,
                      stock: 20,
                      sku: `ZYRO-${Math.floor(Math.random() * 9000)}`,
                      badge: 'New',
                      enabled: true,
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addProduct')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 flex gap-4">
                      <img src={prod.images[0]} alt="" className="w-20 h-24 object-cover rounded-xl bg-neutral-900 shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-bold text-white line-clamp-1">{getLocalizedName(prod)}</h3>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${prod.enabled ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                              {prod.enabled ? t('admin.active') : t('admin.hidden')}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-500 font-mono block mt-0.5">{t('admin.productCategory')}: {prod.category}</span>
                          <span className="text-[10px] text-neutral-400 block">{t('admin.stockQty')}: {prod.stock} | SKU: {prod.sku}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-bold text-white font-mono">${prod.discountedPrice || prod.originalPrice}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 bg-neutral-800 text-amber-400 rounded-lg hover:bg-neutral-700"
                              title={t('admin.edit')}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="p-1.5 bg-neutral-800 text-red-400 rounded-lg hover:bg-neutral-700 hover:text-red-300"
                              title={t('admin.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.categoriesTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.categoriesSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingCategory({
                      nameEn: '',
                      nameAr: '',
                      slug: '',
                      order: categories.length + 1,
                      visible: true
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addCategory')}</span>
                  </button>
                </div>

                <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                  <table className="w-full text-xs text-left text-neutral-300">
                    <thead className="bg-neutral-900 uppercase text-neutral-400 text-[10px]">
                      <tr>
                        <th className="p-3">{t('admin.displayOrder')}</th>
                        <th className="p-3">{t('admin.categoryName')}</th>
                        <th className="p-3">{t('admin.slug')}</th>
                        <th className="p-3">{t('admin.visible')}</th>
                        <th className="p-3">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id} className="border-b border-neutral-900">
                          <td className="p-3 font-mono">{cat.order}</td>
                          <td className="p-3 font-bold text-white">{getLocalizedName(cat)}</td>
                          <td className="p-3 font-mono text-amber-500">{cat.slug}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.visible ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                              {cat.visible ? t('admin.show') : t('admin.hide')}
                            </span>
                          </td>
                          <td className="p-3 flex gap-2">
                            <button onClick={() => setEditingCategory(cat)} className="p-1 text-amber-400 hover:text-white" title={t('admin.edit')}>
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-1 text-red-400 hover:text-white" title={t('admin.delete')}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.couponsTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.couponsSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingCoupon({
                      code: 'ZYRO20',
                      type: 'percentage',
                      value: 20,
                      expirationDate: '2028-12-31',
                      usageLimit: 500,
                      enabled: true
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addCoupon')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map(c => (
                    <div key={c.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-mono font-extrabold text-amber-400">{c.code}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${c.enabled ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {c.enabled ? t('admin.active') : t('admin.disabled')}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-300 space-y-1">
                        <p>{t('admin.discountAmount')}: <strong className="text-white">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</strong></p>
                        <p>{t('admin.usageLimit')}: <strong>{c.usedCount} / {c.usageLimit}</strong></p>
                        <p>{t('admin.expirationDate')}: <strong>{c.expirationDate}</strong></p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-neutral-900 justify-end">
                        <button onClick={() => setEditingCoupon(c)} className="p-1.5 text-amber-400 bg-neutral-900 rounded-lg" title={t('admin.edit')}>
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-red-400 bg-neutral-900 rounded-lg" title={t('admin.delete')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ANNOUNCEMENT BAR & FREE SHIPPING THRESHOLD */}
            {activeTab === 'announcement' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                <h1 className="text-xl font-bold font-serif text-white">{t('admin.announcementTitle')}</h1>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="annEnabled"
                    checked={settingsForm.announcementEnabled}
                    onChange={e => setSettingsForm({ ...settingsForm, announcementEnabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <label htmlFor="annEnabled" className="text-xs font-bold text-white uppercase">{t('admin.enableAnnouncement')}</label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.announcementMessage')}</label>
                  <textarea
                    rows={3}
                    placeholder="Enter announcement text to display on top banner..."
                    value={settingsForm.announcementEn || settingsForm.announcementAr || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, announcementEn: e.target.value, announcementAr: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.freeShippingThreshold')}</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={e => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>

                <button type="submit" className="px-6 py-3 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl">
                  {t('admin.saveAnnouncement')}
                </button>
              </form>
            )}

            {/* TAB: SHIPPING SETTINGS (GOVERNORATES) */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.shippingTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.shippingSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingShipping({
                      country: 'Egypt',
                      governorateEn: '',
                      governorateAr: '',
                      cost: 50,
                      enabled: true
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addShipping')}</span>
                  </button>
                </div>

                <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4">
                  <table className="w-full text-xs text-left text-neutral-300">
                    <thead className="bg-neutral-900 uppercase text-neutral-400 text-[10px]">
                      <tr>
                        <th className="p-3">{t('admin.country')}</th>
                        <th className="p-3">{t('admin.governorateName')}</th>
                        <th className="p-3">{t('admin.shippingPrice')}</th>
                        <th className="p-3">{t('admin.status')}</th>
                        <th className="p-3">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingZones.map(z => (
                        <tr key={z.id} className="border-b border-neutral-900">
                          <td className="p-3 font-bold text-white">{z.country}</td>
                          <td className="p-3 font-semibold text-neutral-200">{getLocalizedGov(z)}</td>
                          <td className="p-3 font-mono text-amber-400 font-bold">${z.cost}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${z.enabled ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                              {z.enabled ? t('admin.enabled') : t('admin.disabled')}
                            </span>
                          </td>
                          <td className="p-3 flex gap-2">
                            <button onClick={() => setEditingShipping(z)} className="p-1 text-amber-400" title={t('admin.edit')}>
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteShippingZone(z.id)} className="p-1 text-red-400" title={t('admin.delete')}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SOCIAL MEDIA */}
            {activeTab === 'social' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                <h1 className="text-xl font-bold font-serif text-white">{t('admin.socialTitle')}</h1>
                <p className="text-xs text-neutral-400">{t('admin.socialSubtitle')}</p>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.facebookUrl')}</label>
                  <input type="url" value={settingsForm.facebookUrl} onChange={e => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.instagramUrl')}</label>
                  <input type="url" value={settingsForm.instagramUrl} onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.tiktokUrl')}</label>
                  <input type="url" value={settingsForm.tiktokUrl} onChange={e => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.whatsappNum')}</label>
                  <input type="text" value={settingsForm.whatsappNumber} onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.youtubeUrl')}</label>
                  <input type="url" value={settingsForm.youtubeUrl} onChange={e => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">{t('admin.twitterUrl')}</label>
                  <input type="url" value={settingsForm.twitterUrl} onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white" />
                </div>

                <button type="submit" className="px-6 py-3 bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl">
                  {t('admin.saveSocial')}
                </button>
              </form>
            )}

            {/* TAB: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold font-serif text-white">{t('admin.ordersTitle')}</h1>
                  <p className="text-xs text-neutral-400">{t('admin.ordersSubtitle')}</p>
                </div>

                <div className="space-y-4">
                  {orders.map(o => {
                    const waText = `Hello ${o.customerName}, regarding your ZYRO Order ${o.orderNumber}: Total is $${o.total}. Status: ${o.status}.`;
                    const waUrl = `https://wa.me/${o.primaryPhone.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;

                    return (
                      <div key={o.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-900 pb-3">
                          <div>
                            <span className="text-lg font-bold font-mono text-amber-400">{o.orderNumber}</span>
                            <span className="text-xs text-neutral-400 ml-3">
                              {new Date(o.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Order Status selector */}
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="bg-neutral-900 border border-neutral-700 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                            >
                              <option value="Pending">{t('admin.statusPending')}</option>
                              <option value="Processing">{t('admin.statusProcessing')}</option>
                              <option value="Shipped">{t('admin.statusShipped')}</option>
                              <option value="Delivered">{t('admin.statusDelivered')}</option>
                              <option value="Cancelled">{t('admin.statusCancelled')}</option>
                            </select>

                            {/* WhatsApp Direct Action Button */}
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Print Invoice */}
                            <button
                              onClick={() => setSelectedInvoiceOrder(o)}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                            >
                              <Printer className="w-4 h-4" />
                              <span>{t('admin.invoice')}</span>
                            </button>

                            <button
                              onClick={() => setOrderToDelete(o)}
                              className="p-1.5 text-red-400 hover:bg-neutral-900 rounded-lg"
                              title={t('admin.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Shipping Summary Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300 bg-neutral-900/50 p-4 rounded-xl">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">{t('admin.customerInfo')}</span>
                            <p className="font-bold text-white mt-0.5">{o.customerName}</p>
                            <p className="font-mono">{o.primaryPhone}</p>
                            {o.secondaryPhone && <p className="font-mono text-neutral-400">Alt: {o.secondaryPhone}</p>}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Delivery Address</span>
                            <p className="font-bold text-white mt-0.5">{o.country} — {o.governorate}</p>
                            <p className="text-neutral-300">{o.address}</p>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Payment Summary</span>
                            <p>Subtotal: <strong>${o.subtotal.toFixed(2)}</strong></p>
                            <p>Shipping: <strong>${o.shippingCost.toFixed(2)}</strong></p>
                            <p className="text-amber-400 font-extrabold text-sm mt-1">Total: ${o.total.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Ordered Products Items */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-bold text-neutral-500">Ordered Items</span>
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-neutral-900 p-2 rounded-lg">
                              <span className="text-white">
                                {item.nameEn} ({item.color}, {item.size}) x{item.quantity}
                              </span>
                              <span className="font-mono font-bold text-amber-400">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: BANNERS */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.bannersTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.bannersSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingBanner({
                      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
                      titleEn: 'NEW SEASON CAPSULE',
                      titleAr: 'تشكيلة الموسم الجديدة',
                      subtitleEn: 'Luxury crafted fashion.',
                      subtitleAr: 'أرقى خطوط الموضة العالمية',
                      position: 'hero',
                      order: banners.length + 1,
                      enabled: true
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addBanner')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map(b => (
                    <div key={b.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 flex gap-4">
                      <img src={b.imageUrl} alt="" className="w-28 h-20 object-cover rounded-xl bg-neutral-900 shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                            {t('admin.bannerPosition')}: {getPositionLabel(b.position)}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-1">{getLocalizedTitle(b) || 'Banner'}</h4>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingBanner(b)} className="p-1 text-amber-400" title={t('admin.edit')}><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteBanner(b.id)} className="p-1 text-red-400" title={t('admin.delete')}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: REELS */}
            {activeTab === 'reels' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold font-serif text-white">{t('admin.reelsTitle')}</h1>
                    <p className="text-xs text-neutral-400">{t('admin.reelsSubtitle')}</p>
                  </div>
                  <button
                    onClick={() => setEditingReel({
                      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-wearing-a-hat-40118-large.mp4',
                      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
                      titleEn: 'ZYRO Atelier Runway',
                      titleAr: 'عروض أزياء زيرو أتيليه',
                      enabled: true
                    })}
                    className="flex items-center gap-2 bg-amber-500 text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('admin.addReel')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reels.map(r => (
                    <div key={r.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 flex gap-4 items-center">
                      <div className="w-16 h-24 bg-neutral-900 rounded-xl overflow-hidden relative shrink-0">
                        {r.thumbnail ? (
                          <img src={r.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={r.videoUrl} className="w-full h-full object-cover" muted />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between h-full py-1">
                        <div>
                          <h4 className="text-xs font-bold text-white">{getLocalizedTitle(r) || 'Reel Video'}</h4>
                          <span className="text-[10px] text-neutral-400 font-mono block truncate max-w-[180px] mt-1">{r.videoUrl}</span>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingReel(r)} className="p-1 text-amber-400" title={t('admin.edit')}><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteReel(r.id)} className="p-1 text-red-400" title={t('admin.delete')}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 border border-neutral-800 shadow-2xl">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="font-bold text-xl font-serif text-amber-400">
                    {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-neutral-400">Configure product details, images, prices, colors, and mapping</p>
                </div>
                <button onClick={() => setEditingProduct(null)} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8 text-xs">
                
                {/* 1. Product Images */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">1</span>
                      Product Images
                    </label>
                    <span className="text-[10px] text-neutral-400">First image is the main cover</span>
                  </div>

                  <div className="space-y-2">
                    {(editingProduct.images || ['']).map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono text-amber-400 w-16 shrink-0">
                          {idx === 0 ? 'Cover (1)' : `Image ${idx + 1}`}
                        </span>
                        <input
                          type="url"
                          placeholder={`Enter Image ${idx + 1} URL (e.g. https://...)`}
                          value={img}
                          onChange={e => {
                            const updated = [...(editingProduct.images || [''])];
                            updated[idx] = e.target.value;
                            setEditingProduct({ ...editingProduct, images: updated });
                          }}
                          className="flex-1 bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs font-mono"
                        />
                        {img && (
                          <img src={img} alt="" className="w-9 h-9 object-cover rounded-lg border border-neutral-700 bg-black shrink-0" />
                        )}
                        {(editingProduct.images?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.images || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, images: updated });
                            }}
                            className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        ...editingProduct,
                        images: [...(editingProduct.images || []), '']
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-amber-500/30 text-amber-400 rounded-lg font-bold text-xs hover:bg-amber-500/10 transition-colors mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>(+) Add Another Image</span>
                  </button>
                </div>

                {/* 2. Product Name */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">2</span>
                    Product Name
                  </label>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Product Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Silk Evening Gown"
                      value={editingProduct.nameEn || editingProduct.nameAr || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, nameEn: e.target.value, nameAr: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* 3. Product Category */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">3</span>
                    Product Category
                  </label>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Select from dashboard categories</label>
                    <select
                      value={editingProduct.category || categories[0]?.slug || 'all'}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg font-bold text-amber-400"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.nameEn || c.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Product Price */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">4</span>
                    Product Price
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1">Original Price ($) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="100.00"
                        value={editingProduct.originalPrice || 0}
                        onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg font-mono font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1">Sale Price ($) - Optional</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Leave blank if no sale price"
                        value={editingProduct.discountedPrice || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, discountedPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg font-mono font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Product Sizes */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">5</span>
                    Product Sizes
                  </label>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingProduct.sizes || []).map((sz, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-700 text-white rounded-lg font-mono font-bold text-xs">
                        {sz}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingProduct.sizes || []).filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a size (e.g. S, M, L, XL, 38, 40)"
                      value={newSizeInput}
                      onChange={e => setNewSizeInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSizeInput.trim()) {
                            setEditingProduct({
                              ...editingProduct,
                              sizes: [...(editingProduct.sizes || []), newSizeInput.trim().toUpperCase()]
                            });
                            setNewSizeInput('');
                          }
                        }
                      }}
                      className="flex-1 bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSizeInput.trim()) {
                          setEditingProduct({
                            ...editingProduct,
                            sizes: [...(editingProduct.sizes || []), newSizeInput.trim().toUpperCase()]
                          });
                          setNewSizeInput('');
                        }
                      }}
                      className="flex items-center gap-1 px-4 py-2.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400"
                    >
                      <Plus className="w-4 h-4" />
                      <span>(+) Add Size</span>
                    </button>
                  </div>
                </div>

                {/* 6. Product Colors */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">6</span>
                    Product Colors
                  </label>

                  <div className="space-y-2">
                    {(editingProduct.colors || []).map((col, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                        <input
                          type="color"
                          value={col.hex || '#000000'}
                          onChange={e => {
                            const updated = [...(editingProduct.colors || [])];
                            updated[idx] = { ...updated[idx], hex: e.target.value };
                            setEditingProduct({ ...editingProduct, colors: updated });
                          }}
                          className="w-8 h-8 rounded border border-neutral-700 cursor-pointer shrink-0 bg-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Color Name (e.g. Black / أسود)"
                          value={col.nameEn || col.nameAr || ''}
                          onChange={e => {
                            const updated = [...(editingProduct.colors || [])];
                            updated[idx] = { ...updated[idx], nameEn: e.target.value, nameAr: e.target.value };
                            setEditingProduct({ ...editingProduct, colors: updated });
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-700 p-2 rounded-lg text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingProduct.colors || []).filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, colors: updated });
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center pt-2">
                    <input
                      type="color"
                      value={newColorHexInput}
                      onChange={e => setNewColorHexInput(e.target.value)}
                      className="w-9 h-9 rounded border border-neutral-700 cursor-pointer shrink-0 bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Red)"
                      value={newColorNameInput}
                      onChange={e => setNewColorNameInput(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newColorNameInput.trim()) {
                          setEditingProduct({
                            ...editingProduct,
                            colors: [
                              ...(editingProduct.colors || []),
                              {
                                nameEn: newColorNameInput.trim(),
                                nameAr: newColorNameInput.trim(),
                                hex: newColorHexInput,
                                imageIndex: 0
                              }
                            ]
                          });
                          setNewColorNameInput('');
                          setNewColorHexInput('#000000');
                        }
                      }}
                      className="flex items-center gap-1 px-3.5 py-2 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>(+) Add Color</span>
                    </button>
                  </div>
                </div>

                {/* 7. Color Image Mapping */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">7</span>
                      Color Image Mapping
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">Map colors to product images</span>
                  </div>

                  {(!editingProduct.colors || editingProduct.colors.length === 0) ? (
                    <p className="text-[11px] text-neutral-500 italic">Please add at least one color above to set image mappings.</p>
                  ) : (
                    <div className="space-y-2">
                      {editingProduct.colors.map((c, colIdx) => (
                        <div key={colIdx} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800 gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: c.hex }} />
                            <span className="font-bold text-white text-xs">{c.nameEn || c.nameAr}</span>
                            <span className="text-[10px] text-neutral-400">→</span>
                          </div>

                          <select
                            value={c.imageIndex ?? 0}
                            onChange={e => {
                              const imgIdx = Number(e.target.value);
                              const updatedColors = [...(editingProduct.colors || [])];
                              updatedColors[colIdx] = {
                                ...c,
                                imageIndex: imgIdx,
                                imageUrl: editingProduct.images?.[imgIdx] || ''
                              };
                              setEditingProduct({ ...editingProduct, colors: updatedColors });
                            }}
                            className="bg-neutral-950 border border-neutral-700 text-amber-400 font-bold p-2 rounded-lg text-xs"
                          >
                            {(editingProduct.images || []).map((imgUrl, imgIdx) => (
                              <option key={imgIdx} value={imgIdx}>
                                Image {imgIdx + 1} {imgIdx === 0 ? '(Cover Image)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 8. Product Description (Optional) */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">8</span>
                    Product Description (Optional)
                  </label>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      placeholder="Enter product details..."
                      value={editingProduct.descriptionEn || editingProduct.descriptionAr || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value, descriptionAr: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* 9. Size Chart Image URL (Optional) */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-bold flex items-center justify-center font-mono">9</span>
                    Size Chart Image URL (Optional)
                  </label>
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/size-chart.jpg"
                      value={editingProduct.sizeChartUrl || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, sizeChartUrl: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs text-white"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Paste a direct image URL for the size chart. If provided, a Size Chart section will be displayed on the product page.
                    </p>
                  </div>
                </div>

                {/* Additional Inventory & Status */}
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Inventory & Store Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-400 text-[10px] mb-1">Stock Quantity *</label>
                      <input
                        type="number"
                        value={editingProduct.stock ?? 20}
                        onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 text-[10px] mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={editingProduct.sku || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 text-[10px] mb-1">Product Badge</label>
                      <select
                        value={editingProduct.badge || 'New'}
                        onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 p-2 rounded-lg font-bold"
                      >
                        <option value="New">New</option>
                        <option value="Sale">Sale</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Featured">Featured</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                        <input
                          type="checkbox"
                          checked={editingProduct.enabled !== false}
                          onChange={e => setEditingProduct({ ...editingProduct, enabled: e.target.checked })}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span>Active & Visible</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 9. Buttons */}
                <div className="flex gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={async () => {
                      const prodName = editingProduct.nameEn || editingProduct.nameAr;
                      if (!prodName || !prodName.trim()) {
                        alert('Please enter a product name.');
                        return;
                      }
                      const finalProductData = {
                        ...editingProduct,
                        nameEn: prodName,
                        nameAr: prodName,
                        descriptionEn: editingProduct.descriptionEn || editingProduct.descriptionAr || '',
                        descriptionAr: editingProduct.descriptionEn || editingProduct.descriptionAr || '',
                        images: (editingProduct.images || []).filter(img => img.trim() !== ''),
                        colors: (editingProduct.colors || []).map(c => ({
                          ...c,
                          imageUrl: c.imageIndex !== undefined && editingProduct.images?.[c.imageIndex] 
                            ? editingProduct.images[c.imageIndex] 
                            : c.imageUrl
                        })),
                        sizeChartUrl: editingProduct.sizeChartUrl ? editingProduct.sizeChartUrl.trim() : '',
                        stock: editingProduct.stock ?? 20,
                        sku: editingProduct.sku || `ZYRO-${Math.floor(Math.random() * 9000)}`,
                        badge: editingProduct.badge || 'New',
                        enabled: editingProduct.enabled !== false,
                      };

                      if (finalProductData.images.length === 0) {
                        finalProductData.images = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'];
                      }

                      if (editingProduct.id) {
                        await updateProduct(editingProduct.id, finalProductData);
                      } else {
                        await addProduct(finalProductData as any);
                      }
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-amber-500 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Save Product</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-6 py-3.5 bg-neutral-800 text-neutral-300 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-neutral-700 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION DIALOG */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2.5 bg-red-950/80 rounded-xl border border-red-900/50">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif text-white">{t('admin.confirmDeleteProduct')}</h3>
                  <p className="text-xs text-neutral-400">{t('admin.actionUndone')}</p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                {t('admin.delete')} <strong className="text-white font-mono">{getLocalizedName(productToDelete)}</strong>?
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={async () => {
                    await deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-red-600/20"
                >
                  {t('admin.confirmDelete')}
                </button>

                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER CONFIRM DELETE MODAL */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-2.5 bg-red-950/80 rounded-xl border border-red-900/50">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif text-white">{t('admin.confirmDeleteOrder')}</h3>
                  <p className="text-xs text-neutral-400">{t('admin.actionUndone')}</p>
                </div>
              </div>

              <div className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                <p>{t('admin.orderRef')}: <strong className="text-amber-400 font-mono">{orderToDelete.orderNumber}</strong></p>
                <p>{t('admin.customer')}: <strong className="text-white">{orderToDelete.customerName}</strong> ({orderToDelete.primaryPhone})</p>
                <p>{t('admin.totalPaid')}: <strong className="text-emerald-400 font-mono">${orderToDelete.total.toFixed(2)}</strong></p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={async () => {
                    await deleteOrder(orderToDelete.id);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-red-600/20"
                >
                  {t('admin.confirmDelete')}
                </button>

                <button
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT COUPON MODAL */}
        {editingCoupon && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-neutral-800 shadow-2xl">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-lg font-serif text-amber-400">
                  {editingCoupon.id ? t('admin.editCoupon') : t('admin.addCoupon')}
                </h3>
                <button onClick={() => setEditingCoupon(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.couponCode')} *</label>
                  <input
                    type="text"
                    placeholder="e.g. ZYRO20"
                    value={editingCoupon.code || ''}
                    onChange={e => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono font-bold text-amber-400 uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.discountType')}</label>
                    <select
                      value={editingCoupon.type || 'percentage'}
                      onChange={e => setEditingCoupon({ ...editingCoupon, type: e.target.value as 'percentage' | 'fixed' })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg"
                    >
                      <option value="percentage">{t('admin.percentage')}</option>
                      <option value="fixed">{t('admin.fixedAmount')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.discountValue')} *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingCoupon.value || 0}
                      onChange={e => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.expirationDate')}</label>
                    <input
                      type="date"
                      value={editingCoupon.expirationDate || ''}
                      onChange={e => setEditingCoupon({ ...editingCoupon, expirationDate: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.usageLimit')}</label>
                    <input
                      type="number"
                      min="1"
                      value={editingCoupon.usageLimit || 100}
                      onChange={e => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={editingCoupon.enabled !== false}
                      onChange={e => setEditingCoupon({ ...editingCoupon, enabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>{t('admin.usableCheckout')}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={async () => {
                    if (!editingCoupon.code?.trim()) {
                      alert('Please enter a coupon code.');
                      return;
                    }
                    if (editingCoupon.id) {
                      await updateCoupon(editingCoupon.id, editingCoupon);
                    } else {
                      await addCoupon(editingCoupon as any);
                    }
                    setEditingCoupon(null);
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {t('admin.saveCoupon')}
                </button>
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase rounded-xl"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT BANNER MODAL */}
        {editingBanner && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 border border-neutral-800 shadow-2xl">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-lg font-serif text-amber-400">
                  {editingBanner.id ? t('admin.editBanner') : t('admin.addBanner')}
                </h3>
                <button onClick={() => setEditingBanner(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Image Upload or URL */}
                <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <label className="block text-xs font-bold text-white mb-1">{t('admin.bannerImage')} *</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setEditingBanner({ ...editingBanner, imageUrl: evt.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={editingBanner.imageUrl || ''}
                      onChange={e => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs font-mono"
                    />
                    {editingBanner.imageUrl && (
                      <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-neutral-700 bg-black">
                        <img src={editingBanner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.bannerTitle')}</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER SALE"
                    value={editingBanner.titleEn || editingBanner.titleAr || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, titleEn: e.target.value, titleAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg text-white"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.bannerSubtitle')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Up to 50% off selected items"
                    value={editingBanner.subtitleEn || editingBanner.subtitleAr || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, subtitleEn: e.target.value, subtitleAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg text-white"
                  />
                </div>

                {/* Position & Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.bannerPosition')}</label>
                    <select
                      value={editingBanner.position || 'hero'}
                      onChange={e => setEditingBanner({ ...editingBanner, position: e.target.value as any })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-bold text-amber-400"
                    >
                      <option value="hero">{t('admin.heroPosition')}</option>
                      <option value="mid_page">{t('admin.midPagePosition')}</option>
                      <option value="bottom_page">{t('admin.bottomPagePosition')}</option>
                      <option value="category_top">{t('admin.categoryTopPosition')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">{t('admin.displayOrder')}</label>
                    <input
                      type="number"
                      min="1"
                      value={editingBanner.order || 1}
                      onChange={e => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Target Link */}
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.targetUrl')}</label>
                  <input
                    type="text"
                    placeholder="e.g. #catalog or https://..."
                    value={editingBanner.link || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, link: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={editingBanner.enabled !== false}
                      onChange={e => setEditingBanner({ ...editingBanner, enabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>{t('admin.visibleWebsite')}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={async () => {
                    if (!editingBanner.imageUrl?.trim()) {
                      alert('Please upload an image or enter an Image URL.');
                      return;
                    }
                    if (editingBanner.id) {
                      await updateBanner(editingBanner.id, editingBanner);
                    } else {
                      await addBanner(editingBanner as any);
                    }
                    setEditingBanner(null);
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {t('admin.saveBanner')}
                </button>
                <button
                  onClick={() => setEditingBanner(null)}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase rounded-xl"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT REEL MODAL */}
        {editingReel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 border border-neutral-800 shadow-2xl">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                <h3 className="font-bold text-lg font-serif text-amber-400">
                  {editingReel.id ? t('admin.editReel') : t('admin.addReel')}
                </h3>
                <button onClick={() => setEditingReel(null)} className="p-1 text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Video Upload or URL */}
                <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <label className="block text-xs font-bold text-white mb-1">{t('admin.reelVideoFile')} *</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setEditingReel({ ...editingReel, videoUrl: evt.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="Or paste direct video URL (.mp4)"
                      value={editingReel.videoUrl || ''}
                      onChange={e => setEditingReel({ ...editingReel, videoUrl: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs font-mono"
                    />
                    {editingReel.videoUrl && (
                      <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-neutral-700 bg-black mx-auto mt-2">
                        <video src={editingReel.videoUrl} className="w-full h-full object-cover" controls muted />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover / Thumbnail Upload or URL */}
                <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <label className="block text-xs font-bold text-white mb-1">{t('admin.reelThumbnail')}</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setEditingReel({ ...editingReel, thumbnail: evt.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="Or paste direct thumbnail image URL (https://...)"
                      value={editingReel.thumbnail || ''}
                      onChange={e => setEditingReel({ ...editingReel, thumbnail: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Titles */}
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.reelTitle')}</label>
                  <input
                    type="text"
                    placeholder="e.g. ZYRO Runway Highlights"
                    value={editingReel.titleEn || editingReel.titleAr || ''}
                    onChange={e => setEditingReel({ ...editingReel, titleEn: e.target.value, titleAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={editingReel.enabled !== false}
                      onChange={e => setEditingReel({ ...editingReel, enabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>{t('admin.visibleReels')}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={async () => {
                    if (!editingReel.videoUrl?.trim()) {
                      alert('Please upload a video or enter a direct Video URL.');
                      return;
                    }
                    if (editingReel.id) {
                      await updateReel(editingReel.id, editingReel);
                    } else {
                      await addReel(editingReel as any);
                    }
                    setEditingReel(null);
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {t('admin.saveReel')}
                </button>
                <button
                  onClick={() => setEditingReel(null)}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase rounded-xl"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT CATEGORY MODAL */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-neutral-800">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg font-serif">{editingCategory.id ? t('admin.editCategory') : t('admin.addCategory')}</h3>
                <button onClick={() => setEditingCategory(null)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.categoryName')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Evening Dresses"
                    value={editingCategory.nameEn || editingCategory.nameAr || ''}
                    onChange={e => setEditingCategory({
                      ...editingCategory,
                      nameEn: e.target.value,
                      nameAr: e.target.value,
                      slug: e.target.value.toLowerCase().trim().replace(/\s+/g, '-')
                    })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.slug')}</label>
                  <input type="text" value={editingCategory.slug || ''} onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })} className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.displayOrder')}</label>
                  <input type="number" value={editingCategory.order || 1} onChange={e => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono" />
                </div>
              </div>

              <button
                onClick={async () => {
                  if (editingCategory.id) {
                    await updateCategory(editingCategory.id, editingCategory);
                  } else {
                    await addCategory(editingCategory as any);
                  }
                  setEditingCategory(null);
                }}
                className="w-full py-3 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl"
              >
                {t('admin.saveCategory')}
              </button>
            </div>
          </div>
        )}

        {/* EDIT SHIPPING MODAL */}
        {editingShipping && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-neutral-800">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg font-serif">{editingShipping.id ? t('admin.editShipping') : t('admin.addShipping')}</h3>
                <button onClick={() => setEditingShipping(null)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.country')}</label>
                  <select value={editingShipping.country || 'Egypt'} onChange={e => setEditingShipping({ ...editingShipping, country: e.target.value })} className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg">
                    {COUNTRIES.map(c => <option key={c.code} value={c.nameEn}>{c.nameEn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.governorateName')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Cairo"
                    value={editingShipping.governorateEn || editingShipping.governorateAr || ''}
                    onChange={e => setEditingShipping({ ...editingShipping, governorateEn: e.target.value, governorateAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('admin.shippingPrice')}</label>
                  <input type="number" value={editingShipping.cost || 0} onChange={e => setEditingShipping({ ...editingShipping, cost: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-700 p-2.5 rounded-lg font-mono" />
                </div>
              </div>

              <button
                onClick={async () => {
                  if (editingShipping.id) {
                    await updateShippingZone(editingShipping.id, editingShipping);
                  } else {
                    await addShippingZone(editingShipping as any);
                  }
                  setEditingShipping(null);
                }}
                className="w-full py-3 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl"
              >
                {t('admin.saveShipping')}
              </button>
            </div>
          </div>
        )}

        {/* PRINTABLE INVOICE MODAL */}
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-white text-neutral-900 rounded-2xl p-8 max-w-xl w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold font-serif tracking-tight">ZYRO</h2>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">{t('admin.officialInvoice')}</p>
                </div>
                <button onClick={() => setSelectedInvoiceOrder(null)} className="p-1 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-neutral-500 uppercase">{t('admin.orderRef')}:</span>
                  <p className="font-mono font-bold text-amber-700 text-base">{selectedInvoiceOrder.orderNumber}</p>
                  <p className="text-neutral-500">{new Date(selectedInvoiceOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-500 uppercase">{t('admin.customerDetails')}:</span>
                  <p className="font-bold text-neutral-900">{selectedInvoiceOrder.customerName}</p>
                  <p className="font-mono">{selectedInvoiceOrder.primaryPhone}</p>
                  <p>{getLocalizedGov(selectedInvoiceOrder.governorate)}, {selectedInvoiceOrder.country}</p>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 text-neutral-700 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">{t('admin.item')}</th>
                      <th className="p-3">{t('admin.qty')}</th>
                      <th className="p-3">{t('admin.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceOrder.items.map((it: any, idx: number) => (
                      <tr key={idx} className="border-b border-neutral-100">
                        <td className="p-3 font-semibold">{getLocalizedName(it)} ({it.color}, {it.size})</td>
                        <td className="p-3 font-mono">{it.quantity}</td>
                        <td className="p-3 font-mono font-bold">${(it.price * it.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-xs text-neutral-600 text-right">
                <p>{t('admin.subtotalCost')}: <strong>${selectedInvoiceOrder.subtotal.toFixed(2)}</strong></p>
                <p>{t('admin.shippingCost')}: <strong>${selectedInvoiceOrder.shippingCost.toFixed(2)}</strong></p>
                {selectedInvoiceOrder.discount > 0 && <p className="text-emerald-600">{t('admin.discountAmount')}: -${selectedInvoiceOrder.discount.toFixed(2)}</p>}
                <p className="text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  {t('admin.totalPaid')}: <span className="text-amber-700 font-mono">${selectedInvoiceOrder.total.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-neutral-900 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-black"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('admin.printPdf')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </AnimatePresence>
);
};
