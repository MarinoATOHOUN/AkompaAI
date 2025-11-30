
import React, { useState } from 'react';
import { Screen } from '../types';
import { Header, Button, Input } from '../components/Shared';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useSupportTickets } from '../hooks';

interface Props {
    onNavigate: (screen: Screen) => void;
    onToggleMenu: () => void;
}

const SupportScreen: React.FC<Props> = ({ onNavigate, onToggleMenu }) => {
    const { data: tickets, loading, createTicket } = useSupportTickets();
    const [sent, setSent] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await createTicket({
                subject,
                message
            });
            setSent(true);
            setTimeout(() => {
                onNavigate(Screen.DASHBOARD);
            }, 2500);
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'closed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Ouvert';
            case 'in_progress': return 'En cours';
            case 'closed': return 'Fermé';
            default: return status;
        }
    };

    return (
        <div className="flex flex-col h-full bg-secondary dark:bg-gray-900 pb-24 overflow-y-auto no-scrollbar transition-colors">
            <Header
                title="Support"
                onBack={() => onNavigate(Screen.DASHBOARD)}
                onMenu={onToggleMenu}
            />

            <div className="px-6">
                {sent ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Send size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Message Envoyé !</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            Merci de nous avoir contactés. Notre équipe vous répondra sous 24h.
                        </p>
                        <div className="mt-8">
                            <Button onClick={() => onNavigate(Screen.DASHBOARD)} variant="secondary" className="px-8">
                                Retour à l'accueil
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        {/* Previous Tickets */}
                        {tickets.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2">Vos Tickets</h3>
                                <div className="space-y-3">
                                    {tickets.slice(0, 3).map((ticket: any) => (
                                        <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare size={16} className="text-primary dark:text-green-400" />
                                                    <span className="font-bold text-gray-800 dark:text-white text-sm">{ticket.subject}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getStatusColor(ticket.status)}`}>
                                                    {getStatusLabel(ticket.status)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{ticket.message}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <Clock size={10} />
                                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Ticket Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm mb-6 transition-colors">
                            <h3 className="text-primary dark:text-white font-bold text-lg mb-4">Comment pouvons-nous aider ?</h3>
                            <form className="space-y-4" onSubmit={handleSend}>
                                <Input
                                    placeholder="Sujet"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                                <textarea
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-green-400/20 min-h-[140px] text-gray-700 dark:text-white placeholder-gray-400 resize-none transition-colors"
                                    placeholder="Décrivez votre problème en détail..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} /> {submitting ? 'Envoi...' : 'Envoyer le message'}
                                </Button>
                            </form>
                        </div>

                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 ml-2">Nos Coordonnées</h3>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 dark:hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-green-400 shrink-0">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Téléphone</div>
                                    <div className="text-primary dark:text-white font-bold text-lg">+229 66 73 11 43</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 dark:hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-green-400 shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Email</div>
                                    <div className="text-primary dark:text-white font-bold text-lg">support@akompta.ai</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 dark:hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-green-400 shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Siège</div>
                                    <div className="text-primary dark:text-white font-bold text-sm leading-tight">Cotonou/Bénin, Fidjrosse<br />Immeuble CosmoLAB Hub</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportScreen;