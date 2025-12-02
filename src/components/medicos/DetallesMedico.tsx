'use client';

import { useMedicoById } from '@/hooks/useMedicos';
import { useCalendario } from '@/hooks/useDisponibilidades';
import { useState } from 'react';
import CalendarioMedico from './CalendarioMedico';
import Link from 'next/link';

interface DetallesMedicoProps {
  medicoId: number;
}

export default function DetallesMedico({ medicoId }: DetallesMedicoProps) {
  const { medico, cargando: cargandoMedico, error: errorMedico } = useMedicoById(medicoId);
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);
  const [anoActual, setAnoActual] = useState(new Date().getFullYear());
  const { calendario, cargando: cargandoCalendario, error: errorCalendario } =
    useCalendario(medicoId, mesActual, anoActual);

  if (cargandoMedico) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errorMedico || !medico) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {errorMedico || 'Médico no encontrado'}
      </div>
    );
  }

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón volver */}
      <Link href="/medicos" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Volver
      </Link>

      {/* Información del Médico */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {medico.nombre}
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              {medico.especialidad}
            </p>
            <div className="text-gray-600 space-y-2">
              <p>
                <strong>Email:</strong> <a href={`mailto:${medico.email}`} className="text-blue-600 hover:underline">{medico.email}</a>
              </p>
              <p>
                <strong>Teléfono:</strong> <a href={`tel:${medico.telefono}`} className="text-blue-600 hover:underline">{medico.telefono}</a>
              </p>
            </div>
          </div>
          <Link
            href={`/medicos/${medico.id}/editar`}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Disponibilidad - {mesesNombres[mesActual - 1]} {anoActual}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (mesActual === 1) {
                  setMesActual(12);
                  setAnoActual(anoActual - 1);
                } else {
                  setMesActual(mesActual - 1);
                }
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              ← Anterior
            </button>
            <button
              onClick={() => {
                if (mesActual === 12) {
                  setMesActual(1);
                  setAnoActual(anoActual + 1);
                } else {
                  setMesActual(mesActual + 1);
                }
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {cargandoCalendario ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : errorCalendario ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {errorCalendario}
          </div>
        ) : calendario ? (
          <>
            <CalendarioMedico
              calendario={calendario}
              medicoId={medico.id}
              onActualizar={() => {}}
            />
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>Disponible ({calendario.dias_disponibles_total})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                <span>No disponible ({calendario.dias_no_disponibles_total})</span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 flex gap-4">
        <Link
          href={`/medicos/${medico.id}/disponibilidad`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Marcar Disponibilidad
        </Link>
        <Link
          href={`/medicos/${medico.id}/citas`}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          Ver Citas
        </Link>
      </div>
    </div>
  );
}
