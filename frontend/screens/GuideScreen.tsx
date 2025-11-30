
import React from 'react';
import { Screen } from '../types';
import { Header } from '../components/Shared';
import { Mic, BarChart2, LayoutGrid, Wallet, Search, Printer, Plus } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
  onToggleMenu: () => void;
}

const GuideSection: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  imageUrl?: string;
}> = ({ title, icon, children, imageUrl }) => (
  <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm mb-6 border border-transparent hover:border-primary/10 dark:hover:border-green-400/20 transition-colors">
    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-green-400">
        {icon}
      </div>
      <h3 className="text-primary dark:text-white font-bold text-lg">{title}</h3>
    </div>
    
    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-2 mb-4">
      {children}
    </div>

    {imageUrl && (
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner mt-4">
         <img src={imageUrl} alt={title} className="w-full h-auto object-cover opacity-90" />
      </div>
    )}
  </div>
);

const GuideScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => {
  return (
    <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
      <Header 
        title="Guide d'utilisation" 
        onBack={() => onNavigate(Screen.DASHBOARD)} 
        onMenu={onToggleMenu} 
      />

      <div className="px-6 pb-6">
        <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Bienvenue sur Akompta AI</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Découvrez comment gérer vos finances simplement grâce à notre guide complet.
            </p>
        </div>

        {/* 1. Assistant Vocal */}
        <GuideSection 
            title="Assistant Vocal" 
            icon={<Mic size={24} />}
            imageUrl="https://placehold.co/600x400/14532d/FFF?text=Ecran+Vocal"
        >
            <p>
                Le cœur d'Akompta réside dans sa commande vocale. Pour ajouter une transaction rapidement :
            </p>
            <ul className="list-disc ml-5 space-y-1 mt-2">
                <li>Appuyez sur le bouton <strong>Microphone</strong> central dans le menu.</li>
                <li>Dites simplement : <em>"Ajoute une dépense de 5000 pour le Taxi"</em>.</li>
                <li>L'IA détectera automatiquement le montant, la catégorie et la date.</li>
            </ul>
        </GuideSection>

        {/* 2. Tableau de Bord */}
        <GuideSection 
            title="Tableau de Bord" 
            icon={<BarChart2 size={24} />}
            imageUrl="https://placehold.co/600x400/34d399/14532d?text=Graphiques"
        >
            <p>
                Obtenez une vue d'ensemble de votre santé financière.
            </p>
            <p>
                <strong>Akompta Insights :</strong> En haut de page, notre IA analyse vos données et vous donne 3 conseils clés (ex: "Stock de tomates faible").
            </p>
            <p>
                Les graphiques interactifs vous permettent de comparer vos revenus et dépenses sur différentes périodes.
            </p>
        </GuideSection>

        {/* 3. Gestion & Produits */}
        <GuideSection 
            title="Gestion des Produits" 
            icon={<LayoutGrid size={24} />}
        >
            <p>
                Gérez votre inventaire et vos services depuis l'onglet <strong>Gestion</strong>.
            </p>
            <div className="flex items-start gap-3 mt-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                <Plus className="shrink-0 text-primary dark:text-green-400" size={20} />
                <span>Utilisez le bouton <strong>+</strong> pour ajouter un nouveau produit ou service à votre catalogue.</span>
            </div>
            <div className="flex items-start gap-3 mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                <Search className="shrink-0 text-primary dark:text-green-400" size={20} />
                <span>Cliquez sur une carte produit pour voir les détails, modifier le stock ou supprimer l'article.</span>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Astuce : Vous pouvez exporter votre catalogue en CSV via le bouton en haut à droite.
            </p>
        </GuideSection>

        {/* 4. Portefeuille & Rapports */}
        <GuideSection 
            title="Portefeuille & Rapports" 
            icon={<Wallet size={24} />}
        >
            <p>
                L'écran Portefeuille liste toutes vos transactions (Ventes et Dépenses).
            </p>
            <ul className="list-disc ml-5 space-y-1 mt-2">
                <li>Utilisez la <strong>barre de recherche</strong> pour retrouver une opération spécifique.</li>
                <li>Cliquez sur une transaction pour voir le détail et imprimer un <strong>Reçu individuel</strong>.</li>
            </ul>
            <div className="flex items-center gap-2 mt-4 text-primary dark:text-green-400 font-medium">
                <Printer size={18} />
                <span>Imprimer un rapport global</span>
            </div>
            <p className="mt-1">
                Cliquez sur l'icône d'imprimante en haut à droite pour générer un rapport PDF de toutes vos transactions filtrées.
            </p>
        </GuideSection>
        
        <div className="bg-primary/10 dark:bg-gray-800 rounded-2xl p-6 text-center mt-8 transition-colors">
            <h4 className="text-primary dark:text-white font-bold mb-2">Besoin d'aide supplémentaire ?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Notre équipe de support est disponible 24/7 pour les membres Premium.</p>
            <button className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                Contacter le support
            </button>
        </div>
      </div>
    </div>
  );
};

export default GuideScreen;