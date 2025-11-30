
import React from 'react';
import { Home, Wallet, Mic, User, BarChart2, LayoutGrid } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItemClass = (screen: Screen) =>
    `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${
      currentScreen === screen ? 'text-primary dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
    }`;

  // Helper to determine if a nav item is effectively active (e.g., grouped screens)
  const isActive = (screen: Screen) => currentScreen === screen;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] rounded-t-3xl py-4 px-6 flex justify-between items-end z-50 transition-colors">
      <button onClick={() => onNavigate(Screen.WALLET)} className={navItemClass(Screen.WALLET)}>
        <Wallet size={24} />
      </button>

      <button onClick={() => onNavigate(Screen.DASHBOARD)} className={navItemClass(Screen.DASHBOARD)}>
        <BarChart2 size={24} />
      </button>

      {/* Center Voice Button */}
      <div className="relative -top-6">
        <button
          onClick={() => onNavigate(Screen.VOICE)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
             currentScreen === Screen.VOICE ? 'bg-primary text-white ring-4 ring-green-100 dark:ring-green-900' : 'bg-primary text-white'
          }`}
        >
          <Mic size={32} />
        </button>
      </div>

      <button onClick={() => onNavigate(Screen.NOTIFICATIONS)} className={navItemClass(Screen.NOTIFICATIONS)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      </button>

      <button onClick={() => onNavigate(Screen.MANAGEMENT)} className={navItemClass(Screen.MANAGEMENT)}>
         <LayoutGrid size={24} />
      </button>
    </div>
  );
};

export default BottomNav;