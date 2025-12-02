'use client';

import { useState, useEffect } from 'react';
import { getCitasMedico, actualizarCita } from '@/services/medicoService';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Cita {
  id: number;
  medico_id: number;
  paciente_id: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  motivo: string;
  fecha_creacion?: string;
}

/**
 * Hook para obtener citas de un médico
 */
export const useCitasMedico = (medicoId: number | null) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicoId) return;

    const cargar = async () => {
      try {
        setCargando(true);
        const data = await getCitasMedico(medicoId);
        const citasArray = Array.isArray(data) ? data : (data?.data || []);
        setCitas(citasArray);
        setError(null);
      } catch (err) {
        setError('Error al cargar citas');
        console.error(err);
        setCitas([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [medicoId]);

  return { citas, cargando, error };
};

/**
 * Hook para actualizar estado de cita
 */
export const useActualizarCita = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizar = async (citaId: number, estado: EstadoCita) => {
    try {
      setCargando(true);
      const result = await actualizarCita(citaId, { estado });
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al actualizar cita';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { actualizar, cargando, error };
};
