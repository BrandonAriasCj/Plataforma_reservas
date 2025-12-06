
import { apiClient } from '../lib/api-client';
import type { ApiResponse, Medico } from '../types/patient';

export class DoctorService {
    static async getAll(especialidad?: string): Promise<ApiResponse<Medico[]>> {
        const url = `/pacientes/medicos-disponibles${especialidad ? `?especialidad=${encodeURIComponent(especialidad)}` : ''}`;
        return apiClient.get<ApiResponse<Medico[]>>(url);
    }

    static async getById(id: number): Promise<ApiResponse<Medico>> {
        return apiClient.get<ApiResponse<Medico>>(`/medicos/${id}`);
    }

    static async getEspecialidades(): Promise<string[]> {
        const response = await this.getAll();
        if (!response.success || !response.data) return [];

        const especialidades = new Set(response.data.map((m) => m.especialidad));
        return Array.from(especialidades).sort();
    }
}
