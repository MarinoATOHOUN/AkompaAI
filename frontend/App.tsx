
import React, { useState, useEffect } from 'react';
import { Screen, Transaction, UserProfile } from './types';
import BottomNav from './components/BottomNav';
import { MenuOverlay } from './components/Shared';
import { useTransactions } from './hooks';

// Screens
import { LoginScreen, RegisterScreen, RecoveryEmailScreen, RecoveryCodeScreen } from './screens/AuthScreens';
import DashboardScreen from './screens/DashboardScreen';
import ManagementScreen from './screens/ManagementScreen';
import VoiceScreen from './screens/VoiceScreen';
import WalletScreen from './screens/WalletScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import AdsScreen from './screens/AdsScreen'; // Import AdsScreen
import ProfileScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen';
import LandingScreen from './screens/LandingScreen';
import SettingsScreen from './screens/SettingsScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import GuideScreen from './screens/GuideScreen';
import SupportScreen from './screens/SupportScreen';
import { PrivacyScreen, TermsScreen, SecurityPrivacyScreen, DataSecurityScreen, BusinessTermsScreen } from './screens/InfoScreens';

import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const savedScreen = localStorage.getItem('akompta_current_screen');
    return (savedScreen as Screen) || Screen.LANDING;
  });
  const { data: transactions, addTransaction: addTransactionToBackend } = useTransactions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Akompta Admin',
    image: 'https://picsum.photos/id/64/100/100',
    email: 'admin@akompta.com',
    phone: '+229 97 00 00 00',
    accountType: 'business',
    businessName: 'Akompta Store',
    sector: 'Commerce Général',
    location: 'Cotonou, Bénin',
    ifu: '123456789000'
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('akompta_dark_mode');
    if (savedMode !== null) return savedMode === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('akompta_dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist current screen
  useEffect(() => {
    localStorage.setItem('akompta_current_screen', currentScreen);
  }, [currentScreen]);

  // Redirect based on auth state
  useEffect(() => {
    if (!authLoading) {
      const publicScreens = [
        Screen.LANDING, Screen.LOGIN, Screen.REGISTER, Screen.RECOVERY_EMAIL, Screen.RECOVERY_CODE,
        Screen.PRIVACY, Screen.TERMS, Screen.SECURITY_PRIVACY, Screen.DATA_SECURITY, Screen.BUSINESS_TERMS
      ];
      const isPublicScreen = publicScreens.includes(currentScreen);
      const authScreens = [Screen.LANDING, Screen.LOGIN, Screen.REGISTER, Screen.RECOVERY_EMAIL, Screen.RECOVERY_CODE];
      const isAuthFlowScreen = authScreens.includes(currentScreen);

      if (user && isAuthFlowScreen) {
        setCurrentScreen(Screen.DASHBOARD);
      } else if (!user && !isPublicScreen) {
        setCurrentScreen(Screen.LANDING);
      }
    }
  }, [user, authLoading]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    try {
      return await addTransactionToBackend(newTx);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      throw error;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LANDING:
        return <LandingScreen onNavigate={navigate} />;
      case Screen.LOGIN:
        return <LoginScreen onNavigate={navigate} />;
      case Screen.REGISTER:
        return <RegisterScreen onNavigate={navigate} />;
      case Screen.RECOVERY_EMAIL:
        return <RecoveryEmailScreen onNavigate={navigate} />;
      case Screen.RECOVERY_CODE:
        return <RecoveryCodeScreen onNavigate={navigate} />;
      case Screen.DASHBOARD:
        return <DashboardScreen onNavigate={navigate} onToggleMenu={toggleMenu} isDarkMode={isDarkMode} transactions={transactions} />;
      case Screen.MANAGEMENT:
        return <ManagementScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.VOICE:
        return <VoiceScreen onNavigate={navigate} onAddTransaction={handleAddTransaction} onToggleMenu={toggleMenu} />;
      case Screen.WALLET:
        return <WalletScreen onNavigate={navigate} transactions={transactions} onToggleMenu={toggleMenu} isDarkMode={isDarkMode} onAddTransaction={handleAddTransaction} />;
      case Screen.TRANSACTIONS:
        return <TransactionsScreen onNavigate={navigate} transactions={transactions} onToggleMenu={toggleMenu} />;
      case Screen.ADS:
        return <AdsScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.PROFILE:
        return <ProfileScreen
          onNavigate={navigate}
          onToggleMenu={toggleMenu}
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
        />;
      case Screen.NOTIFICATIONS:
        return <NotificationScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.SETTINGS:
        return <SettingsScreen onNavigate={navigate} onToggleMenu={toggleMenu} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case Screen.SUBSCRIPTION:
        return <SubscriptionScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.GUIDE:
        return <GuideScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.SUPPORT:
        return <SupportScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.PRIVACY:
        return <PrivacyScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.TERMS:
        return <TermsScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.SECURITY_PRIVACY:
        return <SecurityPrivacyScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.DATA_SECURITY:
        return <DataSecurityScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      case Screen.BUSINESS_TERMS:
        return <BusinessTermsScreen onNavigate={navigate} onToggleMenu={toggleMenu} />;
      default:
        return <LandingScreen onNavigate={navigate} />;
    }
  };

  // Logic: Show standard BottomNav on all screens except Auth screens and Landing screen.
  // Note: Terms screens usually don't have nav if accessed from Register, but if accessed from Settings they might.
  // For simplicity we hide nav on Auth flow screens, show on others.
  const authScreens = [Screen.LANDING, Screen.LOGIN, Screen.REGISTER, Screen.RECOVERY_EMAIL, Screen.RECOVERY_CODE];
  const shouldShowStandardNav = !authScreens.includes(currentScreen);

  if (authLoading) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#dcece6] dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-primary font-medium animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} w-full h-[100dvh] md:h-[844px] max-w-md mx-auto`}>
      <div className="w-full h-full bg-[#dcece6] dark:bg-gray-900 relative overflow-hidden md:rounded-[40px] shadow-2xl flex flex-col transition-colors duration-300">
        <MenuOverlay
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={navigate}
          userProfile={userProfile}
        />

        {/* Content Area */}
        <div className="flex-1 h-full w-full overflow-hidden relative">
          {renderScreen()}
        </div>

        {/* Navigation */}
        {shouldShowStandardNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
        )}
      </div>
    </div>
  );
};

export default App;