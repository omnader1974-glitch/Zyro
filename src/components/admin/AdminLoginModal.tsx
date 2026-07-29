import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Lock, Key, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { adminLogin } = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ok = adminLogin(username.trim(), password.trim());
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid Username or Password. Please check admin credentials.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
        >
          {/* Header */}
          <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider">
                {t('admin.loginTitle')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                {t('admin.username')}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                {t('admin.password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>{t('admin.loginBtn')}</span>
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
