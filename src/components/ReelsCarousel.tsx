import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Play, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '../types';

export const ReelsCarousel: React.FC = () => {
  const { reels } = useStore();
  const { language } = useLanguage();
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const activeReels = reels.filter(r => r.enabled);

  if (activeReels.length === 0) return null;

  return (
    <section className="py-12 bg-neutral-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif uppercase tracking-wider">
              {language === 'ar' ? 'استوري زيرو الحية (Reels)' : 'ZYRO LIVE REELS'}
            </h2>
          </div>
          <span className="text-xs text-neutral-400 uppercase tracking-widest hidden sm:inline">
            {language === 'ar' ? 'اسحب لمشاهدة المقاطع' : 'SWIPE TO EXPLORE'}
          </span>
        </div>

        {/* Horizontal Sliding Carousel */}
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {activeReels.map((reel) => {
            const title = language === 'ar' ? reel.titleAr : reel.titleEn;
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedReel(reel)}
                className="shrink-0 w-44 sm:w-56 h-80 sm:h-96 rounded-2xl overflow-hidden relative group cursor-pointer bg-neutral-800 snap-start border border-neutral-800 hover:border-amber-500/50 transition-all transform hover:-translate-y-1 shadow-xl"
              >
                {/* Poster / Video */}
                {reel.thumbnail ? (
                  <img
                    src={reel.thumbnail}
                    alt={title || 'Reel'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <video
                    src={reel.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4">
                  <div className="self-end bg-black/60 backdrop-blur-md p-2 rounded-full">
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>

                  <div>
                    {title && (
                      <p className="text-xs sm:text-sm font-semibold line-clamp-2 text-neutral-100">
                        {title}
                      </p>
                    )}
                    <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mt-1 inline-block">
                      #ZYRO_REEL
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player (TikTok/Instagram style) */}
      {selectedReel && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[80vh] bg-black rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col justify-between">
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
              <span className="text-xs font-bold tracking-widest bg-black/50 px-3 py-1 rounded-full border border-neutral-700">
                ZYRO REELS
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setSelectedReel(null)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Element */}
            <video
              src={selectedReel.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              muted={isMuted}
            />

            {/* Bottom Caption */}
            <div className="absolute bottom-6 left-4 right-4 z-10 text-white bg-gradient-to-t from-black/90 p-3 rounded-2xl backdrop-blur-xs">
              <p className="text-sm font-bold">
                {language === 'ar' ? selectedReel.titleAr : selectedReel.titleEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
