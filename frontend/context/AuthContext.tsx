import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, setAuthToken, setRefreshToken } from '../api';
import { UserProfile } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await auth.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (data: any) => {
        const response = await auth.login(data);
        const { user, tokens } = response.data;
        setAuthToken(tokens.access);
        setRefreshToken(tokens.refresh);
        setUser(user);
    };

    const register = async (data: any) => {
        const response = await auth.register(data);
        const { user, tokens } = response.data;
        setAuthToken(tokens.access);
        setRefreshToken(tokens.refresh);
        setUser(user);
    };

    const logout = () => {
        setAuthToken('');
        setRefreshToken('');
        setUser(null);
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        const response = await auth.updateProfile(data);
        setUser(response.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
