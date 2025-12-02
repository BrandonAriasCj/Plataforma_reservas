'use client';

import { useMedicos } from '@/hooks/useMedicos';
import Link from 'next/link';

export default function ListaMedicos() {
  const { medicos, cargando, error } = useMedicos();

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Médicos</h1>

      {medicos.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay médicos registrados</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicos.map((medico) => (
            <div
              key={medico.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {medico.nombre}
              </h2>
              <p className="text-blue-600 font-semibold mb-3">
                {medico.especialidad}
              </p>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>
                  <strong>Email:</strong> {medico.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {medico.telefono}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/medicos/${medico.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                  Ver Detalles
                </Link>
                <Link
                  href={`/medicos/${medico.id}/editar`}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
