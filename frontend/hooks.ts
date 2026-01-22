import { useState, useEffect, useCallback } from 'react';
import { transactions, products, budgets, notifications, ads, support, analytics } from './api';
import { Transaction, Product, Budget, Notification } from './types';

export const useTransactions = (params?: any) => {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await transactions.list(params);
            setData(response.data.results);
            setError(null);
        } catch (err) {
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (tx: any) => {
        await transactions.create(tx);
        fetchTransactions();
    };

    return { data, loading, error, refetch: fetchTransactions, addTransaction };
};

export const useTransactionSummary = () => {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await transactions.summary();
            setSummary(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return { summary, loading, refetch: fetchSummary };
};

export const useProducts = (params?: any) => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await products.list(params);
            setData(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = async (prod: any) => {
        await products.create(prod);
        fetchProducts();
    };

    const updateProduct = async (id: string, prod: any) => {
        await products.update(id, prod);
        fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        await products.delete(id);
        fetchProducts();
    };

    return { data, loading, refetch: fetchProducts, addProduct, updateProduct, deleteProduct };
};

export const useBudgets = () => {
    const [data, setData] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBudgets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await budgets.list();
            setData(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const addBudget = async (budget: any) => {
        await budgets.create(budget);
        fetchBudgets();
    };

    const updateBudget = async (id: string, budget: any) => {
        await budgets.update(id, budget);
        fetchBudgets();
    };

    const deleteBudget = async (id: string) => {
        await budgets.delete(id);
        fetchBudgets();
    };

    return { data, loading, refetch: fetchBudgets, addBudget, updateBudget, deleteBudget };
};

export const useNotifications = () => {
    const [data, setData] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await notifications.list();
            setData(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markRead = async (id: string) => {
        await notifications.markRead(id);
        fetchNotifications();
    };

    return { data, loading, refetch: fetchNotifications, markRead };
};

export const useAds = (params?: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ads.list(params);
            setData(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const addAd = async (ad: any) => {
        await ads.create(ad);
        fetchAds();
    };

    return { data, loading, refetch: fetchAds, addAd };
};

export const useSupportTickets = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await support.list();
            setData(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const createTicket = async (ticket: any) => {
        await support.create(ticket);
        fetchTickets();
    };

    return { data, loading, refetch: fetchTickets, createTicket };
};

export const useAnalytics = () => {
    const [overview, setOverview] = useState<any[]>([]);
    const [breakdown, setBreakdown] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
    const [kpi, setKpi] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const [overviewRes, breakdownRes, kpiRes, activityRes, balanceRes] = await Promise.all([
                analytics.overview(),
                analytics.breakdown(),
                analytics.kpi(),
                analytics.activity(),
                analytics.balanceHistory()
            ]);
            setOverview(overviewRes.data);
            setBreakdown(breakdownRes.data);
            setKpi(kpiRes.data);
            setActivity(activityRes.data);
            setBalanceHistory(balanceRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { overview, breakdown, kpi, activity, balanceHistory, loading, refetch: fetchAnalytics };
};
