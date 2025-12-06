"use client";

import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { PatientService } from '@/services/patientService';
import type { Cita } from '@/types/patient';
import Link from 'next/link';

export default function PatientDashboard() {
    const { user } = useAuth();
    const [upcomingCitas, setUpcomingCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUpcomingCitas();
    }, []);

    const loadUpcomingCitas = async () => {
        try {
            const response = await PatientService.getCitas({ estado: 'aceptada' });
            if (response.success && response.data) {
                // Mostrar solo las próximas 3 citas
                setUpcomingCitas(response.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Error al cargar citas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Panel de Paciente">
            <div className="h-full overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenido, {user?.name}! 👋
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Gestiona tus citas médicas y mantente al día con tu salud
                    </p>
                </div>

                {/* Quick Actions - Cards principales */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Card: Reservar Cita */}
                    <Link href="/paciente/reservar">
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105 cursor-pointer">
                            <div className="absolute top-0 right-0 opacity-10">
                                <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Reservar Cita</h3>
                                <p className="text-blue-100 text-sm">
                                    Agenda una cita con nuestros médicos especialistas
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium">
                                    Comenzar
                                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card: Mis Citas */}
                    <Link href="/paciente/citas">
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105 cursor-pointer">
                            <div className="absolute top-0 right-0 opacity-10">
                                <svg className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Mis Citas</h3>
                                <p className="text-purple-100 text-sm">
                                    Revisa el estado y detalles de tus citas médicas
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium">
                                    Ver todas
                                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Próximas Citas */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Próximas Citas</h3>
                        <Link href="/paciente/citas" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ver todas →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : upcomingCitas.length === 0 ? (
                        <div className="py-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">No tienes citas próximas</p>
                            <Link href="/paciente/reservar" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                                Reservar una cita →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingCitas.map((cita) => (
                                <div key={cita.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{cita.medico?.nombre || 'Médico'}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(cita.fecha).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} - {cita.hora_inicio}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                        Confirmada
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
