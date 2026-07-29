import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Facebook, 
  Instagram, 
  Video, // TikTok alternative / video
  MessageCircle, 
  Youtube, 
  Twitter, 
  Settings as SettingsIcon,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { settings, isAdminLoggedIn, adminLogout } = useStore();
  const { t } = useLanguage();

  const socialLinks = [
    { name: 'Facebook', url: settings.facebookUrl, icon: Facebook },
    { name: 'Instagram', url: settings.instagramUrl, icon: Instagram },
    { name: 'TikTok', url: settings.tiktokUrl, icon: Video },
    { name: 'WhatsApp', url: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : '', icon: MessageCircle },
    { name: 'YouTube', url: settings.youtubeUrl, icon: Youtube },
    { name: 'Twitter / X', url: settings.twitterUrl, icon: Twitter },
  ].filter(s => !!s.url);

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-3xl font-extrabold tracking-tighter text-white font-serif block">
              ZYRO
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              ZYRO is an international luxury fashion atelier dedicated to architectural cuts, fine Italian textiles, and timeless modern aesthetics.
            </p>

            {/* Payment methods icons */}
            <div className="flex items-center gap-3 pt-2 text-neutral-400">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-medium">100% Encrypted & Authenticated</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {t('footer.customerCare')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.shippingPolicy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Men Collection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Women Collection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories & Bags</a></li>
            </ul>
          </div>

          {/* Social Media Links (Dynamic from Dashboard) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              {t('footer.socialHeader')}
            </h4>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-neutral-900 hover:bg-amber-500 hover:text-black text-neutral-300 rounded-full transition-all transform hover:scale-110 shadow-md"
                      title={s.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Configure social media links in Admin Settings.</p>
            )}
          </div>
        </div>

        {/* Bottom Bar & Hidden Settings Admin Trigger */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} {t('footer.rights')}</p>

          <div className="flex items-center gap-4">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Open Admin Dashboard</span>
                </button>
                <button
                  onClick={adminLogout}
                  className="text-neutral-400 hover:text-red-400 underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Hidden Settings button at the bottom of the website */
              <button
                onClick={onOpenAdminLogin}
                className="opacity-20 hover:opacity-100 transition-opacity p-2 text-neutral-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                title="Admin Settings"
                aria-label="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
