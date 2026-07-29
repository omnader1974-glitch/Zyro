import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VIDEO_URL = "https://www.image2url.com/r2/default/videos/1785361041050-ba979728-eecc-452d-a244-788a00238323.mp4";

export const HeroVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;

    const attemptPlay = async () => {
      try {
        await video.play();
        setIsMuted(false);
      } catch (err) {
        console.log('Unmuted autoplay restricted by browser, playing muted first then unmuting on first touch/click', err);
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
        } catch (e) {
          console.log('Autoplay error:', e);
        }

        const handleInteraction = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1.0;
            videoRef.current.play().then(() => {
              setIsMuted(false);
            }).catch(() => {});
          }
          window.removeEventListener('click', handleInteraction);
          window.removeEventListener('touchstart', handleInteraction);
          window.removeEventListener('keydown', handleInteraction);
          window.removeEventListener('scroll', handleInteraction);
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });
      }
    };

    attemptPlay();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-black aspect-[16/9] sm:aspect-[21/9] min-h-[380px] max-h-[620px] shadow-2xl">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Hero Overlay Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10 sm:pb-16 text-white space-y-3">
        <span className="inline-block px-3 py-1 bg-amber-400 text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full self-start shadow-md">
          ZYRO WEAR
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif uppercase text-white drop-shadow-md max-w-2xl leading-tight">
          {language === 'ar' ? 'تشكيلة زيرو الفاخرة' : 'ZYRO WEAR COLLECTION'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-200 font-light tracking-wide max-w-lg drop-shadow">
          {language === 'ar' ? 'أزياء عصرية بتصاميم راقية وخامات عالية الجودة' : 'Contemporary minimalism with architectural cuts and premium fabrics.'}
        </p>
      </div>

      {/* Mute/Unmute Audio Control Toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-black text-white px-3 py-2 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 flex items-center gap-2 text-xs font-semibold cursor-pointer"
        title={isMuted ? "Unmute Sound" : "Mute Sound"}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px] font-medium text-neutral-200">Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline text-[11px] font-medium text-neutral-200">Sound On</span>
          </>
        )}
      </button>
    </div>
  );
};
