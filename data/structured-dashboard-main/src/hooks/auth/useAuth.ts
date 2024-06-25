import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useAuthStore } from '../../zustand/auth/authStore';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const redirectUrl = '/auth/sign-in';
    const { setUser, setIsLoading } = useAuthStore();

    useEffect(() => {
        if (isLoading) return; // Do nothing while loading
        if (error) console.error('Error loading user:', error);
        if (user) {
            setUser(user)
            setIsLoading(false);
        }
        if (!user && !isLoading) {
            // No user and not loading, redirect to sign-in
            router.push(redirectUrl);
        }
    }, [user?.sub, user, isLoading, error, router]);

    return {
        user,
        isLoading,
    };
};

export default useAuth;