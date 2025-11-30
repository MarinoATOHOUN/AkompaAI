
import React, { useState, useRef } from 'react';
import { Screen } from '../types';
import { Button, Input, Logo } from '../components/Shared';
import { Check, User, Building2, Upload, MapPin, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthProps {
    onNavigate: (screen: Screen) => void;
}

export const LoginScreen: React.FC<AuthProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ email, password });
            onNavigate(Screen.DASHBOARD);
        } catch (err: any) {
            setError(err.response?.data?.errors?.email?.[0] || err.response?.data?.errors?.password?.[0] || 'Échec de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full justify-center px-8 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Background shape for visual interest in dark mode */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-green-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Torn Paper Effect Top (CSS approximation) */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gray-50 dark:bg-gray-800 -skew-y-3 origin-top-left transform translate-y-[-50%] opacity-50 z-0 transition-colors"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" className="text-primary dark:text-green-400 mb-8 transition-colors">
                        <circle cx="4" cy="4" r="2" fill="currentColor" />
                        <circle cx="12" cy="4" r="2" fill="currentColor" />
                        <circle cx="20" cy="4" r="2" fill="currentColor" />
                    </svg>
                </div>
                <Logo />

                <h2 className="text-3xl font-bold text-primary dark:text-white mb-2 transition-colors">Connexion</h2>
                <p className="text-primary/70 dark:text-gray-400 mb-10 transition-colors">Connectez-vous pour continuer</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form className="w-full space-y-4" onSubmit={handleSubmit}>
                    <Input type="email" placeholder="Adresse Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Button type="submit" className="mt-4" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
                </form>

                <button
                    onClick={() => onNavigate(Screen.RECOVERY_EMAIL)}
                    className="mt-6 text-primary dark:text-green-400 text-sm font-medium hover:underline transition-colors"
                >
                    Mot de passe oublié ?
                </button>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Pas encore de compte ?</p>
                    <button onClick={() => onNavigate(Screen.REGISTER)} className="mt-1 font-bold text-primary dark:text-green-400 hover:underline transition-colors">
                        Créer un compte
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RegisterScreen: React.FC<AuthProps> = ({ onNavigate }) => {
    const { register } = useAuth();
    const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
    const [agreed, setAgreed] = useState(false);
    const [businessAgreed, setBusinessAgreed] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [ifu, setIfu] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [sector, setSector] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const isFormValid = () => {
        const isIfuValid = accountType === 'business' ? ifu.trim().length > 0 : true;
        if (accountType === 'personal') return agreed;
        return agreed && businessAgreed && isIfuValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const data: any = {
            email,
            password,
            password2: password,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            account_type: accountType,
            agreed,
        };

        if (accountType === 'business') {
            data.business_name = businessName;
            data.sector = sector;
            data.location = location;
            data.ifu = ifu;
            data.businessAgreed = businessAgreed;
        }

        try {
            await register(data);
            onNavigate(Screen.DASHBOARD);
        } catch (err: any) {
            setError(JSON.stringify(err.response?.data?.errors || 'Erreur lors de l\'inscription'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#dcece6] dark:bg-gray-900 overflow-y-auto no-scrollbar transition-colors duration-300">
            <div className="flex-1 flex flex-col px-6 py-10 relative">
                {/* Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-white/5 rounded-bl-[100px] z-0 transition-colors"></div>

                <div className="relative z-10 flex flex-col items-center mb-6">
                    <Logo />
                    <h2 className="text-3xl font-bold text-primary dark:text-white text-center mt-2 transition-colors">Créer un compte</h2>
                    <p className="text-primary/60 dark:text-gray-400 text-sm mt-1 text-center transition-colors">Commencez votre gestion financière</p>
                </div>

                {/* Account Type Toggle */}
                <div className="relative z-10 bg-white dark:bg-gray-800 p-1.5 rounded-2xl flex mb-8 shadow-sm">
                    <button
                        onClick={() => setAccountType('personal')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${accountType === 'personal'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <User size={18} /> Personnel
                    </button>
                    <button
                        onClick={() => setAccountType('business')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${accountType === 'business'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Building2 size={18} /> Professionnel
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <form className="w-full space-y-4 relative z-10" onSubmit={handleSubmit}>

                    {/* Common Fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Prénom" className="mb-0" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <Input placeholder="Nom" className="mb-0" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    {accountType === 'business' && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                            <div className="border-t border-dashed border-primary/20 dark:border-white/10 my-2"></div>
                            <h3 className="text-xs font-bold text-primary dark:text-green-400 uppercase tracking-widest mb-2">Infos Entreprise</h3>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-green-400 hover:bg-white/50 dark:hover:bg-gray-800 transition-all group"
                            >
                                {logoPreview ? (
                                    <div className="relative w-full h-full p-2">
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                            <Upload className="text-white" size={24} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 bg-primary/10 dark:bg-green-900/20 rounded-full flex items-center justify-center text-primary dark:text-green-400 mb-2 group-hover:scale-110 transition-transform">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ajouter le logo de l'entreprise</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <Input placeholder="Nom de l'entreprise / Commerce" icon={<Building2 size={18} />} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />

                            <div className="relative">
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-4 rounded-full shadow-sm outline-none border border-transparent focus:border-primary dark:focus:border-green-400 appearance-none"
                                >
                                    <option value="" disabled>Type d'activité</option>
                                    <option value="commerce">Commerce / Vente</option>
                                    <option value="grossiste">Grossiste</option>
                                    <option value="service">Prestation de Services</option>
                                    <option value="artisanat">Artisanat</option>
                                    <option value="agricole">Agriculture</option>
                                </select>
                                <Briefcase className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>

                            <Input placeholder="Adresse / Localisation" icon={<MapPin size={18} />} value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    )}

                    <div className="border-t border-dashed border-primary/20 dark:border-white/10 my-4"></div>

                    <Input
                        placeholder={accountType === 'business' ? "Numéro IFU (Obligatoire)" : "Numéro IFU (Optionnel)"}
                        value={ifu}
                        onChange={(e) => setIfu(e.target.value)}
                        icon={<FileText size={18} />}
                    />

                    <Input type="email" placeholder="Adresse Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="tel" placeholder="Numéro de Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <div className="space-y-3 mt-4 px-1">
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                className={`w-5 h-5 min-w-[20px] rounded border transition-colors flex items-center justify-center mt-0.5 ${agreed ? 'bg-primary border-primary dark:bg-green-600 dark:border-green-600' : 'border-primary/40 dark:border-gray-500 bg-white dark:bg-gray-800'}`}
                                onClick={() => setAgreed(!agreed)}
                            >
                                {agreed && <Check size={14} className="text-white" strokeWidth={3} />}
                            </button>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 leading-tight transition-colors">
                                J'accepte les <button type="button" className="text-primary dark:text-green-400 font-bold hover:underline" onClick={() => onNavigate(Screen.TERMS)}>Conditions Générales</button> et la <button type="button" className="text-primary dark:text-green-400 font-bold hover:underline" onClick={() => onNavigate(Screen.PRIVACY)}>Politique de Confidentialité</button>.
                            </p>
                        </div>

                        {accountType === 'business' && (
                            <div className="flex items-start gap-3 animate-in fade-in duration-300">
                                <button
                                    type="button"
                                    className={`w-5 h-5 min-w-[20px] rounded border transition-colors flex items-center justify-center mt-0.5 ${businessAgreed ? 'bg-primary border-primary dark:bg-green-600 dark:border-green-600' : 'border-primary/40 dark:border-gray-500 bg-white dark:bg-gray-800'}`}
                                    onClick={() => setBusinessAgreed(!businessAgreed)}
                                >
                                    {businessAgreed && <Check size={14} className="text-white" strokeWidth={3} />}
                                </button>
                                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 leading-tight transition-colors">
                                    Je certifie que les informations sur l'entreprise sont exactes et j'accepte les <button type="button" className="text-primary dark:text-green-400 font-bold hover:underline" onClick={() => onNavigate(Screen.BUSINESS_TERMS)}>Conditions Business</button> supplémentaires.
                                </p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className={`mt-6 transition-opacity ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isFormValid() || loading}>
                        {loading ? 'Création...' : (accountType === 'business' ? "Créer compte Business" : "Créer compte Personnel")}
                    </Button>
                </form>

                <div className="mt-8 text-center relative z-10 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Déjà un compte ?</p>
                    <button onClick={() => onNavigate(Screen.LOGIN)} className="mt-1 font-bold text-primary dark:text-green-400 hover:underline transition-colors">
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RecoveryEmailScreen: React.FC<AuthProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col h-full pt-12 px-8 bg-secondary dark:bg-gray-900 transition-colors duration-300">
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-primary rounded-b-[40px] absolute top-0 left-0 h-[25vh] z-0 flex flex-col justify-center px-8 shadow-lg">
                    <h1 className="text-white text-4xl font-bold leading-tight">Récupération<br />Compte</h1>
                </div>

                <div className="mt-[20vh] z-10 w-full flex flex-col items-center">
                    <Logo />
                    <div className="w-full mt-8">
                        <label className="text-primary dark:text-green-400 font-semibold ml-4 mb-2 block transition-colors">Email</label>
                        <div className="border-2 border-primary dark:border-green-400 rounded-xl p-1 bg-white dark:bg-gray-800 transition-colors">
                            <input className="w-full bg-transparent p-3 outline-none text-primary dark:text-white placeholder-primary/50 dark:placeholder-gray-500 rounded-lg" placeholder="hello@exemple.com" />
                        </div>
                    </div>

                    <Button onClick={() => onNavigate(Screen.RECOVERY_CODE)} className="mt-8">Suivant</Button>

                    <div className="mt-6 text-center">
                        <p className="text-primary dark:text-gray-400 text-sm transition-colors">Pas de compte ?</p>
                        <button onClick={() => onNavigate(Screen.REGISTER)} className="font-bold text-primary dark:text-green-400 hover:underline transition-colors">Créer un compte</button>
                    </div>
                </div>
            </div>
            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 pb-8">
                <div className="w-3 h-3 bg-white dark:bg-green-400 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
            </div>
        </div>
    );
};

export const RecoveryCodeScreen: React.FC<AuthProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col h-full pt-12 px-8 bg-secondary dark:bg-gray-900 transition-colors duration-300">
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-primary rounded-b-[40px] absolute top-0 left-0 h-[25vh] z-0 flex flex-col justify-center px-8 shadow-lg">
                    <h1 className="text-white text-4xl font-bold leading-tight">Code de<br />Récupération</h1>
                </div>

                <div className="mt-[20vh] z-10 w-full flex flex-col items-center">
                    <Logo />
                    <div className="w-full mt-8">
                        <label className="text-primary dark:text-green-400 font-semibold ml-4 mb-2 block transition-colors">Code Secret</label>
                        <div className="border-2 border-primary dark:border-green-400 rounded-xl p-1 bg-white dark:bg-gray-800 transition-colors">
                            <input className="w-full bg-transparent p-3 outline-none text-primary dark:text-white placeholder-primary/50 dark:placeholder-gray-500 rounded-lg" placeholder="123456" />
                        </div>
                    </div>

                    <Button onClick={() => onNavigate(Screen.LOGIN)} className="mt-8">Suivant</Button>

                    <div className="mt-6 text-center">
                        <p className="text-primary dark:text-gray-400 text-sm transition-colors">Pas de compte ?</p>
                        <button onClick={() => onNavigate(Screen.REGISTER)} className="font-bold text-primary dark:text-green-400 hover:underline transition-colors">Créer un compte</button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center space-x-2 pb-8">
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-white dark:bg-green-400 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
                <div className="w-3 h-3 bg-primary/20 dark:bg-gray-700 rounded-full transition-colors"></div>
            </div>
        </div>
    );
};
