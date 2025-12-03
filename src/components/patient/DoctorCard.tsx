/**
 * Doctor Card Component
 * Tarjeta para mostrarméd disponibles
 */

'use client';

import React from 'react';
import type { Medico } from '@/types/patient';

interface DoctorCardProps {
    medico: Medico;
    onSelect?: (medico: Medico) => void;
    selected?: boolean;
}

export function DoctorCard({ medico, onSelect, selected }: DoctorCardProps) {
    return (
        <div
            onClick={() => onSelect?.(medico)}
            className={`
        group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${selected
                    ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-200'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
      `}
        >
            <div className="p-6">
                {/* Avatar */}
                <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                        {medico.foto_perfil ? (
                            <img
                                src={medico.foto_perfil}
                                alt={`${medico.nombre} ${medico.apellido}`}
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white ring-2 ring-gray-200">
                                {medico.nombre[0]}
                                {medico.apellido[0]}
                            </div>
                        )}
                        {/* Status indicator */}
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            Dr. {medico.nombre} {medico.apellido}
                        </h3>
                        <p className="text-sm font-medium text-blue-600 mt-0.5">
                            {medico.especialidad}
                        </p>
                        {medico.telefono && (
                            <p className="text-sm text-gray-500 mt-1">{medico.telefono}</p>
                        )}
                    </div>

                    {/* Select indicator */}
                    {selected && (
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {medico.descripcion && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                        {medico.descripcion}
                    </p>
                )}

                {/* Action button */}
                <button
                    className={`
            mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
            ${selected
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
          `}
                >
                    {selected ? 'Seleccionado' : 'Seleccionar'}
                </button>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
    );
}
