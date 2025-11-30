
import React, { useState, useEffect } from 'react';
import { Screen, Transaction, UserProfile } from './types';
import BottomNav from './components/BottomNav';
import { RECENT_TRANSACTIONS } from './constants';
import { MenuOverlay } from './components/Shared';

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

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING);
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);
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

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTx
    };
    setTransactions(prev => [transaction, ...prev]);
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