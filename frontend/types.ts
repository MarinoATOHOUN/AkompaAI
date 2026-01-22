
export enum Screen {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RECOVERY_EMAIL = 'RECOVERY_EMAIL',
  RECOVERY_CODE = 'RECOVERY_CODE',
  DASHBOARD = 'DASHBOARD',
  MANAGEMENT = 'MANAGEMENT', // "Gestion"
  VOICE = 'VOICE',
  WALLET = 'WALLET', // "Portefeuille"
  TRANSACTIONS = 'TRANSACTIONS', // Full History
  ADS = 'ADS', // New Ads/Announcements screen
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  GUIDE = 'GUIDE',
  SETTINGS = 'SETTINGS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SUPPORT = 'SUPPORT',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  SECURITY_PRIVACY = 'SECURITY_PRIVACY',
  DATA_SECURITY = 'DATA_SECURITY',
  BUSINESS_TERMS = 'BUSINESS_TERMS',
}

export interface UserProfile {
  name: string;
  image: string;
  email?: string;
  phone?: string;
  accountType: 'personal' | 'business';
  businessName?: string;
  sector?: string;
  location?: string;
  ifu?: string;
  // Backend user fields
  avatar?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  account_type?: 'personal' | 'business';
  business_name?: string;
}


export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  image: string;
  stockStatus?: 'ok' | 'low' | 'rupture';
  category: 'Vente' | 'Dépense' | 'Stock' | 'vente' | 'depense' | 'stock';
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  date: string;
  percentage?: number;
  category?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'profit' | 'promo';
  title: string;
  message: string;
  time: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  color: string;
}