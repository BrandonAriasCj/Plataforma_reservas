"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            localStorage.setItem('auth_token', token);
            apiClient.setToken(token);
            checkAuth().then(() => {
                // Default redirection for patients (Google Auth usually creates patients)
                router.push('/paciente/dashboard');
            });
        } else if (error) {
            console.error('Auth error:', error);
            router.push(`/auth/login?error=${encodeURIComponent(error)}`);
        } else {
            router.push('/auth/login');
        }
    }, [searchParams, router, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
        </div>
    );
}
