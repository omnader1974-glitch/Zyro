import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BannerCarouselProps {
  position?: 'hero' | 'mid_page' | 'bottom_page' | 'category_top';
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ position = 'hero' }) => {
  const { banners } = useStore();
  const { language, t } = useLanguage();

  const activeBanners = banners.filter(b => b.enabled && b.position === position);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];
  const title = language === 'ar' ? currentBanner.titleAr : currentBanner.titleEn;
  const subtitle = language === 'ar' ? currentBanner.subtitleAr : currentBanner.subtitleEn;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 group aspect-[16/9] sm:aspect-[21/9] max-h-[600px] shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Background Image */}
          <img
            src={currentBanner.imageUrl}
            alt={title || 'ZYRO Banner'}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Content Overlay */}
          <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto space-y-4">
            {title && (
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif uppercase drop-shadow-md"
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-base font-light text-neutral-200 tracking-wide max-w-xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
            {currentBanner.link && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-2"
              >
                <a
                  href={currentBanner.link}
                  className="inline-block bg-white text-neutral-900 hover:bg-amber-400 hover:text-black font-semibold text-xs sm:text-sm px-7 py-3 rounded-full uppercase tracking-widest transition-all transform hover:scale-105 shadow-md"
                >
                  {t('hero.shopNow')}
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 rtl:space-x-reverse">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
