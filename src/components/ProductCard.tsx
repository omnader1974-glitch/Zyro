import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { language, t } = useLanguage();
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const secondImage = product.images[1] || product.images[0];
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors[0]?.nameEn || 'Default';
    const defaultSize = product.sizes[0] || 'Standard';
    addToCart(product, defaultColor, defaultSize, 1);
    
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-xl overflow-hidden border border-neutral-200/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Image Wrapper (1:1 Square, object-contain) */}
      <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={isHovered ? secondImage : product.images[0]}
          alt={title}
          className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-xs ${
              product.badge === 'Sale' || product.isSale ? 'bg-red-600' :
              product.badge === 'New' || product.isNew ? 'bg-neutral-900' :
              product.badge === 'Best Seller' || product.isBestSeller ? 'bg-amber-600' : 'bg-neutral-800'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted ? 'bg-red-50 text-red-600 shadow-md' : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-red-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick Add overlay button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
              addedAnimation 
                ? 'bg-emerald-600 text-white' 
                : 'bg-neutral-900 text-white hover:bg-black'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'تمت الإضافة!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-1">
            {product.category}
          </span>
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {title}
          </h3>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 py-1">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={language === 'ar' ? c.nameAr : c.nameEn}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-neutral-400 font-medium">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-red-600">
                  ${product.discountedPrice}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  ${product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-neutral-900">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <span className="text-[10px] text-neutral-400 font-medium">
            SKU: {product.sku || 'ZYRO'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
