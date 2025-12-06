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
    }, [user?.paciente_id]); // Añadido dependencia

    const loadUpcomingCitas = async () => {
        try {
            if (!user?.paciente_id) {
                setLoading(false);
                return;
            }
            // Traemos todas para filtrar en el cliente las futuras y activas
            const response = await PatientService.getCitas(user.paciente_id, {});

            if (response.success && response.data) {
                const now = new Date();
                // Ajustar 'now' al inicio del dia si queremos mostrar citas de hoy que ya pasaron hora? 
                // Mejor mostrar citas futuras reales (hora incluida)

                const futuras = response.data.filter((c: any) => {
                    const fechaCita = new Date(c.fecha_hora || c.fecha);
                    // Validar que sea futura y estado activo
                    const esFutura = fechaCita >= now;
                    const estadoActivo = ['pendiente', 'confirmada', 'aceptada'].includes(c.estado);
                    return esFutura && estadoActivo;
                });

                // Ordenar por fecha más cercana
                futuras.sort((a: any, b: any) => {
                    const fechaA = new Date(a.fecha_hora || a.fecha).getTime();
                    const fechaB = new Date(b.fecha_hora || b.fecha).getTime();
                    return fechaA - fechaB;
                });

                setUpcomingCitas(futuras.slice(0, 3));
            }
        } catch (error) {
            console.error('Error al cargar citas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Panel de Paciente">
            {/* Contenedor principal para centrar y limitar ancho */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                {/* Header */}
                <div className="mb-8 mt-6">
                    <h2 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenido, {user?.name}! 👋
                    </h2>
                    <p className="mt-2 text-gray-600 text-lg">
                        Gestiona tus citas médicas y mantente al día con tu salud
                    </p>
                </div>

                {/* Quick Actions - Cards principales */}
                <div className="grid gap-8 md:grid-cols-2 mb-10">
                    {/* Card: Reservar Cita */}
                    <Link href="/paciente/reservar" className="block h-full">
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer h-full">
                            <div className="absolute top-0 right-0 opacity-10">
                                <svg className="h-40 w-40 transform translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Reservar Cita</h3>
                                <p className="text-blue-100 text-base mb-6">
                                    Agenda una cita con nuestros médicos especialistas de manera rápida y sencilla.
                                </p>
                                <div className="flex items-center text-base font-medium bg-white/20 w-fit px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                    Comenzar
                                    <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card: Mis Citas */}
                    <Link href="/paciente/citas" className="block h-full">
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer h-full">
                            <div className="absolute top-0 right-0 opacity-10">
                                <svg className="h-40 w-40 transform translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Mis Citas</h3>
                                <p className="text-purple-100 text-base mb-6">
                                    Revisa el historial, estado y detalles de tus citas médicas programadas.
                                </p>
                                <div className="flex items-center text-base font-medium bg-white/20 w-fit px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                    Ver todas
                                    <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Próximas Citas - Full Width */}
                <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100 mb-8">
                    <div className="mb-6 flex items-center justify-between border-b pb-4 border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-blue-500">📅</span> Próximas Citas
                        </h3>
                        <Link href="/paciente/citas" className="group text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                            Ver todas las citas
                            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : upcomingCitas.length === 0 ? (
                        <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-medium text-lg">No tienes citas próximas</p>
                            <p className="mt-1 text-gray-500 mb-6">Agenda una nueva cita para comenzar a cuidar tu salud.</p>
                            <Link href="/paciente/reservar" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors">
                                Reservar una cita ahora
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingCitas.map((cita) => (
                                <div key={cita.id} className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-gray-200 p-5 transition-all hover:bg-blue-50/50 hover:border-blue-200 group">
                                    <div className="flex items-start gap-5">
                                        <div className="hidden md:flex flex-col items-center justify-center h-16 w-16 rounded-xl bg-blue-100 text-blue-700 font-bold shadow-sm">
                                            <span className="text-xs uppercase">{new Date(cita.fecha_hora || cita.fecha).toLocaleString('es-ES', { month: 'short' })}</span>
                                            <span className="text-xl">{new Date(cita.fecha_hora || cita.fecha).getDate()}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 text-lg">{cita.medico?.nombre || 'Médico'}</h4>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                    ${cita.estado === 'confirmada' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                            'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {new Date(cita.fecha_hora || cita.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="hidden sm:inline text-gray-300">|</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {cita.medico?.especialidad || 'Especialidad General'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex justify-end">
                                        <Link href={`/paciente/citas`} className="text-sm font-medium text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-white transition-colors">
                                            Ver detalles →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
