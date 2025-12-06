'use client';

import { useState, useEffect } from 'react';
import { getCitasMedico, actualizarCita } from '@/services/medicoService';

interface Cita {
  id: number;
  fecha_hora: string;
  motivo: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  paciente: {
    usuario: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}

interface GestionCitasProps {
  medicoId: number;
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

export default function GestionCitas({ medicoId }: GestionCitasProps) {
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
    try {
      const params = filtro ? { estado: filtro } : undefined;
      const response = await getCitasMedico(medicoId, params);
      setCitas(response.citas);
      setError(null);
    } catch (err) {
      setError('Error al cargar citas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (citaId: number, nuevoEstado: string) => {
    setActualizando(citaId);
    try {
      await actualizarCita(citaId, nuevoEstado as any);
      await cargarCitas();
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
            className={`px-4 py-2 rounded capitalize ${
              filtro === estado ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {estadoTexto[estado]}
          </button>
        ))}
      </div>

      {/* Lista de citas */}
      {loading ? (
        <div className="text-center py-8">Cargando citas...</div>
      ) : citas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay citas disponibles</div>
      ) : (
        <div className="space-y-4">
          {citas.map(cita => (
            <div key={cita.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {cita.paciente.usuario.nombre} {cita.paciente.usuario.apellido}
                  </h3>
                  <p className="text-sm text-gray-600">{cita.paciente.usuario.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoColores[cita.estado]}`}>
                  {estadoTexto[cita.estado]}
                </span>
              </div>

              <div className="mb-4 space-y-1 text-sm">
                <p><strong>Fecha y hora:</strong> {formatearFecha(cita.fecha_hora)}</p>
                <p><strong>Motivo:</strong> {cita.motivo}</p>
              </div>

              {/* Cambiar estado */}
              <div className="flex gap-2 flex-wrap">
                {['pendiente', 'confirmada', 'completada', 'cancelada']
                  .filter(estado => estado !== cita.estado)
                  .map(estado => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstado(cita.id, estado)}
                      disabled={actualizando === cita.id}
                      className={`px-3 py-1 rounded text-sm font-medium transition capitalize
                        ${estadoColores[estado]} hover:opacity-80 disabled:opacity-50
                      `}
                    >
                      {actualizando === cita.id ? 'Actualizando...' : `Marcar como ${estadoTexto[estado]}`}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
