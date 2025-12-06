import axios from 'axios';

// Configurar URL base del backend - Backend está en puerto 3001
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error response:', error.response.status, error.response.data);
      const mensaje = error.response.data?.error || error.response.data?.message || 'Error en la solicitud';
      error.message = mensaje;
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('Error request:', error.request);
      error.message = 'No se recibió respuesta del servidor';
    } else {
      // Algo pasó en la configuración de la solicitud
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============ ENDPOINTS DE MÉDICOS ============

/**
 * GET - Obtener todos los médicos
 */
export const getMedicos = async () => {
  try {
    const response = await apiClient.get('/medicos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    throw error;
  }
};

/**
 * GET - Obtener médico por ID
 */
export const getMedicoById = async (id: number) => {
  try {
    const response = await apiClient.get(`/medicos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener médico ${id}:`, error);
    throw error;
  }
};

/**
 * PUT - Actualizar médico
 */
export const actualizarMedico = async (
  id: number,
  datos: Partial<{
    nombre: string;
    especialidad: string;
    email: string;
    telefono: string;
  }>
) => {
  try {
    const response = await apiClient.put(`/medicos/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar médico ${id}:`, error);
    throw error;
  }
};

// ============ ENDPOINTS DE DISPONIBILIDAD ============

/**
 * POST - Marcar UN día como no disponible
 */
export const marcarDiaNoDisponible = async (
  medicoId: number,
  fecha: string
) => {
  try {
    const response = await apiClient.post(`/medicos/${medicoId}/disponibilidad`, {
      fecha,
    });
    return response.data;
  } catch (error) {
    console.error('Error al marcar día como no disponible:', error);
    throw error;
  }
};

/**
 * POST - Marcar RANGO de días como no disponible
 */
export const marcarRangoNoDisponible = async (
  medicoId: number,
  fechaInicio: string,
  fechaFin: string
) => {
  try {
    const response = await apiClient.post(
      `/medicos/${medicoId}/disponibilidad-rango`,
      { fechaInicio, fechaFin }
    );
    return response.data;
  } catch (error) {
    console.error('Error al marcar rango como no disponible:', error);
    throw error;
  }
};

/**
 * GET - Obtener disponibilidades de un médico
 */
export const getDisponibilidades = async (
  medicoId: number,
  params?: {
    fechaInicio?: string;
    fechaFin?: string;
  }
) => {
  try {
    const response = await apiClient.get(`/medicos/${medicoId}/disponibilidades`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener disponibilidades:', error);
    throw error;
  }
};

/**
 * GET - Obtener calendario del mes
 */
export const getCalendario = async (
  medicoId: number,
  params?: {
    mes?: number;
    ano?: number;
  }
) => {
  try {
    const response = await apiClient.get(`/medicos/${medicoId}/calendario`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener calendario:', error);
    throw error;
  }
};

/**
 * DELETE - Eliminar UN día marcado
 */
export const eliminarDiaNoDisponible = async (disponibilidadId: number) => {
  try {
    const response = await apiClient.delete(
      `/medicos/disponibilidad/${disponibilidadId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar día no disponible:', error);
    throw error;
  }
};

/**
 * DELETE - Eliminar RANGO de días marcados
 */
export const eliminarRangoNoDisponible = async (
  medicoId: number,
  datos: {
    fechaInicio: string;
    fechaFin: string;
  }
) => {
  try {
    const response = await apiClient.delete(
      `/medicos/${medicoId}/disponibilidad-rango`,
      { data: datos }
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar rango no disponible:', error);
    throw error;
  }
};

// ============ ENDPOINTS DE CITAS ============

/**
 * GET - Obtener citas de un médico
 */
export const getCitasMedico = async (medicoId: number, params?: { estado?: string }) => {
  try {
    const response = await apiClient.get(`/medicos/${medicoId}/citas`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas del médico:', error);
    throw error;
  }
};

/**
 * PUT - Actualizar estado de cita
 */
export const actualizarCita = async (
  citaId: number,
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
) => {
  try {
    const response = await apiClient.put(`/medicos/cita/${citaId}`, { estado });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar cita ${citaId}:`, error);
    throw error;
  }
};

export default apiClient;
