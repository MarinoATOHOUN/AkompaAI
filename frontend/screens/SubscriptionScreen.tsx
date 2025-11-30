
import React, { useState } from 'react';
import { Screen } from '../types';
import { Header, Button } from '../components/Shared';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
  onToggleMenu: () => void;
}

const FeatureItem: React.FC<{ text: string; included?: boolean }> = ({ text, included = true }) => (
  <div className={`flex items-center gap-3 mb-2 ${included ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${included ? 'bg-accent/20 text-accent' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
      <Check size={12} strokeWidth={3} />
    </div>
    <span className="text-sm dark:text-gray-300">{text}</span>
  </div>
);

const SubscriptionScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
      <Header
        title="Abonnement"
        onBack={() => onNavigate(Screen.DASHBOARD)}
        onMenu={onToggleMenu}
      />

      <div className="px-6 pb-6">
        {/* Toggle Switch */}
        <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-full flex relative shadow-sm">
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 ${billingCycle === 'monthly' ? 'text-primary dark:text-white' : 'text-gray-400'}`}
                >
                    Mensuel
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 ${billingCycle === 'yearly' ? 'text-primary dark:text-white' : 'text-gray-400'}`}
                >
                    Annuel <span className="text-[10px] text-orange-500 font-bold ml-1">-20%</span>
                </button>
                <div className={`absolute top-1 bottom-1 w-[50%] bg-[#dcece6] dark:bg-gray-700 rounded-full transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1' : 'left-[49%]'}`}></div>
            </div>
        </div>

        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 mb-6 shadow-sm border border-transparent hover:border-primary/20 dark:hover:border-green-400/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-primary dark:text-white font-bold text-xl">Starter</h3>
                    <p className="text-gray-400 text-xs">Pour débuter</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-1">
                    <span className="text-primary dark:text-white font-bold text-lg">0F</span>
                </div>
            </div>
            
            <div className="mb-6">
                <FeatureItem text="Gestion basique des stocks" />
                <FeatureItem text="Historique (30 jours)" />
                <FeatureItem text="3 rapports par mois" />
                <FeatureItem text="Assistant vocal IA (Limité)" included={false} />
            </div>

            <Button variant="outline" className="w-full py-3 text-sm">Votre plan actuel</Button>
        </div>

        {/* Premium Plan */}
        <div className="bg-primary rounded-[30px] p-6 mb-6 shadow-xl relative overflow-hidden transform scale-105 border-2 border-accent">
            <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                POPULAIRE
            </div>
            
            <div className="flex justify-between items-start mb-4 text-white">
                <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        Premium <Crown size={18} className="text-yellow-400 fill-current" />
                    </h3>
                    <p className="text-white/60 text-xs">Pour les pros</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{billingCycle === 'monthly' ? '5.000F' : '48.000F'}</div>
                    <div className="text-[10px] opacity-70">/{billingCycle === 'monthly' ? 'mois' : 'an'}</div>
                </div>
            </div>

            <div className="mb-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center">
                        <Zap size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">Assistant Vocal Illimité</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm">Analyses IA avancées</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm">Export Excel & PDF</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-primary flex items-center justify-center">
                        <Star size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm">Support prioritaire 24/7</span>
                </div>
            </div>

            <Button className="w-full bg-white text-primary py-3 text-sm font-bold shadow-none hover:bg-gray-100">
                Passer en Premium
            </Button>
        </div>

        <div className="text-center px-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
                L'abonnement se renouvelle automatiquement. Vous pouvez annuler à tout moment depuis les paramètres.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;