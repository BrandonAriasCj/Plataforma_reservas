/**
 * Appointment Card Component
 * Tarjeta para mostrar citas del paciente
 */

'use client';

import React from 'react';
import type { Cita, EstadoCita } from '@/types/patient';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentCardProps {
    cita: Cita;
    onCancel?: (citaId: number) => void;
    loading?: boolean;
}

const estadoConfig: Record<EstadoCita, { label: string; color: string; bg: string }> = {
    pendiente: {
        label: 'Pendiente',
        color: 'text-yellow-700',
        bg: 'bg-yellow-100 border-yellow-300',
    },
    aceptada: {
        label: 'Aceptada',
        color: 'text-green-700',
        bg: 'bg-green-100 border-green-300',
    },
    rechazada: {
        label: 'Rechazada',
        color: 'text-red-700',
        bg: 'bg-red-100 border-red-300',
    },
    cancelada: {
        label: 'Cancelada',
        color: 'text-gray-700',
        bg: 'bg-gray-100 border-gray-300',
    },
};

export function AppointmentCard({ cita, onCancel, loading }: AppointmentCardProps) {
    const estado = estadoConfig[cita.estado];
    const fechaObj = parseISO(cita.fecha);

    return (
        <div className="group overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* Status bar */}
            <div className={`h-2 ${estado.bg.split(' ')[0].replace('bg-', 'bg-')}`}></div>

            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Doctor info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            {cita.medico?.foto_perfil ? (
                                <img
                                    src={cita.medico.foto_perfil}
                                    alt={`Dr. ${cita.medico.nombre}`}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white ring-2 ring-gray-200">
                                    {cita.medico?.nombre?.[0]}
                                    {cita.medico?.apellido?.[0]}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                    Dr. {cita.medico?.nombre} {cita.medico?.apellido}
                                </h3>
                                <p className="text-sm text-blue-600">
                                    {cita.medico?.especialidad}
                                </p>
                            </div>
                        </div>

                        {/* Date and time */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                    {format(fechaObj, "d 'de' MMMM, yyyy", { locale: es })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                    {cita.hora_inicio} - {cita.hora_fin}
                                </span>
                            </div>
                        </div>

                        {/* Motivo */}
                        {cita.motivo && (
                            <div className="mt-3 rounded-lg bg-gray-50 p-3">
                                <p className="text-sm font-medium text-gray-700">Motivo:</p>
                                <p className="mt-1 text-sm text-gray-600">{cita.motivo}</p>
                            </div>
                        )}

                        {/* Comentario del médico */}
                        {cita.comentario_medico && (
                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                <p className="text-sm font-medium text-blue-700">Comentario del médico:</p>
                                <p className="mt-1 text-sm text-gray-700">{cita.comentario_medico}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Status badge */}
                    <div className="flex flex-col items-end gap-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${estado.bg} ${estado.color}`}>
                            {estado.label}
                        </span>

                        {/* Cancel button */}
                        {cita.estado === 'pendiente' && onCancel && (
                            <button
                                onClick={() => onCancel(cita.id)}
                                disabled={loading}
                                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Cancelando...' : 'Cancelar cita'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
