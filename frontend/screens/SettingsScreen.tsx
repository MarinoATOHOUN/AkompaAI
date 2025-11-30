
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { Header } from '../components/Shared';
import { ChevronRight, Globe, Shield, Bell, Lock, FileText, Moon, Wallet, Server, Key, Check, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (screen: Screen) => void;
  onToggleMenu: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface SettingsItemProps {
  icon: any;
  label: string;
  value?: string;
  isToggle?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, value, isToggle, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl mb-3 shadow-sm active:scale-[0.99] transition-transform group hover:bg-white/80 dark:hover:bg-gray-700 cursor-pointer`}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-green-400 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={20} />
      </div>
      <span className="text-gray-700 dark:text-gray-200 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>}
      {isToggle ? (
        <div className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-primary dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isActive ? 'right-1' : 'left-1'}`}></div>
        </div>
      ) : (
        <ChevronRight size={20} className="text-gray-400" />
      )}
    </div>
  </div>
);

const SettingsScreen: React.FC<Props> = ({ onNavigate, onToggleMenu, isDarkMode, onToggleDarkMode }) => {
  const { user, changePassword } = useAuth();

  // States for settings
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Language State
  const [language, setLanguage] = useState('Français');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Currency State
  const [currency, setCurrency] = useState('FCFA (XOF)');
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  // Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // State for confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    type: 'faceId' | 'push' | 'darkMode';
    label: string;
    newValue: boolean;
  } | null>(null);

  const handleToggle = (setting: 'faceId' | 'push' | 'darkMode') => {
    if (setting === 'darkMode') {
      onToggleDarkMode();
      return;
    }

    if (setting === 'faceId') {
      setConfirmModal({
        type: 'faceId',
        label: 'Face ID',
        newValue: !faceIdEnabled
      });
    }

    if (setting === 'push') {
      setConfirmModal({
        type: 'push',
        label: 'Push Notifications',
        newValue: !pushEnabled
      });
    }
  };

  const applyChange = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'faceId') {
      setFaceIdEnabled(confirmModal.newValue);
    } else if (confirmModal.type === 'push') {
      setPushEnabled(confirmModal.newValue);
    }

    setConfirmModal(null);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.old_password?.[0] || 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar relative transition-colors">
      <Header
        title="Paramètres"
        onBack={() => onNavigate(Screen.DASHBOARD)}
        onMenu={onToggleMenu}
      />

      <div className="px-6 pt-2">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2">Général</h3>
        <SettingsItem
          icon={Globe}
          label="Langue"
          value={language}
          onClick={() => setShowLanguageSelector(true)}
        />
        <SettingsItem
          icon={Wallet}
          label="Devise"
          value={currency}
          onClick={() => setShowCurrencySelector(true)}
        />
        <SettingsItem
          icon={Moon}
          label="Mode Sombre"
          isToggle={true}
          isActive={isDarkMode}
          onClick={() => handleToggle('darkMode')}
        />

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2 mt-6">Sécurité</h3>
        <SettingsItem
          icon={Key}
          label="Mot de passe"
          onClick={() => setShowPasswordModal(true)}
        />
        <SettingsItem
          icon={Shield}
          label="Face ID"
          isToggle={true}
          isActive={faceIdEnabled}
          onClick={() => handleToggle('faceId')}
        />
        <SettingsItem
          icon={Lock}
          label="Sécurité et vie privée"
          onClick={() => onNavigate(Screen.SECURITY_PRIVACY)}
        />
        <SettingsItem
          icon={Server}
          label="Sécurité données"
          onClick={() => onNavigate(Screen.DATA_SECURITY)}
        />

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2 mt-6">Notifications</h3>
        <SettingsItem
          icon={Bell}
          label="Push Notifications"
          isToggle={true}
          isActive={pushEnabled}
          onClick={() => handleToggle('push')}
        />

        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2 mt-6">Info</h3>
        <SettingsItem
          icon={FileText}
          label="Conditions d'utilisation"
          onClick={() => onNavigate(Screen.TERMS)}
        />
        <SettingsItem
          icon={Building2}
          label="Conditions Business"
          onClick={() => onNavigate(Screen.BUSINESS_TERMS)}
        />
        <SettingsItem
          icon={FileText}
          label="Politique de confidentialité"
          onClick={() => onNavigate(Screen.PRIVACY)}
        />

        <div className="mt-8 text-center">
          <div className="text-primary dark:text-green-400 font-bold text-lg">Akompta AI</div>
          <div className="text-xs text-gray-400 pb-8">Version 1.0.2</div>
        </div>
      </div>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowLanguageSelector(false)}></div>

          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[30px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Langue</h3>

            <div className="space-y-3">
              {['Français', 'English', 'Español', 'Português'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLanguageSelector(false);
                  }}
                  className={`w-full p-4 rounded-2xl flex justify-between items-center text-left transition-all ${language === lang
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                >
                  <span className="font-bold">{lang}</span>
                  {language === lang && <Check size={20} />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLanguageSelector(false)}
              className="w-full mt-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Currency Selector Modal */}
      {showCurrencySelector && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCurrencySelector(false)}></div>

          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[30px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Devise</h3>

            <div className="space-y-3">
              {['FCFA (XOF)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'NGN (₦)'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setShowCurrencySelector(false);
                  }}
                  className={`w-full p-4 rounded-2xl flex justify-between items-center text-left transition-all ${currency === curr
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                >
                  <span className="font-bold">{curr}</span>
                  {currency === curr && <Check size={20} />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCurrencySelector(false)}
              className="w-full mt-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowPasswordModal(false)}></div>

          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[30px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Changer mot de passe</h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2">Actuel</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2">Nouveau</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2">Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm text-center">{passwordError}</div>
              )}

              <div className="flex gap-3 w-full mt-8">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setConfirmModal(null)}></div>

          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[30px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-green-400 mb-4">
                <Shield size={32} />
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirmation</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 px-2">
                Voulez-vous vraiment {confirmModal.newValue ? 'activer' : 'désactiver'} l'option <span className="font-bold text-gray-700 dark:text-gray-300">{confirmModal.label}</span> ?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={applyChange}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;