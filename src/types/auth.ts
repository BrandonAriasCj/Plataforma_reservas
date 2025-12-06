export interface User {
    userId?: string;
    id?: string;
    email: string;
    roleId: number;
    medico_id?: number;
    patient_id?: number;
    rol_nombre?: "PACIENTE" | "MEDICO";
    name?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    especialidad?: string;
    descripcion?: string;
    [key: string]: any; // Para capturar cualquier otro campo del backend
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPatientPayload {
    email: string;
    password: string;
    name: string;
    apellido: string;
    telefono?: string;
}

export interface RegisterDoctorPayload {
    email: string;
    password: string;
    name: string;
    apellido: string;
    telefono?: string;
    especialidad: string;
    descripcion?: string;
}
