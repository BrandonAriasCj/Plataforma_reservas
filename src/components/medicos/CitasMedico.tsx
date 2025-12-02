'use client';

import { useCitasMedico, useActualizarCita, EstadoCita } from '@/hooks/useCitas';
import { useMedicoById } from '@/hooks/useMedicos';
import Link from 'next/link';
import { useState } from 'react';

interface CitasMedicoProps {
  medicoId: number;
}

export default function CitasMedico({ medicoId }: CitasMedicoProps) {
  const { medico, cargando: cargandoMedico } = useMedicoById(medicoId);
  const { citas, cargando, error } = useCitasMedico(medicoId);
  const { actualizar, cargando: actualizando } = useActualizarCita();
  const [filtroEstado, setFiltroEstado] = useState<EstadoCita | 'todas'>('todas');

  const estadosDisponibles: EstadoCita[] = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  const coloresEstado: Record<EstadoCita, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmada: 'bg-green-100 text-green-800 border-green-300',
    cancelada: 'bg-red-100 text-red-800 border-red-300',
    completada: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const citasFiltradas =
    filtroEstado === 'todas'
      ? citas
      : citas.filter((c) => c.estado === filtroEstado);

  const handleCambiarEstado = async (citaId: number, nuevoEstado: EstadoCita) => {
    try {
      await actualizar(citaId, nuevoEstado);
      // Aquí se recargará automáticamente cuando el hook se actualice
    } catch (err) {
      console.error(err);
    }
  };

  if (cargandoMedico) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/medicos/${medicoId}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Volver
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Citas de {medico?.nombre}
        </h1>
        <p className="text-gray-600">{medico?.especialidad}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block text-gray-700 font-bold mb-3">
          Filtrar por estado:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstado('todas')}
            className={`px-4 py-2 rounded font-semibold transition ${
              filtroEstado === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          {estadosDisponibles.map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded font-semibold transition ${
                filtroEstado === estado
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de citas */}
      {cargando ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : citasFiltradas.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
          No hay citas {filtroEstado !== 'todas' ? `en estado "${filtroEstado}"` : ''}
        </div>
      ) : (
        <div className="space-y-4">
          {citasFiltradas.map((cita) => (
            <div
              key={cita.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-bold text-lg">{cita.fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="font-bold text-lg">{cita.hora}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paciente ID</p>
                  <p className="font-bold">{cita.paciente_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Motivo</p>
                  <p className="font-bold">{cita.motivo}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full border font-semibold text-sm ${coloresEstado[cita.estado]}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {estadosDisponibles
                      .filter((e) => e !== cita.estado)
                      .map((estado) => (
                        <button
                          key={estado}
                          onClick={() => handleCambiarEstado(cita.id, estado)}
                          disabled={actualizando}
                          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-1 px-3 rounded text-sm transition"
                        >
                          {estado === 'confirmada' && '✓'}
                          {estado === 'cancelada' && '✗'}
                          {estado === 'completada' && '✔'}
                          {estado === 'pendiente' && '⏳'}
                          {' ' + estado}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
