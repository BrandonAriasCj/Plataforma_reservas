'use client';

import { useState } from 'react';
import { useMarcarNoDisponible } from '@/hooks/useDisponibilidades';

interface DisponibilidadFormProps {
  medicoId: number;
  onActualizado?: () => void;
}

export default function DisponibilidadForm({ medicoId, onActualizado }: DisponibilidadFormProps) {
  const { marcarDia, marcarRango, cargando, error } = useMarcarNoDisponible();
  const [tipoMarcado, setTipoMarcado] = useState<'dia' | 'rango'>('dia');
  const [fecha, setFecha] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [exito, setExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

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
        setFecha('');
      } else {
        if (!fechaInicio || !fechaFin) {
          alert('Por favor completa las fechas');
          return;
        }
        await marcarRango(medicoId, fechaInicio, fechaFin);
        setMensajeExito('Rango de días marcado como NO disponible');
        setFechaInicio('');
        setFechaFin('');
      }

      setExito(true);
      onActualizado?.();
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Marcar como No Disponible</h2>

      {exito && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✓ {mensajeExito}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
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
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Fecha inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          {cargando ? 'Guardando...' : 'Guardar marcado'}
        </button>
      </form>
    </div>
  );
}
