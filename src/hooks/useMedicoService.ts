'use client';

import { useState, useEffect } from 'react';
import {
  getMedicos,
  getMedicoById,
  actualizarMedico,
  getCitasMedico,
  getCalendario,
  getDisponibilidades,
  Medico,
  Cita,
  DiaCalendario,
  Disponibilidad,
} from '@/services/medicoService';

export const useMedicoInfo = (medicoId: number) => {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMedico = async () => {
      try {
        setLoading(true);
        const data = await getMedicoById(medicoId);
        setMedico(data as Medico);
        setError(null);
      } catch (err) {
        setError('Error al cargar la información del médico');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (medicoId) {
      cargarMedico();
    }
  }, [medicoId]);

  const refresh = async () => {
    if (!medicoId) return;
    try {
      const data = await getMedicoById(medicoId);
      setMedico(data as Medico);
    } catch (err) {
      setError('Error al actualizar información');
    }
  };

  return { medico, loading, error, refresh };
};

export const useMedicosLista = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        setLoading(true);
        const data = await getMedicos();
        setMedicos((data.medicos || []) as Medico[]);
        setError(null);
      } catch (err) {
        setError('Error al cargar médicos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarMedicos();
  }, []);

  return { medicos, loading, error };
};

export const useMedicoCitas = (medicoId: number, filtro?: string) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        setLoading(true);
        const params = filtro ? { estado: filtro } : undefined;
        const data = await getCitasMedico(medicoId, params);
        setCitas((data.citas || []) as Cita[]);
        setError(null);
      } catch (err) {
        setError('Error al cargar citas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (medicoId) {
      cargarCitas();
    }
  }, [medicoId, filtro]);

  return { citas, loading, error };
};

export const useMedicoCalendario = (medicoId: number, mes?: number, año?: number) => {
  const [dias, setDias] = useState<DiaCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCalendario = async () => {
      try {
        setLoading(true);
        const data = await getCalendario(medicoId, {
          mes: mes || new Date().getMonth() + 1,
          año: año || new Date().getFullYear(),
        });
        setDias((data.dias || []) as DiaCalendario[]);
        setError(null);
      } catch (err) {
        setError('Error al cargar calendario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (medicoId) {
      cargarCalendario();
    }
  }, [medicoId, mes, año]);

  return { dias, loading, error };
};

export const useMedicoDisponibilidades = (medicoId: number, mes?: number, año?: number) => {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDisponibilidades = async () => {
      try {
        setLoading(true);
        const data = await getDisponibilidades(medicoId, {
          mes: mes,
          año: año,
        });
        setDisponibilidades((data.disponibilidades || []) as Disponibilidad[]);
        setError(null);
      } catch (err) {
        setError('Error al cargar disponibilidades');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (medicoId) {
      cargarDisponibilidades();
    }
  }, [medicoId, mes, año]);

  return { disponibilidades, loading, error };
};
