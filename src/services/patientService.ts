/**
 * Patient Service
 * Servicio para operaciones de paciente
 */

import { apiClient } from '../lib/api-client';
import type {
    ApiResponse,
    Paciente,
    UpdatePacienteData,
    DetallesPaciente,
    UpdateDetallesData,
    Cita,
} from '../types/patient';

export class PatientService {
    /**
     * Obtener perfil del paciente autenticado
     */
    static async getProfile(): Promise<ApiResponse<Paciente>> {
        return apiClient.get<ApiResponse<Paciente>>('/paciente/profile');
    }

    /**
     * Actualizar perfil del paciente
     */
    static async updateProfile(data: UpdatePacienteData): Promise<ApiResponse<Paciente>> {
        return apiClient.put<ApiResponse<Paciente>>('/paciente/profile', data);
    }

    /**
     * Obtener detalles médicos del paciente
     */
    static async getDetails(): Promise<ApiResponse<DetallesPaciente>> {
        return apiClient.get<ApiResponse<DetallesPaciente>>('/paciente/detalles');
    }

    /**
     * Actualizar detalles médicos del paciente
     */
    static async updateDetails(data: UpdateDetallesData): Promise<ApiResponse<DetallesPaciente>> {
        return apiClient.put<ApiResponse<DetallesPaciente>>('/paciente/detalles', data);
    }

    /**
     * Obtener citas del paciente
     * @param filters - Filtros opcionales (estado, desde, hasta)
     */
    static async getCitas(filters?: {
        estado?: string;
        desde?: string;
        hasta?: string;
    }): Promise<ApiResponse<Cita[]>> {
        const params = new URLSearchParams();
        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.desde) params.append('desde', filters.desde);
        if (filters?.hasta) params.append('hasta', filters.hasta);

        const url = `/paciente/citas${params.toString() ? `?${params.toString()}` : ''}`;
        return apiClient.get<ApiResponse<Cita[]>>(url);
    }
}
