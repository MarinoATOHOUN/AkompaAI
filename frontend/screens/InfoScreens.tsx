
import React from 'react';
import { Screen } from '../types';
import { Header } from '../components/Shared';
import { Shield, Lock, FileText, Server, Building2 } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
  onToggleMenu: () => void;
}

// Reusable Layout Component for Text Pages
const InfoPageLayout: React.FC<{
  title: string;
  onNavigate: (screen: Screen) => void;
  onToggleMenu: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  backScreen?: Screen;
}> = ({ title, onNavigate, onToggleMenu, children, icon, backScreen = Screen.SETTINGS }) => (
  <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
    <Header
      title={title}
      onBack={() => onNavigate(backScreen)}
      onMenu={onToggleMenu}
    />
    <div className="px-6 pb-8">
      {icon && (
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-green-400">
            {icon}
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-4 transition-colors">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => (
  <InfoPageLayout
    title="Confidentialité"
    onNavigate={onNavigate}
    onToggleMenu={onToggleMenu}
    icon={<Lock size={32} />}
  >
    <h3 className="text-primary dark:text-white font-bold text-lg mb-2">1. Collecte des données</h3>
    <p>
      Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre application, notamment votre nom, adresse e-mail, et les données de transaction financière que vous saisissez ou dictez.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">2. Utilisation des données</h3>
    <p>
      Vos données sont utilisées pour :
      <ul className="list-disc ml-5 mt-2 space-y-1">
        <li>Fournir et maintenir le service Akompta AI.</li>
        <li>Générer des analyses financières personnalisées.</li>
        <li>Améliorer nos modèles d'intelligence artificielle (de manière anonymisée).</li>
      </ul>
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">3. Partage des informations</h3>
    <p>
      Nous ne vendons jamais vos données personnelles. Le partage se limite aux tiers nécessaires au fonctionnement du service (hébergement, services d'IA) sous des accords de confidentialité stricts.
    </p>
  </InfoPageLayout>
);

export const TermsScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => (
  <InfoPageLayout
    title="Conditions"
    onNavigate={onNavigate}
    onToggleMenu={onToggleMenu}
    icon={<FileText size={32} />}
  >
    <h3 className="text-primary dark:text-white font-bold text-lg mb-2">1. Acceptation</h3>
    <p>
      En accédant à Akompta AI, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">2. Licence d'utilisation</h3>
    <p>
      Il est permis de télécharger temporairement une copie des documents (informations ou logiciels) sur le site web d'Akompta AI pour une visualisation transitoire personnelle et non commerciale uniquement.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">3. Avertissement</h3>
    <p>
      Les analyses fournies par l'IA sont données à titre indicatif. Akompta AI ne remplace pas un expert-comptable certifié et ne peut être tenu responsable des erreurs financières basées sur ses suggestions.
    </p>
  </InfoPageLayout>
);

export const SecurityPrivacyScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => (
  <InfoPageLayout
    title="Vie Privée"
    onNavigate={onNavigate}
    onToggleMenu={onToggleMenu}
    icon={<Shield size={32} />}
  >
    <p className="font-medium text-primary dark:text-white mb-4">
      Votre vie privée est au cœur de notre conception. Voici comment vous gardez le contrôle.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2">Contrôle d'accès</h3>
    <p>
      Vous seul avez accès à vos données financières détaillées. Nos employés n'ont pas accès à vos transactions brutes sans votre consentement explicite pour le support technique.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">Vos droits</h3>
    <p>
      Conformément au RGPD et aux lois locales, vous avez le droit de :
      <ul className="list-disc ml-5 mt-2 space-y-1">
        <li>Demander une copie de toutes vos données.</li>
        <li>Demander la suppression complète de votre compte.</li>
        <li>Rectifier toute information inexacte.</li>
      </ul>
    </p>
  </InfoPageLayout>
);

export const DataSecurityScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => (
  <InfoPageLayout
    title="Sécurité Données"
    onNavigate={onNavigate}
    onToggleMenu={onToggleMenu}
    icon={<Server size={32} />}
  >
    <h3 className="text-primary dark:text-white font-bold text-lg mb-2">Chiffrement</h3>
    <p>
      Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Vos mots de passe sont hachés et salés en utilisant les standards industriels les plus élevés.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">Infrastructure</h3>
    <p>
      Nos serveurs sont hébergés dans des centres de données certifiés SOC 2 Type II, garantissant une sécurité physique et numérique maximale.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">Sauvegardes</h3>
    <p>
      Des sauvegardes automatiques sont effectuées quotidiennement pour prévenir toute perte de données accidentelle.
    </p>
  </InfoPageLayout>
);

export const BusinessTermsScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => (
  <InfoPageLayout
    title="Conditions Business"
    onNavigate={onNavigate}
    onToggleMenu={onToggleMenu}
    icon={<Building2 size={32} />}
    // Defaulting to Settings for back nav, but allows consistency
  >
    <p className="font-medium text-primary dark:text-white mb-4">
      Les conditions spécifiques pour les comptes Professionnels et Entreprises.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2">1. Certification & Vérification</h3>
    <p>
      Les comptes Business doivent fournir un numéro IFU valide et une preuve d'activité commerciale. Akompta se réserve le droit de suspendre tout compte Business non vérifié après 30 jours.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">2. Responsabilité Fiscale</h3>
    <p>
      L'utilisateur est seul responsable de la déclaration de ses revenus aux autorités compétentes. Les rapports générés par Akompta AI sont des outils de gestion et ne constituent pas une déclaration fiscale officielle certifiée sans validation par un expert-comptable.
    </p>

    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">3. Utilisation Commerciale</h3>
    <p>
      L'abonnement Business permet l'utilisation des fonctionnalités de gestion de stock et de facturation pour un nombre illimité de clients. La revente du logiciel ou de l'accès est strictement interdite.
    </p>
    
    <h3 className="text-primary dark:text-white font-bold text-lg mb-2 mt-4">4. Tarification</h3>
    <p>
      Les comptes Business sont soumis à un abonnement mensuel ou annuel. Tout changement tarifaire sera notifié 30 jours à l'avance.
    </p>
  </InfoPageLayout>
);