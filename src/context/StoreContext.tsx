import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Product, 
  Category, 
  Coupon, 
  ShippingZone, 
  Settings, 
  Order, 
  OrderStatus, 
  Banner, 
  Reel, 
  CartItem 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_SHIPPING, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS, 
  INITIAL_BANNERS, 
  INITIAL_REELS 
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  shippingZones: ShippingZone[];
  settings: Settings;
  orders: Order[];
  banners: Banner[];
  reels: Reel[];
  
  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBadge: string;
  setSelectedBadge: (b: string) => void;
  selectedColorFilter: string;
  setSelectedColorFilter: (c: string) => void;
  selectedSizeFilter: string;
  setSelectedSizeFilter: (s: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  setSortBy: (s: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;

  // Admin state
  isAdminLoggedIn: boolean;
  adminLogin: (u: string, p: string) => boolean;
  adminLogout: () => void;

  // Firestore Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  addShippingZone: (zone: Omit<ShippingZone, 'id'>) => Promise<void>;
  updateShippingZone: (id: string, updates: Partial<ShippingZone>) => Promise<void>;
  deleteShippingZone: (id: string) => Promise<void>;

  updateSettings: (updates: Partial<Settings>) => Promise<void>;

  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  addReel: (reel: Omit<Reel, 'id'>) => Promise<void>;
  updateReel: (id: string, updates: Partial<Reel>) => Promise<void>;
  deleteReel: (id: string) => Promise<void>;

  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart & Wishlist local persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zyro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zyro_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Admin login state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('zyro_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('zyro_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zyro_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Seed initial data if Firestore collections are empty
  const seedInitialDataIfNeeded = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      if (categoriesSnap.empty) {
        for (const cat of INITIAL_CATEGORIES) {
          await addDoc(collection(db, 'categories'), cat);
        }
      }

      const productsSnap = await getDocs(collection(db, 'products'));
      if (productsSnap.empty) {
        for (const prod of INITIAL_PRODUCTS) {
          await addDoc(collection(db, 'products'), prod);
        }
      }

      const shippingSnap = await getDocs(collection(db, 'shipping'));
      if (shippingSnap.empty) {
        for (const ship of INITIAL_SHIPPING) {
          await addDoc(collection(db, 'shipping'), ship);
        }
      }

      const couponsSnap = await getDocs(collection(db, 'coupons'));
      if (couponsSnap.empty) {
        for (const c of INITIAL_COUPONS) {
          await addDoc(collection(db, 'coupons'), c);
        }
      }

      const bannersSnap = await getDocs(collection(db, 'banners'));
      if (bannersSnap.empty) {
        for (const b of INITIAL_BANNERS) {
          await addDoc(collection(db, 'banners'), b);
        }
      }

      const reelsSnap = await getDocs(collection(db, 'reels'));
      if (reelsSnap.empty) {
        for (const r of INITIAL_REELS) {
          await addDoc(collection(db, 'reels'), r);
        }
      }

      const settingsDoc = doc(db, 'settings', 'global');
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await setDoc(settingsDoc, INITIAL_SETTINGS);
      }
    } catch (e) {
      console.error('Error seeding initial data to Firestore:', e);
    }
  };

  // Setup Firestore real-time listeners
  useEffect(() => {
    seedInitialDataIfNeeded();

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const list: Category[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(list);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const list: Product[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(list);
      setIsLoading(false);
    });

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const list: Coupon[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
      setCoupons(list);
    });

    const unsubShipping = onSnapshot(collection(db, 'shipping'), (snapshot) => {
      const list: ShippingZone[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShippingZone));
      setShippingZones(list);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as Settings);
      }
    });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      const list: Order[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      setOrders(list);
    });

    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const list: Banner[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(list);
    });

    const unsubReels = onSnapshot(collection(db, 'reels'), (snapshot) => {
      const list: Reel[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reel));
      setReels(list);
    });

    return () => {
      unsubCategories();
      unsubProducts();
      unsubCoupons();
      unsubShipping();
      unsubSettings();
      unsubOrders();
      unsubBanners();
      unsubReels();
    };
  }, []);

  // Admin login credentials check
  const adminLogin = (u: string, p: string): boolean => {
    if (u === 'Zyro' && p === 'Zyro147258') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('zyro_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('zyro_admin_auth');
  };

  // Cart actions
  const addToCart = (product: Product, color: string, size: string, quantity = 1) => {
    const itemPrice = product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.originalPrice;
    const cartItemId = `${product.id}-${color}-${size}`;

    setCart(prev => {
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
          price: itemPrice
        }
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist action
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Coupon action
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.enabled);
    
    if (!found) {
      return { success: false, message: 'Invalid or disabled coupon code.' };
    }

    if (found.expirationDate && new Date(found.expirationDate) < new Date()) {
      return { success: false, message: 'This coupon code has expired.' };
    }

    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      return { success: false, message: 'This coupon usage limit has been reached.' };
    }

    setAppliedCoupon(found);
    return { success: true, message: 'Coupon code applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

// Firestore sanitization helper to strip any undefined fields
function sanitizeDataForFirestore<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = sanitizeDataForFirestore(value);
      } else if (Array.isArray(value)) {
        cleaned[key] = value.map(item => (typeof item === 'object' && item !== null) ? sanitizeDataForFirestore(item) : item);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned as T;
}

  // Firestore actions
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'products'), sanitizeDataForFirestore({
      ...prodData,
      createdAt: Date.now()
    }));
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), sanitizeDataForFirestore(updates));
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    await addDoc(collection(db, 'categories'), sanitizeDataForFirestore(catData));
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    await updateDoc(doc(db, 'categories', id), sanitizeDataForFirestore(updates));
  };

  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  const addCoupon = async (cData: Omit<Coupon, 'id' | 'usedCount'>) => {
    await addDoc(collection(db, 'coupons'), sanitizeDataForFirestore({
      ...cData,
      usedCount: 0
    }));
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    await updateDoc(doc(db, 'coupons', id), sanitizeDataForFirestore(updates));
  };

  const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
  };

  const addShippingZone = async (zData: Omit<ShippingZone, 'id'>) => {
    await addDoc(collection(db, 'shipping'), sanitizeDataForFirestore(zData));
  };

  const updateShippingZone = async (id: string, updates: Partial<ShippingZone>) => {
    await updateDoc(doc(db, 'shipping', id), sanitizeDataForFirestore(updates));
  };

  const deleteShippingZone = async (id: string) => {
    await deleteDoc(doc(db, 'shipping', id));
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    await setDoc(doc(db, 'settings', 'global'), sanitizeDataForFirestore(updates), { merge: true });
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const orderNum = `ZYRO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Omit<Order, 'id'> = {
      ...orderData,
      couponCode: orderData.couponCode || '',
      secondaryPhone: orderData.secondaryPhone || '',
      orderNumber: orderNum,
      createdAt: Date.now()
    };

    const sanitized = sanitizeDataForFirestore(newOrder);
    const docRef = await addDoc(collection(db, 'orders'), sanitized);

    // Increment coupon usage count if applied
    if (orderData.couponCode) {
      const usedC = coupons.find(c => c.code.toUpperCase() === orderData.couponCode?.toUpperCase());
      if (usedC) {
        await updateDoc(doc(db, 'coupons', usedC.id), {
          usedCount: (usedC.usedCount || 0) + 1
        });
      }
    }

    return { id: docRef.id, ...newOrder };
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const deleteOrder = async (id: string) => {
    await deleteDoc(doc(db, 'orders', id));
  };

  const addBanner = async (bData: Omit<Banner, 'id'>) => {
    await addDoc(collection(db, 'banners'), sanitizeDataForFirestore(bData));
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    await updateDoc(doc(db, 'banners', id), sanitizeDataForFirestore(updates));
  };

  const deleteBanner = async (id: string) => {
    await deleteDoc(doc(db, 'banners', id));
  };

  const addReel = async (rData: Omit<Reel, 'id'>) => {
    await addDoc(collection(db, 'reels'), sanitizeDataForFirestore(rData));
  };

  const updateReel = async (id: string, updates: Partial<Reel>) => {
    await updateDoc(doc(db, 'reels', id), sanitizeDataForFirestore(updates));
  };

  const deleteReel = async (id: string) => {
    await deleteDoc(doc(db, 'reels', id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        coupons,
        shippingZones,
        settings,
        orders,
        banners,
        reels,
        cart,
        wishlist,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        applyCouponCode,
        removeCoupon,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBadge,
        setSelectedBadge,
        selectedColorFilter,
        setSelectedColorFilter,
        selectedSizeFilter,
        setSelectedSizeFilter,
        sortBy,
        setSortBy,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
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
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addBanner,
        updateBanner,
        deleteBanner,
        addReel,
        updateReel,
        deleteReel,
        isLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
