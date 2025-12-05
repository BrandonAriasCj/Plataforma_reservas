/**
 * TypeScript Types for Patient Module
 * Definiciones de tipos para paciente, citas y médicos
 */

// ==================== USUARIO ====================
export interface Usuario {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    activo: boolean;
}

// ==================== PACIENTE ====================
export interface Paciente {
    id: number;
    usuario_id: number;
    fecha_nacimiento?: string;
    direccion?: string;
    sexo?: 'M' | 'F' | 'Otro';
    usuario?: Usuario;
    detalles?: DetallesPaciente;
}

export interface DetallesPaciente {
    id: number;
    paciente_id: number;
    altura_cm?: number;
    peso_kg?: number;
    alergias?: string;
    enfermedades_previas?: string;
    medicamentos_actuales?: string;
    antecedentes_familiares?: string;
}

export interface UpdatePacienteData {
    fecha_nacimiento?: string;
    direccion?: string;
    sexo?: 'M' | 'F' | 'Otro';
}

export interface UpdateDetallesData {
    altura_cm?: number;
    peso_kg?: number;
    alergias?: string;
    enfermedades_previas?: string;
    medicamentos_actuales?: string;
    antecedentes_familiares?: string;
}

// ==================== MÉDICO ====================
export interface Medico {
    id: number;
    especialidad: string;
    descripcion?: string;
    foto_perfil?: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    activo?: boolean;
}

// ==================== CITA ====================
export type EstadoCita = 'pendiente' | 'aceptada' | 'rechazada' | 'cancelada';

export interface Cita {
    id: number;
    paciente_id: number;
    medico_id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: EstadoCita;
    motivo?: string;
    comentario_medico?: string;
    fecha_creacion: string;
    medico?: Medico;
    paciente?: {
        id: number;
        nombre: string;
        apellido: string;
        telefono?: string;
    };
}

export interface CreateCitaData {
    medico_id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo?: string;
}

export interface HorarioDisponible {
    inicio: string;
    fin: string;
}

export interface DisponibilidadMedico {
    disponible: boolean;
    razon?: string;
    horarios?: HorarioDisponible[];
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: string[];
    message?: string;
    count?: number;
}
