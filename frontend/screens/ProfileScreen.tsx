
import React, { useState, useRef, useEffect } from 'react';
import { Screen, UserProfile } from '../types';
import { Header } from '../components/Shared';
import { ChevronDown, DollarSign, Camera, Edit2, CreditCard, Save, Building2, MapPin, Mail, Phone, FileText, User, X, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactionSummary } from '../hooks';

interface Props {
    onNavigate: (screen: Screen) => void;
    onToggleMenu: () => void;
    userProfile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileScreen: React.FC<Props> = ({ onNavigate, onToggleMenu, userProfile, onUpdateProfile }) => {
    const { user, updateProfile } = useAuth();
    const { summary } = useTransactionSummary();

    const [profileName, setProfileName] = useState(user?.first_name + ' ' + user?.last_name || userProfile.name);
    const [balance, setBalance] = useState(summary?.balance || "0");

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit Modal State - Use real user data
    const [editForm, setEditForm] = useState({
        name: user?.first_name + ' ' + user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        accountType: user?.account_type || 'personal' as 'personal' | 'business',
        businessName: user?.business_name || '',
        sector: user?.sector || '',
        location: user?.location || '',
        ifu: user?.ifu || '',
        image: user?.avatar || userProfile.image
    });

    useEffect(() => {
        if (user) {
            const fullName = `${user.first_name} ${user.last_name}`.trim();
            setProfileName(fullName);
            setEditForm({
                name: fullName,
                email: user.email || '',
                phone: user.phone_number || '',
                accountType: user.account_type || 'personal',
                businessName: user.business_name || '',
                sector: user.sector || '',
                location: user.location || '',
                ifu: user.ifu || '',
                image: user.avatar || userProfile.image
            });
        }
    }, [user]);

    useEffect(() => {
        if (summary?.balance) {
            setBalance(parseFloat(summary.balance).toLocaleString());
        }
    }, [summary]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setEditForm({ ...editForm, image: result });
                // TODO: Upload to backend when image upload is implemented
            };
            reader.readAsDataURL(file);
        }
    };

    const saveName = async () => {
        setIsEditingName(false);
        const [firstName, ...lastNameParts] = profileName.split(' ');
        const lastName = lastNameParts.join(' ');

        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName
            });
        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const [firstName, ...lastNameParts] = editForm.name.split(' ');
        const lastName = lastNameParts.join(' ');

        try {
            await updateProfile({
                first_name: firstName,
                last_name: lastName,
                email: editForm.email,
                phone_number: editForm.phone,
                account_type: editForm.accountType,
                business_name: editForm.businessName,
                sector: editForm.sector,
                location: editForm.location,
                ifu: editForm.ifu
            });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
            <Header
                title="Profil"
                onBack={() => onNavigate(Screen.DASHBOARD)}
                onMenu={onToggleMenu}
                actionIcon={<Edit2 size={20} />}
                onAction={() => setShowEditModal(true)}
            />

            <div className="px-6 flex flex-col items-center">
                {/* Profile Image & Name */}
                <div className="flex flex-col items-center mb-6 w-full">
                    <div className="relative group mb-3">
                        <div
                            className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl cursor-pointer relative"
                            onClick={handleImageClick}
                        >
                            <img src={userProfile.image} className="w-full h-full object-cover" alt="Profile" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                        <button
                            onClick={handleImageClick}
                            className="absolute bottom-0 right-0 bg-primary dark:bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-gray-900"
                        >
                            <Edit2 size={12} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 h-8">
                            {isEditingName ? (
                                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                    <input
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-green-400/20 rounded-lg px-3 py-1 text-primary dark:text-white font-bold text-lg text-center w-40 outline-none focus:border-primary dark:focus:border-green-400"
                                        autoFocus
                                        onBlur={saveName}
                                        onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                    />
                                    <button onClick={saveName} className="bg-primary text-white p-1.5 rounded-full">
                                        <Save size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group cursor-pointer px-3 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setIsEditingName(true)}>
                                    <h3 className="text-primary dark:text-white font-bold text-xl">{profileName}</h3>
                                    <Edit2 size={14} className="text-primary/50 dark:text-green-400/50 group-hover:text-primary dark:group-hover:text-green-400 transition-colors" />
                                </div>
                            )}
                        </div>
                        <div className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user?.account_type === 'business' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                            Compte {user?.account_type === 'business' ? 'Business' : 'Personnel'}
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="w-full bg-[#1e2329] dark:bg-gray-800 rounded-[35px] p-6 shadow-xl mb-6 relative overflow-hidden group">
                    <div className="absolute top-6 right-6">
                        <CreditCard className="text-green-500" size={24} />
                    </div>

                    <div className="text-gray-400 text-sm font-medium mb-2">Solde Total</div>

                    <div className="flex items-center mb-6 h-12">
                        {isEditingBalance ? (
                            <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in duration-200">
                                <input
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    className="bg-gray-700 border-2 border-gray-600 rounded-lg px-3 py-1 text-white font-bold text-3xl w-full outline-none focus:border-green-500"
                                    autoFocus
                                    onBlur={() => setIsEditingBalance(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingBalance(false)}
                                />
                                <button onClick={() => setIsEditingBalance(false)} className="bg-green-500 text-white p-2 rounded-lg">
                                    <Save size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsEditingBalance(true)}>
                                <div className="text-white text-4xl font-bold tracking-tight">{balance} FCFA</div>
                                <div className="bg-gray-700/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit2 size={14} className="text-gray-300" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-gray-700/40 text-gray-300 text-[11px] px-3 py-1.5 rounded-lg font-medium border border-gray-600/30">49,89% vente</div>
                        <div className="bg-gray-700/40 text-gray-300 text-[11px] px-3 py-1.5 rounded-lg font-medium border border-gray-600/30">18,27% bénéfice</div>
                        <div className="bg-gray-700/40 text-gray-300 text-[11px] px-3 py-1.5 rounded-lg font-medium border border-gray-600/30">28,13% Dépenses</div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <ChevronDown className="text-green-500" size={24} />
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm mb-6 transition-colors">
                    <h3 className="text-primary dark:text-white font-bold mb-4 flex items-center justify-between">
                        <span>Informations</span>
                        <button onClick={() => setShowEditModal(true)} className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Modifier
                        </button>
                    </h3>

                    <div className="space-y-4">
                        {/* Common Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-green-400">
                                <Mail size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Email</div>
                                <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.email || 'Non renseigné'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-green-400">
                                <Phone size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Téléphone</div>
                                <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.phone_number || 'Non renseigné'}</div>
                            </div>
                        </div>

                        {/* Business Specific Info */}
                        {user?.account_type === 'business' && (
                            <>
                                <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <Building2 size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Entreprise</div>
                                        <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.business_name || 'Non renseigné'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <Briefcase size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Secteur</div>
                                        <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.sector || 'Non renseigné'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Adresse</div>
                                        <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.location || 'Non renseigné'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">IFU</div>
                                        <div className="text-gray-800 dark:text-white font-medium text-sm">{user?.ifu || 'Non renseigné'}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowEditModal(false)}></div>

                    <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md h-[85vh] sm:h-auto rounded-t-[40px] sm:rounded-[40px] p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Modifier le profil</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
                            {/* Account Type Toggle */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl flex mb-2">
                                <button
                                    type="button"
                                    onClick={() => setEditForm({ ...editForm, accountType: 'personal' })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${editForm.accountType === 'personal' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    Personnel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditForm({ ...editForm, accountType: 'business' })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${editForm.accountType === 'business' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    Business
                                </button>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Nom Complet</label>
                                <input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Email</label>
                                <input
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                    type="email"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Téléphone</label>
                                <input
                                    value={editForm.phone || ''}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                />
                            </div>

                            {editForm.accountType === 'business' && (
                                <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                                    <div className="border-t border-dashed border-gray-200 dark:border-gray-700"></div>
                                    <h4 className="text-sm font-bold text-primary dark:text-green-400">Infos Entreprise</h4>

                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Nom de l'entreprise</label>
                                        <input
                                            value={editForm.businessName || ''}
                                            onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Secteur d'activité</label>
                                        <select
                                            value={editForm.sector || ''}
                                            onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                        >
                                            <option value="">Sélectionner...</option>
                                            <option value="Commerce">Commerce</option>
                                            <option value="Service">Prestation de Services</option>
                                            <option value="Agriculture">Agriculture</option>
                                            <option value="Artisanat">Artisanat</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">Adresse</label>
                                        <input
                                            value={editForm.location || ''}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase ml-2 mb-1 block">N° IFU</label>
                                        <input
                                            value={editForm.ifu || ''}
                                            onChange={(e) => setEditForm({ ...editForm, ifu: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} /> {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
