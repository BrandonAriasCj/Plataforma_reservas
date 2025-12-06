"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuth();
    const hasProcessed = useRef(false);
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Evitar ejecución múltiple
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processAuth = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('Auth error:', error);
                setStatus('error');
                setErrorMessage(error);
                setTimeout(() => {
                    router.push(`/auth/login?error=${encodeURIComponent(error)}`);
                }, 2000);
                return;
            }

            if (!token) {
                setStatus('error');
                setErrorMessage('No se recibió token de autenticación');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
                return;
            }

            try {
                // Guardar token
                localStorage.setItem('auth_token', token);
                apiClient.setToken(token);

                // Intentar obtener datos del usuario con reintentos
                let retries = 3;
                let success = false;

                while (retries > 0 && !success) {
                    try {
                        await checkAuth();
                        success = true;
                    } catch (err) {
                        retries--;
                        if (retries > 0) {
                            // Esperar 500ms antes de reintentar
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                }

                setStatus('success');

                // Redirigir al dashboard
                router.push('/paciente/dashboard');
            } catch (err) {
                console.error('Error processing auth:', err);
                setStatus('error');
                setErrorMessage('Error al procesar autenticación');

                // Aún con error, intentar redirigir (el token ya está guardado)
                setTimeout(() => {
                    router.push('/paciente/dashboard');
                }, 1500);
            }
        };

        processAuth();
    }, []); // Sin dependencias - ejecutar solo una vez

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {status === 'loading' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 text-green-600">¡Autenticación exitosa!</h2>
                        <p className="text-gray-600">Redirigiendo...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 text-red-600">Error de autenticación</h2>
                        <p className="text-gray-600">{errorMessage}</p>
                        <p className="text-sm text-gray-500 mt-2">Redirigiendo...</p>
                    </>
                )}
            </div>
        </div>
    );
}

// Loading fallback para Suspense
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Cargando...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
