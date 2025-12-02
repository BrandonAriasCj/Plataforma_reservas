'use client';

import { useState } from 'react';
import { useMarcarNoDisponible } from '@/hooks/useDisponibilidades';
import { useMedicoById } from '@/hooks/useMedicos';
import Link from 'next/link';

interface MarcarDisponibilidadProps {
  medicoId: number;
}

export default function MarcarDisponibilidad({ medicoId }: MarcarDisponibilidadProps) {
  const { medico, cargando: cargandoMedico } = useMedicoById(medicoId);
  const { marcarDia, marcarRango, cargando, error } = useMarcarNoDisponible();

  const [tipoMarcado, setTipoMarcado] = useState<'dia' | 'rango'>('dia');
  const [fecha, setFecha] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [exito, setExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const razonesComunes = [
    'Vacaciones',
    'Cirugía programada',
    'Capacitación médica',
    'Permiso personal',
    'Conferencia',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExito(false);

    try {
      if (tipoMarcado === 'dia') {
        if (!fecha) {
          alert('Por favor selecciona una fecha');
          return;
        }
        await marcarDia(medicoId, fecha);
        setMensajeExito('Día marcado como NO disponible');
      } else {
        if (!fechaInicio || !fechaFin) {
          alert('Por favor completa las fechas');
          return;
        }
        await marcarRango(medicoId, fechaInicio, fechaFin);
        setMensajeExito('Rango de días marcado como NO disponible');
      }

      // Limpiar formulario
      setFecha('');
      setFechaInicio('');
      setFechaFin('');
      setExito(true);

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setExito(false), 3000);
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/medicos/${medicoId}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Volver
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Marcar como no disponible
        </h1>
        <p className="text-gray-600 mb-6">
          {medico?.nombre} - {medico?.especialidad}
        </p>

        {exito && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✓ {mensajeExito}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de marcado */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Tipo de marcado
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="dia"
                  checked={tipoMarcado === 'dia'}
                  onChange={() => setTipoMarcado('dia')}
                  className="mr-2"
                />
                Día único
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="rango"
                  checked={tipoMarcado === 'rango'}
                  onChange={() => setTipoMarcado('rango')}
                  className="mr-2"
                />
                Rango de días
              </label>
            </div>
          </div>

          {/* Fechas */}
          {tipoMarcado === 'dia' ? (
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Fecha inicio *
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Fecha fin *
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
            >
              {cargando ? 'Guardando...' : 'Guardar marcado'}
            </button>
            <Link
              href={`/medicos/${medicoId}`}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
