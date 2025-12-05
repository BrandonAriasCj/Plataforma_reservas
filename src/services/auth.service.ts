import { apiClient } from '@/lib/api-client';
import {
    LoginCredentials,
    RegisterPatientPayload,
    RegisterDoctorPayload,
    AuthResponse,
    User
} from '@/types/auth';

const AUTH_BASE = '/auth';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return await apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, credentials);
    },

    registerPatient: async (data: RegisterPatientPayload): Promise<AuthResponse> => {
        return await apiClient.post<AuthResponse>(`${AUTH_BASE}/register`, data);
    },

    registerDoctor: async (data: RegisterDoctorPayload): Promise<AuthResponse> => {
        return await apiClient.post<AuthResponse>(`${AUTH_BASE}/register-medico`, data);
    },

    getMe: async (): Promise<User> => {
        return await apiClient.get<User>(`${AUTH_BASE}/me`);
    },

    loginWithGoogle: () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${AUTH_BASE}/google`;
    }
};
