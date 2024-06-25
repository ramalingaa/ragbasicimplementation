import { UserProfile } from '@auth0/nextjs-auth0/client';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    user : UserProfile | null;    
    setUser: (user: UserProfile) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const authStore = create<AuthState, [["zustand/persist", AuthState]]>(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user: UserProfile) => set({ user }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
        }),
        {
            name: 'authStore',
        },
    ),
)

export const useAuthStore = authStore;
