
import React from 'react';
import { Screen } from '../types';
import { ChevronDown, ArrowRight, Mic, TrendingUp, ShieldCheck, Globe, Database, WifiOff, Users, Landmark } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
    <div className="text-[#4ade80] mb-2">{icon}</div>
    <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
    <p className="text-gray-300 text-[10px] leading-tight">{desc}</p>
  </div>
);

const LandingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col relative bg-gray-900 font-sans">
      {/* Background Image - Market/Trade theme */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1550355191-aa8a80b41353?q=80&w=800&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-60" 
            alt="African Market Commerce" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#14532d]/80 via-[#14532d]/40 to-[#14532d] z-0"></div>
      </div>
      
      {/* Header Content */}
      <div className="relative z-10 pt-12 px-8 text-center animate-in fade-in duration-700">
          <h1 className="text-white text-5xl font-bold tracking-tighter mb-2">Akompta AI</h1>
          <p className="text-[#4ade80] font-medium tracking-widest text-xs uppercase">La Comptabilité par la Voix</p>
      </div>

      {/* Main Scrollable Card */}
      <div className="absolute bottom-0 left-0 right-0 top-[20%] bg-[#14532d] rounded-t-[40px] shadow-[0_-10px_60px_rgba(0,0,0,0.5)] z-20 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 border-t border-[#4ade80]/20">
          
          {/* Action Button - Floating */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30">
            <button 
                onClick={() => onNavigate(Screen.LOGIN)}
                className="bg-[#4ade80] w-16 h-16 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(74,222,128,0.4)] hover:scale-105 transition-transform active:scale-95 border-4 border-[#14532d]"
            >
                <ArrowRight size={32} className="text-[#14532d] font-bold" strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-12 pb-32">
            
            {/* Intro Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl text-white font-bold mb-3 leading-tight">
                    Formaliser l'informel,<br/>simplement.
                </h2>
                <p className="text-gray-200 text-sm leading-relaxed">
                    Une application conçue pour nos commerçants et grossistes. Oubliez les cahiers compliqués : parlez dans votre langue locale, Akompta s'occupe du reste.
                </p>
            </div>

            {/* Key Value Props Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <FeatureCard 
                    icon={<Mic size={24} />} 
                    title="100% Vocal" 
                    desc="Enregistrez vos ventes et stocks à la voix, en langue locale (Fon, Yoruba, etc.). Idéal même sans savoir lire." 
                />
                <FeatureCard 
                    icon={<Landmark size={24} />} 
                    title="Accès aux Prêts" 
                    desc="Générez des bilans comptables fiables pour obtenir des crédits bancaires et microfinances." 
                />
                <FeatureCard 
                    icon={<WifiOff size={24} />} 
                    title="Mode Hors-Ligne" 
                    desc="Fonctionne partout, même sans connexion internet dans les marchés reculés." 
                />
                <FeatureCard 
                    icon={<Database size={24} />} 
                    title="Blockchain" 
                    desc="Vos données valorisent les produits locaux sur les marchés financiers et boursiers." 
                />
            </div>

            {/* Impact Section */}
            <div className="mb-8 bg-white/5 rounded-2xl p-5 border border-white/5">
                <h3 className="text-[#4ade80] font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp size={20} /> Impact Économique
                </h3>
                <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] mt-1.5 shrink-0"></div>
                        <p>Inclusion financière pour les femmes des marchés ("Mamas").</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] mt-1.5 shrink-0"></div>
                        <p>Traçabilité et sécurité des fonds par l'épargne mobile.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] mt-1.5 shrink-0"></div>
                        <p>Contribution au PIB et aux recettes fiscales de l'État.</p>
                    </li>
                </ul>
            </div>

            {/* Pricing & Partners */}
            <div className="mb-8 text-center">
                 <div className="inline-block bg-[#4ade80] text-[#14532d] px-4 py-1 rounded-full text-xs font-bold mb-6">
                    Abonnement: 500 FCFA / Semaine
                 </div>
                 
                 <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-4">Nos Partenaires</p>
                 <div className="flex flex-wrap justify-center gap-4 opacity-70 grayscale">
                    {/* Placeholder for Logos - Using text for now as per constraints */}
                    <span className="text-white font-bold text-xs border border-white/30 px-2 py-1 rounded">UNFPA</span>
                    <span className="text-white font-bold text-xs border border-white/30 px-2 py-1 rounded">CEDEAO</span>
                    <span className="text-white font-bold text-xs border border-white/30 px-2 py-1 rounded">World Bank</span>
                    <span className="text-white font-bold text-xs border border-white/30 px-2 py-1 rounded">WEF</span>
                 </div>
            </div>

            <button 
                onClick={() => onNavigate(Screen.LOGIN)}
                className="w-full py-4 bg-white text-[#14532d] rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl active:scale-[0.98] mb-4"
            >
                Commencer maintenant
            </button>
            
            <p className="text-center text-white/40 text-[10px]">
                Akompta AI v1.0 • Solutions pour l'économie informelle
            </p>
          </div>
      </div>
    </div>
  );
};

export default LandingScreen;
