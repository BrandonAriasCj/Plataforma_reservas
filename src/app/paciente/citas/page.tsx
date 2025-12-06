/**
 * Patient Appointments Page
 * Vista de estados de citas del paciente
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AppointmentCard } from '@/components/patient/AppointmentCard';
import { PatientService } from '@/services/patientService';
import { AppointmentService } from '@/services/appointmentService';
import type { Cita, EstadoCita } from '@/types/patient';

const estadoTabs: { value: '' | EstadoCita; label: string }[] = [
    { value: '', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
];

export default function AppointmentsPage() {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState<number | null>(null);
    const [estadoFiltro, setEstadoFiltro] = useState<'' | EstadoCita>('');

    useEffect(() => {
        loadCitas();
    }, [estadoFiltro]);

    const loadCitas = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const pacienteId = user?.paciente_id;

            if (!pacienteId) {
                console.error('No se pudo obtener el ID del paciente');
                setLoading(false);
                return;
            }

            setLoading(true);
            const response = await PatientService.getCitas(
                pacienteId,
                estadoFiltro ? { estado: estadoFiltro } : undefined
            );
            if (response.success && response.data) {
                setCitas(response.data);
            }
        } catch (error) {
            console.error('Error al cargar citas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (citaId: number) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

        try {
            setCancelingId(citaId);
            const response = await AppointmentService.cancel(citaId);
            if (response.success) {
                // Actualizar la lista
                setCitas((prev) =>
                    prev.map((c) => (c.id === citaId ? { ...c, estado: 'cancelada' as EstadoCita } : c))
                );
            }
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            alert('Error al cancelar la cita');
        } finally {
            setCancelingId(null);
        }
    };

    const handleSaveEdit = async (citaId: number, nuevoMotivo: string) => {
        try {
            const response = await AppointmentService.update(citaId, {
                motivo: nuevoMotivo
            });

            if (response.success) {
                // Actualizar la lista localmente
                setCitas((prev) =>
                    prev.map((c) => (c.id === citaId ? { ...c, motivo: nuevoMotivo } : c))
                );
            } else {
                alert('No se pudo actualizar la cita');
            }
        } catch (error) {
            console.error('Error al actualizar cita:', error);
            alert('Error al guardar los cambios');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="mx-auto max-w-6xl">
                {/* Header con botón de volver */}
                <div className="mb-8 relative">
                    <div className="absolute right-0 top-0 hidden md:block">
                        <a href="/paciente/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                            Volver al Dashboard
                        </a>
                    </div>
                    {/* Botón visible solo en móvil */}
                    <div className="md:hidden mb-4">
                        <a href="/paciente/dashboard" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-1">
                            ← Volver al Dashboard
                        </a>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900">Mis Citas</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Gestiona y revisa el estado de tus citas médicas
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="inline-flex gap-2 rounded-xl bg-white p-2 shadow-sm">
                        {estadoTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setEstadoFiltro(tab.value)}
                                className={`
                  rounded-lg px-6 py-2.5 text-sm font-medium transition-all
                  ${estadoFiltro === tab.value
                                        ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && citas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No hay citas</h3>
                        <p className="mt-2 text-gray-600">
                            {estadoFiltro
                                ? `No tienes citas con estado "${estadoTabs.find((t) => t.value === estadoFiltro)?.label}"`
                                : 'Aún no has reservado ninguna cita'}
                        </p>
                        <a
                            href="/paciente/reservar"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Reservar cita
                        </a>
                    </div>
                )}

                {/* Lista de citas */}
                {!loading && citas.length > 0 && (
                    <div className="space-y-4">
                        {citas.map((cita) => (
                            <AppointmentCard
                                key={cita.id}
                                cita={cita}
                                onCancel={handleCancel}
                                onSaveEdit={handleSaveEdit}
                                loading={cancelingId === cita.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
