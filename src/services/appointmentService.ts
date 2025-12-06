
import { apiClient } from '../lib/api-client';
import { useAuth } from '@/context/AuthContext';
import type {
    ApiResponse,
    Cita,
    CreateCitaData,
    DisponibilidadMedico,
} from '../types/patient';

export class AppointmentService {
    static async create(data: CreateCitaData): Promise<ApiResponse<Cita>> {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const paciente_id = user?.paciente_id;

        if (!paciente_id) {
            throw new Error('No se pudo obtener el ID del paciente');
        }
        const fecha_hora = `${data.fecha}T${data.hora_inicio}:00`;
        return apiClient.post<ApiResponse<Cita>>('/pacientes/citas', {
            paciente_id,
            medico_id: data.medico_id,
            fecha_hora,
            motivo: data.motivo || ''
        });
    }

    static async getById(id: number): Promise<ApiResponse<Cita>> {
        return apiClient.get<ApiResponse<Cita>>(`/citas/${id}`);
    }

    static async cancel(id: number): Promise<ApiResponse<Cita>> {
        return apiClient.put<ApiResponse<Cita>>(`/citas/${id}/cancelar`);
    }

    static async getDoctorAvailability(
        medicoId: number,
        fecha: string
    ): Promise<ApiResponse<DisponibilidadMedico>> {
        return apiClient.get<ApiResponse<DisponibilidadMedico>>(
            `/medicos/${medicoId}/disponibilidad?fecha=${fecha}`
        );
    }

    static async update(id: number, data: { motivo: string }): Promise<ApiResponse<Cita>> {
        return apiClient.put<ApiResponse<Cita>>(`/pacientes/citas/${id}`, data);
    }
}
