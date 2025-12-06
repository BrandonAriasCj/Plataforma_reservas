'use client';

import { useState, useEffect } from 'react';
import { getCitasMedico, actualizarCita } from '@/services/medicoService';

interface Cita {
  id: number;
  fecha_hora?: string;
  fecha?: string;
  motivo?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  paciente_id?: number;
}

interface GestionCitasProps {
  medicoId: number;
  onUpdate?: () => void;
}

const estadoColores: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  completada: 'bg-blue-100 text-blue-800',
  cancelada: 'bg-red-100 text-red-800',
};

const estadoTexto: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

export default function GestionCitas({ medicoId, onUpdate }: GestionCitasProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('');
  const [actualizando, setActualizando] = useState<number | null>(null);

  useEffect(() => {
    cargarCitas();
  }, [medicoId, filtro]);

  const cargarCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filtro ? { estado: filtro } : undefined;
      const response = await getCitasMedico(medicoId, params);
      // El backend devuelve { total, data }
      const citasData = response.data || response.citas || response || [];
      setCitas(Array.isArray(citasData) ? citasData : []);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.message || 'Error al cargar citas';
      setError(errorMsg);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (citaId: number, nuevoEstado: string) => {
    setActualizando(citaId);
    try {
      await actualizarCita(citaId, nuevoEstado as any);
      await cargarCitas();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError('Error al actualizar cita');
      console.error(err);
    } finally {
      setActualizando(null);
    }
  };

  const formatearFecha = (fechaHora: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(fechaHora));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Citas</h2>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">{error}</div>}

      {/* Filtro de estado */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFiltro('')}
          className={`px-4 py-2 rounded ${!filtro ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Todas
        </button>
        {['pendiente', 'confirmada', 'completada', 'cancelada'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded capitalize ${filtro === estado ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            {estadoTexto[estado]}
          </button>
        ))}
      </div>

      {/* Lista de citas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando citas...</p>
        </div>
      ) : citas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filtro ? `No hay citas ${estadoTexto[filtro]?.toLowerCase() || filtro}` : 'Aún no tienes citas programadas'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {citas.map(cita => (
            <div key={cita.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {cita.nombre || 'N/A'} {cita.apellido || ''}
                  </h3>
                  <p className="text-sm text-gray-600">{cita.email || 'Sin email'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoColores[cita.estado]}`}>
                  {estadoTexto[cita.estado]}
                </span>
              </div>

              <div className="mb-4 space-y-1 text-sm">
                <p><strong>Fecha y hora:</strong> {formatearFecha(cita.fecha_hora || cita.fecha || new Date().toISOString())}</p>
                {cita.motivo && <p><strong>Motivo:</strong> {cita.motivo}</p>}
                {cita.telefono && <p><strong>Teléfono:</strong> {cita.telefono}</p>}
              </div>

              {/* Acciones según estado */}
              <div className="flex gap-2 flex-wrap mt-4 border-t pt-3">
                {cita.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(cita.id, 'confirmada')}
                      disabled={actualizando === cita.id}
                      className="px-3 py-1.5 rounded text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition disabled:opacity-50"
                    >
                      Confirmar Cita
                    </button>
                    <button
                      onClick={() => cambiarEstado(cita.id, 'cancelada')}
                      disabled={actualizando === cita.id}
                      className="px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {cita.estado === 'confirmada' && (
                  <>
                    <button
                      onClick={() => cambiarEstado(cita.id, 'completada')}
                      disabled={actualizando === cita.id}
                      className="px-3 py-1.5 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition disabled:opacity-50"
                    >
                      Marcar Completada
                    </button>
                    <button
                      onClick={() => cambiarEstado(cita.id, 'cancelada')}
                      disabled={actualizando === cita.id}
                      className="px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {/* Si está completa o cancelada no mostramos acciones por defecto */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
