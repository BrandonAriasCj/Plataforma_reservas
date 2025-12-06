
'use client';

import React, { useState } from 'react';
import type { Cita, EstadoCita } from '@/types/patient';
import { format, parseISO, addHours } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentCardProps {
    cita: Cita;
    onCancel?: (citaId: number) => void;
    onSaveEdit?: (citaId: number, nuevoMotivo: string) => Promise<void>;
    loading?: boolean;
}

const estadoConfig: Record<string, { label: string; color: string; bg: string }> = {
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
    confirmada: {
        label: 'Confirmada',
        color: 'text-green-700',
        bg: 'bg-green-100 border-green-300',
    },
    completada: {
        label: 'Completada',
        color: 'text-blue-700',
        bg: 'bg-blue-100 border-blue-300',
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

export function AppointmentCard({ cita, onCancel, onSaveEdit, loading }: AppointmentCardProps) {
    const estado = estadoConfig[cita.estado];
    const fechaObj = parseISO(cita.fecha_hora || cita.fecha || new Date().toISOString());

    const [isEditing, setIsEditing] = useState(false);
    const [tempMotivo, setTempMotivo] = useState(cita.motivo || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (onSaveEdit) {
            try {
                setSaving(true);
                await onSaveEdit(cita.id, tempMotivo);
                setIsEditing(false);
            } catch (error) {
                console.error('Error saving edit', error);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTempMotivo(cita.motivo || '');
    };

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
                                    {format(fechaObj, 'HH:mm')} - {format(addHours(fechaObj, 1), 'HH:mm')}
                                </span>
                            </div>
                        </div>

                        {/* Motivo (Editable) */}
                        <div className="mt-3">
                            {isEditing ? (
                                <div className="rounded-lg bg-blue-50 p-3 animate-in fade-in duration-200">
                                    <label className="mb-1 block text-xs font-semibold text-blue-700">Editar Motivo:</label>
                                    <textarea
                                        value={tempMotivo}
                                        onChange={(e) => setTempMotivo(e.target.value)}
                                        className="w-full rounded-md border border-blue-200 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                        rows={3}
                                    />
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="rounded px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Guardando...' : 'Guardar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                cita.motivo && (
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-gray-700">Motivo:</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{cita.motivo}</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Comentario del médico */}
                        {cita.comentario_medico && (
                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                <p className="text-sm font-medium text-blue-700">Comentario del médico:</p>
                                <p className="mt-1 text-sm text-gray-700">{cita.comentario_medico}</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Status badge & Actions */}
                    <div className="flex flex-col items-end gap-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${estado.bg} ${estado.color}`}>
                            {estado.label}
                        </span>

                        {/* Actions */}
                        {cita.estado === 'pendiente' && !isEditing && (
                            <div className="flex flex-col gap-2 w-full">
                                {onSaveEdit && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Editar
                                    </button>
                                )}
                                {onCancel && (
                                    <button
                                        onClick={() => onCancel(cita.id)}
                                        disabled={loading}
                                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {loading ? '...' : 'Cancelar'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
