import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    role: 'VIAJERO' | 'AGENCIA';
    name?: string;
    dob?: string;
    gender?: string;
    documentType?: string;
    documentNumber?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (token, user) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
