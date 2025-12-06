'use client';

import { useState, useEffect } from 'react';
import {
  marcarDiaNoDisponible,
  marcarRangoNoDisponible,
  getDisponibilidades,
  getCalendario,
  eliminarDiaNoDisponible,
  eliminarRangoNoDisponible,
} from '@/services/medicoService';

export interface DisponibilidadDetalle {
  id: number;
  medico_id: number;
  fecha: string;
  disponible: boolean;
  fecha_creacion?: string;
}

export interface DiaCalendario {
  fecha: string;
  diaSemana: string;
  disponible: boolean;
  detalleId: number | null;
}

export interface CalendarioResponse {
  mes: number;
  ano: number;
  dias_no_disponibles_total: number;
  dias_disponibles_total: number;
  dias_total: number;
  calendario: Record<string, DiaCalendario>;
}

/**
 * Hook para obtener disponibilidades de un médico
 */
export const useDisponibilidades = (medicoId: number | null, refreshKey?: number, mes?: number, ano?: number) => {
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicoId) return;

    const cargar = async () => {
      try {
        setCargando(true);
        const data = await getDisponibilidades(medicoId);
        const disponibilidadesArray = Array.isArray(data) ? data : (data?.data || []);
        setDisponibilidades(disponibilidadesArray);
        setError(null);
      } catch (err) {
        setError('Error al cargar disponibilidades');
        console.error(err);
        setDisponibilidades([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [medicoId, refreshKey, mes, ano]);

  return { disponibilidades, cargando, error };
};

/**
 * Hook para obtener calendario mensual
 */
export const useCalendario = (medicoId: number | null, mes?: number, ano?: number) => {
  const [calendario, setCalendario] = useState<CalendarioResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicoId) return;

    const cargar = async () => {
      try {
        setCargando(true);
        const data = await getCalendario(medicoId, { mes, ano });
        const calendarioData = data?.data || data;
        setCalendario(calendarioData);
        setError(null);
      } catch (err) {
        setError('Error al cargar calendario');
        console.error(err);
        setCalendario(null);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [medicoId, mes, ano]);

  return { calendario, cargando, error };
};

/**
 * Hook para marcar día como no disponible
 */
export const useMarcarNoDisponible = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const marcarDia = async (
    medicoId: number,
    fecha: string
  ) => {
    try {
      setCargando(true);
      const result = await marcarDiaNoDisponible(medicoId, fecha);
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al marcar día';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  const marcarRango = async (
    medicoId: number,
    fechaInicio: string,
    fechaFin: string
  ) => {
    try {
      setCargando(true);
      const result = await marcarRangoNoDisponible(medicoId, fechaInicio, fechaFin);
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al marcar rango';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { marcarDia, marcarRango, cargando, error };
};

/**
 * Hook para eliminar días no disponibles
 */
export const useEliminarNoDisponible = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarDia = async (disponibilidadId: number) => {
    try {
      setCargando(true);
      const result = await eliminarDiaNoDisponible(disponibilidadId);
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  const eliminarRango = async (
    medicoId: number,
    fechaInicio: string,
    fechaFin: string
  ) => {
    try {
      setCargando(true);
      const result = await eliminarRangoNoDisponible(medicoId, {
        fechaInicio,
        fechaFin,
      });
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar rango';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { eliminarDia, eliminarRango, cargando, error };
};
