/**
 * Book Appointment Page
 * Página para reservar citas con médicos disponibles
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DoctorCard } from '@/components/patient/DoctorCard';
import { DoctorService } from '@/services/doctorService';
import { AppointmentService } from '@/services/appointmentService';
import type { Medico, HorarioDisponible } from '@/types/patient';

export default function BookAppointmentPage() {
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [especialidades, setEspecialidades] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [especialidadFiltro, setEspecialidadFiltro] = useState('');

    // Paso 1: Seleccionar médico
    const [selectedDoctor, setSelectedDoctor] = useState<Medico | null>(null);

    // Paso 2: Seleccionar fecha y hora
    const [selectedDate, setSelectedDate] = useState('');
    const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([]);
    const [selectedHorario, setSelectedHorario] = useState<HorarioDisponible | null>(null);
    const [loadingHorarios, setLoadingHorarios] = useState(false);

    // Paso 3: Motivo
    const [motivo, setMotivo] = useState('');

    // Estado de reserva
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        loadMedicos();
        loadEspecialidades();
    }, []);

    useEffect(() => {
        loadMedicos();
    }, [especialidadFiltro]);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            loadHorarios();
        } else {
            setHorariosDisponibles([]);
            setSelectedHorario(null);
        }
    }, [selectedDoctor, selectedDate]);

    const loadMedicos = async () => {
        try {
            setLoading(true);
            const response = await DoctorService.getAll(especialidadFiltro || undefined);
            if (response.success && response.data) {
                setMedicos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar médicos:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEspecialidades = async () => {
        try {
            const esp = await DoctorService.getEspecialidades();
            setEspecialidades(esp);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
        }
    };

    const loadHorarios = async () => {
        if (!selectedDoctor || !selectedDate) return;

        try {
            setLoadingHorarios(true);
            const response = await AppointmentService.getDoctorAvailability(
                selectedDoctor.id,
                selectedDate
            );

            if (response.success && response.data) {
                if (response.data.disponible && response.data.horarios) {
                    setHorariosDisponibles(response.data.horarios);
                } else {
                    setHorariosDisponibles([]);
                    alert(response.data.razon || 'Médico no disponible en esta fecha');
                }
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            alert('Error al cargar horarios disponibles');
        } finally {
            setLoadingHorarios(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !selectedDate || !selectedHorario) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            setBooking(true);
            const response = await AppointmentService.create({
                medico_id: selectedDoctor.id,
                fecha: selectedDate,
                hora_inicio: selectedHorario.inicio,
                hora_fin: selectedHorario.fin,
                motivo,
            });

            if (response.success) {
                alert('¡Cita reservada exitosamente!');
                window.location.href = '/paciente/citas';
            }
        } catch (error: any) {
            console.error('Error al reservar cita:', error);
            alert(error.response?.data?.error || 'Error al reservar la cita');
        } finally {
            setBooking(false);
        }
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Reservar Cita</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Encuentra un médico y agenda tu cita en 3 simples pasos
                    </p>
                </div>

                {/* Progress steps */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    {[
                        { step: 1, label: 'Médico', active: !selectedDoctor },
                        { step: 2, label: 'Fecha y Hora', active: selectedDoctor && !selectedHorario },
                        { step: 3, label: 'Confirmar', active: selectedDoctor && selectedHorario },
                    ].map((item, idx) => (
                        <React.Fragment key={item.step}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-colors ${item.active
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {item.step}
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                            {idx < 2 && (
                                <div className="h-0.5 w-16 bg-gray-300"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Doctor selection */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                                Paso 1: Selecciona un médico
                            </h2>

                            {/* Filtro */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Filtrar por especialidad
                                </label>
                                <select
                                    value={especialidadFiltro}
                                    onChange={(e) => setEspecialidadFiltro(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">Todas las especialidades</option>
                                    {especialidades.map((esp) => (
                                        <option key={esp} value={esp}>
                                            {esp}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Médicos */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {medicos.map((medico) => (
                                    <DoctorCard
                                        key={medico.id}
                                        medico={medico}
                                        selected={selectedDoctor?.id === medico.id}
                                        onSelect={setSelectedDoctor}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Date, time, and confirm */}
                    <div className="space-y-6">
                        {/* Paso 2: Fecha */}
                        {selectedDoctor && (
                            <div className="rounded-xl bg-white p-6 shadow-md">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Paso 2: Selecciona fecha y hora
                                </h3>

                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>

                                {selectedDate && (
                                    <>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Horario disponible
                                        </label>
                                        {loadingHorarios ? (
                                            <p className="text-sm text-gray-500">Cargando...</p>
                                        ) : horariosDisponibles.length === 0 ? (
                                            <p className="text-sm text-red-600">No hay horarios disponibles</p>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                {horariosDisponibles.map((horario, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedHorario(horario)}
                                                        className={`rounded-lg border-2 py-2 text-sm font-medium transition-colors ${selectedHorario === horario
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 text-gray-700 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        {horario.inicio}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Paso 3: Motivo y confirmar */}
                        {selectedDoctor && selectedHorario && (
                            <div className="rounded-xl bg-white p-6 shadow-md">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Paso 3: Confirmar reserva
                                </h3>

                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Motivo de la consulta (opcional)
                                    </label>
                                    <textarea
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        placeholder="Describe brevemente el motivo de tu consulta..."
                                    />
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={booking}
                                    className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {booking ? 'Reservando...' : 'Confirmar reserva'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
