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
        // Backend espera POST /auth/register-medico
        const payload = {
            email: data.email,
            name: data.name,
            apellido: data.apellido,
            telefono: data.telefono,
            especialidad: data.especialidad,
            descripcion: data.descripcion || '',
            password: data.password
        };
        try {
            const response = await apiClient.post<AuthResponse>(`${AUTH_BASE}/register-medico`, payload);
            return response;
        } catch (error: any) {
            console.error('Error en registro de médico:', error.response?.data || error.message);
            throw error;
        }
    },

    getMe: async (): Promise<User> => {
        const response = await apiClient.get<any>(`${AUTH_BASE}/me`);
        // El backend puede devolver user directamente o en response.user
        return response.user || response.data || response;
    },

    loginWithGoogle: () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${AUTH_BASE}/google`;
    }
};
