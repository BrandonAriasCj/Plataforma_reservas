"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterPatientPayload, RegisterDoctorPayload } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    registerPatient: (data: RegisterPatientPayload) => Promise<void>;
    registerDoctor: (data: RegisterDoctorPayload) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            apiClient.setToken(token);
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('auth_token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            console.log('Login response:', response);
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                apiClient.setToken(response.token);
                console.log('User data set:', response.user);
                setUser(response.user);

                // Redirect based on role
                if (response.user.roleId === 2) { // Medico
                    router.push('/medicos/dashboard');
                } else {
                    router.push('/paciente/dashboard');
                }
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const registerPatient = async (data: RegisterPatientPayload) => {
        setIsLoading(true);
        try {
            const response = await authService.registerPatient(data);
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                apiClient.setToken(response.token);
                setUser(response.user);
                router.push('/paciente/dashboard');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const registerDoctor = async (data: RegisterDoctorPayload) => {
        setIsLoading(true);
        try {
            const response = await authService.registerDoctor(data);
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
                apiClient.setToken(response.token);
                setUser(response.user);
                router.push('/medicos/dashboard');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        router.push('/auth/login');
    };

    const loginWithGoogle = () => {
        authService.loginWithGoogle();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            registerPatient,
            registerDoctor,
            logout,
            checkAuth,
            loginWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    );
};
