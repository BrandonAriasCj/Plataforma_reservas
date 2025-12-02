'use client';

import { useState, useEffect } from 'react';
import {
  getMedicos,
  getMedicoById,
  actualizarMedico,
} from '@/services/medicoService';

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  fecha_creacion?: string;
}

export const useMedicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        setCargando(true);
        const data = await getMedicos();
        // Manejar diferentes formatos de respuesta
        const medicosArray = Array.isArray(data) ? data : data?.data || [];
        setMedicos(medicosArray);
        setError(null);
      } catch (err) {
        setError('Error al cargar médicos');
        console.error(err);
        setMedicos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarMedicos();
  }, []);

  return { medicos, cargando, error, recargar: () => {} };
};

/**
 * Hook para obtener un médico específico por ID
 */
export const useMedicoById = (id: number | null) => {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const cargarMedico = async () => {
      try {
        setCargando(true);
        const data = await getMedicoById(id);
        // Manejar diferentes formatos de respuesta
        const medicoData = data?.data || data;
        setMedico(medicoData);
        setError(null);
      } catch (err) {
        setError('Error al cargar médico');
        console.error(err);
        setMedico(null);
      } finally {
        setCargando(false);
      }
    };

    cargarMedico();
  }, [id]);

  return { medico, cargando, error };
};

/**
 * Hook para actualizar médico
 */
export const useActualizarMedico = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizar = async (
    id: number,
    datos: Partial<{
      nombre: string;
      especialidad: string;
      email: string;
      telefono: string;
    }>
  ) => {
    try {
      setCargando(true);
      const result = await actualizarMedico(id, datos);
      setError(null);
      return result;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al actualizar médico';
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { actualizar, cargando, error };
};
