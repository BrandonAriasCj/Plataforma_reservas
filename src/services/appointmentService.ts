/**
 * Appointment Service
 * Servicio para gestión de citas médicas
 */

import { apiClient } from '../lib/api-client';
import type {
    ApiResponse,
    Cita,
    CreateCitaData,
    DisponibilidadMedico,
} from '../types/patient';

export class AppointmentService {
    /**
     * Crear una nueva cita
     */
    static async create(data: CreateCitaData): Promise<ApiResponse<Cita>> {
        return apiClient.post<ApiResponse<Cita>>('/citas', data);
    }

    /**
     * Obtener una cita por ID
     */
    static async getById(id: number): Promise<ApiResponse<Cita>> {
        return apiClient.get<ApiResponse<Cita>>(`/citas/${id}`);
    }

    /**
     * Cancelar una cita
     */
    static async cancel(id: number): Promise<ApiResponse<Cita>> {
        return apiClient.put<ApiResponse<Cita>>(`/citas/${id}/cancelar`);
    }

    /**
     * Obtener disponibilidad de un médico para una fecha
     */
    static async getDoctorAvailability(
        medicoId: number,
        fecha: string
    ): Promise<ApiResponse<DisponibilidadMedico>> {
        return apiClient.get<ApiResponse<DisponibilidadMedico>>(
            `/citas/medico/${medicoId}/disponibilidad?fecha=${fecha}`
        );
    }
}
