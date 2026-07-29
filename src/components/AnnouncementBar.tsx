import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const { language } = useLanguage();

  const announcementText = language === 'ar' ? settings.announcementAr : settings.announcementEn;

  if (!settings.announcementEnabled || !announcementText?.trim()) return null;

  return (
    <div dir="ltr" className="bg-neutral-900 text-neutral-100 text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-neutral-800 transition-all">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate max-w-4xl">{announcementText}</span>
    </div>
  );
};
