/**
 * Doctor Service for Patient View
 * Servicio para obtener médicos disponibles (vista de paciente)
 */

import { apiClient } from '../lib/api-client';
import type { ApiResponse, Medico } from '../types/patient';

export class DoctorService {
    /**
     * Obtener todos los médicos disponibles
     * @param especialidad - Filtro opcional por especialidad
     */
    static async getAll(especialidad?: string): Promise<ApiResponse<Medico[]>> {
        const url = `/medicos${especialidad ? `?especialidad=${encodeURIComponent(especialidad)}` : ''}`;
        return apiClient.get<ApiResponse<Medico[]>>(url);
    }

    /**
     * Obtener un médico por ID
     */
    static async getById(id: number): Promise<ApiResponse<Medico>> {
        return apiClient.get<ApiResponse<Medico>>(`/medicos/${id}`);
    }

    /**
     * Obtener especialidades disponibles
     * Extrae especialidades únicas de todos los médicos
     */
    static async getEspecialidades(): Promise<string[]> {
        const response = await this.getAll();
        if (!response.success || !response.data) return [];

        const especialidades = new Set(response.data.map((m) => m.especialidad));
        return Array.from(especialidades).sort();
    }
}
