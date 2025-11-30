
import { Product, Transaction, Notification } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Piment',
    description: 'A juicy beef patty with lettuce and our sauce.', // Kept desc from screenshot even if it doesn't match Piment perfectly
    price: '1200',
    unit: 'KG',
    image: 'https://picsum.photos/seed/piment/200/200',
    category: 'Vente',
    stockStatus: 'ok'
  },
  {
    id: '2',
    name: 'Tomate',
    description: 'The classic burger with melted cheddar cheese.',
    price: '950',
    unit: 'KG',
    image: 'https://picsum.photos/seed/tomate/200/200',
    category: 'Vente',
    stockStatus: 'ok'
  },
  {
    id: '3',
    name: 'Gombo',
    description: 'Topped crispy bacon and tangy BBQ sauce.',
    price: '775',
    unit: 'KG',
    image: 'https://picsum.photos/seed/gombo/200/200',
    category: 'Vente',
    stockStatus: 'ok'
  },
  {
    id: '4',
    name: 'Huile',
    description: 'Two beef, double the cheese, and toppings.',
    price: '650',
    unit: 'L',
    image: 'https://picsum.photos/seed/huile/200/200',
    category: 'Stock',
    stockStatus: 'ok'
  },
  {
    id: '5',
    name: 'Mais',
    description: 'Fish fillet with tartar sauce, lettuce, and pickles.',
    price: '700',
    unit: 'KG',
    image: 'https://picsum.photos/seed/mais/200/200',
    category: 'Stock',
    stockStatus: 'rupture'
  },
  {
    id: '6',
    name: 'Electricité',
    description: 'Facture mensuelle courant.',
    price: '15000',
    unit: 'Mois',
    image: 'https://picsum.photos/seed/elec/200/200',
    category: 'Dépense',
    stockStatus: 'ok'
  }
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    name: 'Mais',
    amount: 1400,
    currency: 'FCFA',
    type: 'income',
    date: 'Aujourd\'hui, 14:30',
    percentage: 49.89,
    category: 'Vente'
  },
  {
    id: '2',
    name: 'Tomate',
    amount: 7600,
    currency: 'FCFA',
    type: 'income',
    date: 'Aujourd\'hui, 09:15',
    percentage: 18.27,
    category: 'Vente'
  },
  {
    id: '3',
    name: 'Télévision',
    amount: 148000,
    currency: 'FCFA',
    type: 'expense',
    date: 'Hier, 18:45',
    percentage: 28.13,
    category: 'Equipement'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'RAPPEL',
    message: 'Le produit Mais est bientôt en rupture ...',
    time: 'maintenant'
  },
  {
    id: '2',
    type: 'profit',
    title: 'Bénéfice',
    message: 'Vous avez fait 16,89% de bénéfice en pl...',
    time: 'maintenant'
  },
  {
    id: '3',
    type: 'promo',
    title: 'Premium',
    message: 'Passez en mode premium pour une me...',
    time: 'Il y a 3h'
  }
];

export const CHART_DATA_WALLET = [
  { name: '1', value: 100 },
  { name: '2', value: 150 },
  { name: '3', value: 130 },
  { name: '4', value: 200 },
  { name: '5', value: 280 },
];

export const CHART_DATA_DASHBOARD = [
  { name: '1-10', uv: 100 },
  { name: '10-20', uv: 500 },
  { name: '20-30', uv: 50 },
];
