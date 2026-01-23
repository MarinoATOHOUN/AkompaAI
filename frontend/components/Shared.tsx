
import React, { useState, useEffect, ReactNode } from 'react';
import { ArrowLeft, GripHorizontal, User, Settings, CreditCard, HelpCircle, LogOut, X, Headphones, History, Megaphone } from 'lucide-react';
import { Screen, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../api';

export const Logo: React.FC = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md mb-2 relative transition-colors">
      {/* Simplified Logo Representation */}
      <div className="text-primary dark:text-green-400 font-bold text-3xl">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
      </div>
      {/* Arrow Circle Decoration */}
      <div className="absolute inset-0 border-2 border-primary/30 dark:border-green-400/30 rounded-full border-t-primary dark:border-t-green-400 rotate-45"></div>
    </div>
    <h1 className="text-primary dark:text-green-400 text-xl font-semibold tracking-wide">Akompta AI</h1>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const baseStyles = "py-4 px-6 rounded-full font-medium transition-all duration-200 active:scale-95 text-center";
  const variants = {
    primary: "bg-primary dark:bg-green-600 text-white shadow-lg shadow-primary/30 dark:shadow-green-900/20 hover:bg-primary/90 dark:hover:bg-green-500",
    secondary: "bg-white dark:bg-gray-800 text-primary dark:text-green-400 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700",
    outline: "border-2 border-primary dark:border-green-400 text-primary dark:text-green-400 hover:bg-primary/5 dark:hover:bg-white/5",
    ghost: "text-primary dark:text-green-400 hover:bg-primary/5 dark:hover:bg-white/5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4 w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-4">{label}</label>}
    <input
      className={`w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 px-6 py-4 rounded-full shadow-sm outline-none border border-transparent focus:border-primary dark:focus:border-green-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-400/20 transition-all ${className}`}
      {...props}
    />
  </div>
);

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  showProfile?: boolean;
  avatarUrl?: string;
  transparent?: boolean;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, onMenu, showProfile, avatarUrl, transparent, actionIcon, onAction }) => {
  const { user } = useAuth();
  const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'User';
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=14532d&color=fff&size=100`;

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;

    // Ensure path starts with /media/ if it's a relative backend path
    let path = url;
    if (!path.includes('/media/') && !path.includes('media/')) {
      path = `/media/${path.startsWith('/') ? path.substring(1) : path}`;
    }

    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const profileImage = getFullImageUrl(user?.avatar) || defaultAvatar;


  return (
    <div className={`flex justify-between items-center px-6 py-4 ${transparent ? '' : 'bg-transparent'}`}>
      {onBack ? (
        <button onClick={onBack} className="p-2 -ml-2 text-primary dark:text-white">
          <ArrowLeft size={28} />
        </button>
      ) : showProfile ? (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary dark:border-green-400 bg-white flex items-center justify-center">
          <img
            src={user?.account_type === 'business' && user?.business_logo ? getFullImageUrl(user.business_logo)! : profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultAvatar;
            }}
          />
        </div>
      ) : (
        <div className="w-8"></div>
      )}

      {title && (
        <h2 className="text-2xl font-bold text-primary dark:text-white">{title}</h2>
      )}

      <div className="flex items-center gap-2 -mr-2">
        {actionIcon && onAction && (
          <button onClick={onAction} className="p-2 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 rounded-full transition-colors">
            {actionIcon}
          </button>
        )}

        {onMenu ? (
          <button onClick={onMenu} className="p-2 text-primary dark:text-white">
            <GripHorizontal size={28} />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
      </div>
    </div>
  )
};


interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  userProfile?: UserProfile;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose, onNavigate, userProfile }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout: authLogout } = useAuth();

  const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : userProfile?.name || 'Akompta';
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=14532d&color=fff&size=100`;

  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;

    // Ensure path starts with /media/ if it's a relative backend path
    let path = url;
    if (!path.includes('/media/') && !path.includes('media/')) {
      path = `/media/${path.startsWith('/') ? path.substring(1) : path}`;
    }

    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const profileImage = getFullImageUrl(user?.avatar) || defaultAvatar;


  // Reset confirmation state when menu opens
  useEffect(() => {
    if (isOpen) {
      setShowLogoutConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'Mon Profil', action: () => onNavigate(Screen.PROFILE) },
    { icon: History, label: 'Transactions', action: () => onNavigate(Screen.TRANSACTIONS) },
    { icon: Megaphone, label: 'Annonces', action: () => onNavigate(Screen.ADS) },
    { icon: Settings, label: 'Paramètres', action: () => onNavigate(Screen.SETTINGS) },
    { icon: CreditCard, label: 'Abonnement', action: () => onNavigate(Screen.SUBSCRIPTION) },
    { icon: HelpCircle, label: "Guide d'utilisation", action: () => onNavigate(Screen.GUIDE) },
    { icon: Headphones, label: "Contacter le support", action: () => onNavigate(Screen.SUPPORT) },
    { icon: LogOut, label: 'Déconnexion', action: () => setShowLogoutConfirm(true), color: 'text-red-500' },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-3/4 max-w-[300px] h-full bg-white dark:bg-gray-800 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[30px] transition-colors">
        <button onClick={onClose} className="self-end p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors">
          <X size={20} />
        </button>

        {showLogoutConfirm ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-6">
              <LogOut size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Déconnexion</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 px-2">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  authLogout();
                  onNavigate(Screen.LOGIN);
                  onClose();
                }}
                className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
              >
                Oui, me déconnecter
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-transform"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8 px-2 border-b pb-6 border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 overflow-hidden border-2 border-primary dark:border-green-400 bg-white">
                <img
                  src={user?.account_type === 'business' && user?.business_logo ? getFullImageUrl(user.business_logo)! : profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultAvatar;
                  }}
                />
              </div>
              <div>
                <div className="font-bold text-gray-800 dark:text-white text-lg">{userName}</div>
                <div className="text-xs text-primary dark:text-green-400 font-medium bg-primary/10 dark:bg-green-400/10 px-2 py-0.5 rounded-full inline-block">Premium</div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    // Don't close immediately if it's logout, as we show confirmation
                    if (item.label !== 'Déconnexion') {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-95 ${item.color ? 'bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center text-xs text-gray-300 dark:text-gray-500 mt-4">
              Akompta AI v1.0
            </div>
          </>
        )}
      </div>
    </div>
  );
};