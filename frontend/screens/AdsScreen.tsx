
import React, { useState } from 'react';
import { Screen } from '../types';
import { Header } from '../components/Shared';
import { ExternalLink, MessageCircle, MapPin, Globe, Store, User, PlusCircle, X, ChevronRight, ChevronLeft, Check, Image as ImageIcon, Tag } from 'lucide-react';
import { useAds } from '../hooks';

interface Props {
    onNavigate: (screen: Screen) => void;
    onToggleMenu: () => void;
}

interface AdData {
    id: number;
    productName: string;
    owner: string;
    description: string;
    image: string;
    whatsapp: string;
    website: string;
    location: string;
    verified: boolean;
}

const AdsScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => {
    const { data: adsData, loading, addAd } = useAds();

    // Wizard State
    const [isPublishing, setIsPublishing] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        productName: '',
        owner: '',
        description: '',
        whatsapp: '',
        website: '',
        location: ''
    });

    // Transform API data to local format
    const localAds: AdData[] = adsData.map((ad: any) => ({
        id: parseInt(ad.id),
        productName: ad.product_name,
        owner: ad.owner_name,
        description: ad.description,
        image: ad.image || `https://picsum.photos/seed/${ad.id}/600/400`,
        whatsapp: ad.whatsapp,
        website: ad.website || '',
        location: ad.location,
        verified: ad.is_verified
    }));

    const handleWhatsapp = (number: string) => {
        window.open(`https://wa.me/${number}`, '_blank');
    };

    const handleWebsite = (url: string) => {
        window.open(url, '_blank');
    };

    // Wizard Handlers
    const openWizard = () => {
        setIsPublishing(true);
        setCurrentStep(1);
        setFormData({
            productName: '',
            owner: '',
            description: '',
            whatsapp: '',
            website: '',
            location: ''
        });
    };

    const closeWizard = () => {
        setIsPublishing(false);
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            await addAd({
                product_name: formData.productName,
                owner_name: formData.owner,
                description: formData.description,
                whatsapp: formData.whatsapp,
                website: formData.website,
                location: formData.location
            });
            closeWizard();
        } catch (error) {
            console.error('Error creating ad:', error);
        }
    };

    // Validation for button state
    const isStepValid = () => {
        switch (currentStep) {
            case 1: return formData.productName.length > 2;
            case 2: return formData.owner.length > 2;
            case 3: return formData.description.length > 10;
            case 4: return formData.whatsapp.length > 5 && formData.location.length > 2;
            default: return false;
        }
    };

    return (
        <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
            <Header
                title="Vitrine Partenaires"
                onBack={() => onNavigate(Screen.DASHBOARD)}
                onMenu={onToggleMenu}
            />

            <div className="px-6 pb-6 space-y-6">

                {/* Intro / CTA to advertise */}
                <div className="bg-primary dark:bg-green-700 rounded-[30px] p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Boostez votre visibilité !</h2>
                        <p className="text-white/80 text-sm mb-4 max-w-[80%]">
                            Mettez en avant vos produits et services auprès de milliers d'utilisateurs Akompta.
                        </p>
                        <button
                            onClick={openWizard}
                            className="bg-white text-primary font-bold py-3 px-6 rounded-full text-sm shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                            <PlusCircle size={18} /> Publier une annonce
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 text-white">
                        <Store size={180} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">Annonces à la une</h3>
                    <span className="text-xs text-primary dark:text-green-400 font-medium">Voir tout</span>
                </div>

                <div className="space-y-6">
                    {localAds.map((ad) => (
                        <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-[30px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10 dark:hover:border-green-400/20 group">
                            {/* Image Header */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={ad.image}
                                    alt={ad.productName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-white shadow-sm">
                                    <User size={12} className="text-primary dark:text-green-400" />
                                    {ad.owner}
                                    {ad.verified && (
                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center" title="Vérifié">
                                            <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5 text-white" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-xl text-primary dark:text-white leading-tight">{ad.productName}</h4>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3 font-medium">
                                    <MapPin size={14} className="text-gray-300 dark:text-gray-500" /> {ad.location}
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                                    {ad.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleWhatsapp(ad.whatsapp)}
                                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl font-bold text-sm shadow-[#25D366]/20 shadow-lg hover:bg-[#20bd5a] transition-colors active:scale-95"
                                    >
                                        <MessageCircle size={18} /> WhatsApp
                                    </button>

                                    {ad.website ? (
                                        <button
                                            onClick={() => handleWebsite(ad.website!)}
                                            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-95"
                                        >
                                            <Globe size={18} /> Site Web
                                        </button>
                                    ) : (
                                        <button className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 py-3 rounded-2xl font-bold text-sm cursor-not-allowed border border-gray-100 dark:border-gray-700">
                                            <Globe size={18} /> Site Web
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center text-xs text-gray-400 mt-4 pb-4">
                    Publicité sponsorisée par Akompta Ads
                </div>
            </div>

            {/* Publication Wizard Modal */}
            {isPublishing && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeWizard}></div>

                    <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-[40px] rounded-t-[40px] p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Créer une annonce</h3>
                                <p className="text-xs text-gray-400">Étape {currentStep} sur 4</p>
                            </div>
                            <button
                                onClick={closeWizard}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
                            <div
                                className="h-full bg-primary dark:bg-green-500 transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${(currentStep / 4) * 100}%` }}
                            ></div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar mb-6">

                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-2">
                                            <Tag size={40} />
                                        </div>
                                    </div>
                                    <h4 className="text-center text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Que vendez-vous ?</h4>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Nom du produit / service</label>
                                        <input
                                            value={formData.productName}
                                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                            placeholder="Ex: Tomates Fraîches, Service Transport..."
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium text-lg placeholder-gray-400"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                                        <div className="shrink-0 mt-0.5"><Check size={16} /></div>
                                        <p>Un nom clair et précis attire 3x plus de clients.</p>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 mb-2">
                                            <Store size={40} />
                                        </div>
                                    </div>
                                    <h4 className="text-center text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Qui propose cette offre ?</h4>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Nom de l'entreprise ou Vendeur</label>
                                        <input
                                            value={formData.owner}
                                            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                            placeholder="Ex: Ma Ferme Bio, Koffi Transports..."
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium text-lg placeholder-gray-400"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-500 mb-2">
                                            <ImageIcon size={40} />
                                        </div>
                                    </div>
                                    <h4 className="text-center text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Détails de l'offre</h4>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Décrivez votre produit, prix, conditionnement..."
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium text-base placeholder-gray-400 min-h-[150px] resize-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                                            <MessageCircle size={40} />
                                        </div>
                                    </div>
                                    <h4 className="text-center text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Comment vous contacter ?</h4>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Numéro WhatsApp</label>
                                        <div className="relative">
                                            <MessageCircle size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={formData.whatsapp}
                                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                                placeholder="229..."
                                                type="tel"
                                                className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium placeholder-gray-400"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Ville / Localisation</label>
                                        <div className="relative">
                                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="Ex: Cotonou"
                                                className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Site Web (Optionnel)</label>
                                        <div className="relative">
                                            <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                placeholder="https://..."
                                                className="w-full bg-gray-50 dark:bg-gray-700 px-6 py-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Buttons */}
                        <div className="flex gap-3 mt-auto">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <button
                                onClick={currentStep === 4 ? handleSubmit : handleNext}
                                disabled={!isStepValid()}
                                className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isStepValid()
                                        ? 'bg-primary hover:bg-primary/90 shadow-primary/30'
                                        : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {currentStep === 4 ? (
                                    <>Publier l'annonce <Check size={20} /></>
                                ) : (
                                    <>Suivant <ChevronRight size={20} /></>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsScreen;
