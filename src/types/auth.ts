export interface User {
    userId: string;
    email: string;
    roleId: number;
    rol_nombre?: "PACIENTE" | "MEDICO";
    name: string;
    apellido?: string;
    telefono?: string;
    especialidad?: string;
    descripcion?: string;
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
