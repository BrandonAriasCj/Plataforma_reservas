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
    const [loading, setLoading] = useState(true);
    const [medicoFiltro, setMedicoFiltro] = useState('');
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Medico | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDisponible[]>([]);
    const [selectedHorario, setSelectedHorario] = useState<HorarioDisponible | null>(null);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        loadMedicos();
    }, []);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            loadHorarios();
        } else {
            setHorariosDisponibles([]);
        }
    }, [selectedDate]);

    const loadMedicos = async () => {
        try {
            setLoading(true);
            const response = await DoctorService.getAll();
            if (response.success && response.data) {
                setMedicos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar médicos:', error);
        } finally {
            setLoading(false);
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
                }
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        } finally {
            setLoadingHorarios(false);
        }
    };

    const handleSelectDoctor = (medico: Medico) => {
        setSelectedDoctor(medico);
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSelectTime = (horario: HorarioDisponible) => {
        setSelectedHorario(horario);
        setStep(3);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            if (step === 2) {
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedHorario(null);
            }
            if (step === 3) {
                setSelectedHorario(null);
            }
        }
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !selectedDate || !selectedHorario) {
            alert('Faltan datos para reservar');
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
            alert(error.response?.data?.error || 'Error al reservar la cita. Intenta nuevamente.');
        } finally {
            setBooking(false);
        }
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Header con botón de volver */}
                <div className="mb-8 text-center relative">
                    <div className="absolute left-0 top-0">
                        <a href="/paciente/dashboard" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1 transition-colors bg-white px-3 py-1 rounded-full shadow-sm border">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </a>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 md:mt-0">Nueva Reserva</h1>

                    <div className="flex items-center justify-between relative mt-8">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                        {[
                            { id: 1, label: 'Elegir Médico' },
                            { id: 2, label: 'Fecha y Hora' },
                            { id: 3, label: 'Confirmar' }
                        ].map((s) => (
                            <div key={s.id} className="flex flex-col items-center bg-gray-50 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${step >= s.id ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    {s.id}
                                </div>
                                <span className={`text-sm mt-2 font-medium ${step >= s.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[400px]">

                    {/* STEP 1: SELECT DOCTOR */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right duration-300">
                            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-800">Seleccione un especialista</h2>
                                <select
                                    value={medicoFiltro}
                                    onChange={(e) => setMedicoFiltro(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Todos los médicos</option>
                                    {medicos.map((medico) => (
                                        <option key={medico.id} value={medico.id}>
                                            Dr(a). {medico.nombre} {medico.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {medicos
                                        .filter(medico => !medicoFiltro || medico.id.toString() === medicoFiltro)
                                        .map((medico) => (
                                            <div
                                                key={medico.id}
                                                onClick={() => handleSelectDoctor(medico)}
                                                className="cursor-pointer transition-all hover:scale-[1.02]"
                                            >
                                                <DoctorCard
                                                    medico={medico}
                                                    selected={false}
                                                    onSelect={() => { }}
                                                />
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: SELECT DATE & TIME */}
                    {step === 2 && selectedDoctor && (
                        <div className="animate-in fade-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    ← Volver
                                </button>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Agenda con Dr(a). {selectedDoctor.nombre} {selectedDoctor.apellido}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona la fecha</label>
                                    <input
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedHorario(null);
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Selecciona una fecha para ver los horarios disponibles.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-medium text-gray-900 mb-4">Horarios disponibles</h3>

                                    {!selectedDate ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Primero selecciona una fecha
                                        </div>
                                    ) : loadingHorarios ? (
                                        <div className="flex justify-center py-8">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                        </div>
                                    ) : horariosDisponibles.length === 0 ? (
                                        <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                                            No hay citas disponibles para esta fecha.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {horariosDisponibles.map((horario, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedHorario(horario);
                                                    }}
                                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${selectedHorario === horario
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {horario.inicio}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => selectedHorario && setStep(3)}
                                    disabled={!selectedHorario}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONFIRM */}
                    {step === 3 && selectedDoctor && selectedHorario && (
                        <div className="animate-in fade-in slide-in-from-right duration-300 max-w-lg mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    ← Volver
                                </button>
                                <h2 className="text-xl font-semibold text-gray-800">Confirmar Reserva</h2>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="bg-white p-2 rounded-lg text-2xl">👨‍⚕️</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Especialista</p>
                                        <p className="font-semibold text-gray-900">Dr(a). {selectedDoctor.nombre} {selectedDoctor.apellido}</p>
                                        <p className="text-sm text-blue-600">{selectedDoctor.especialidad}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-lg text-2xl">📅</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha y Hora</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedDate} a las {selectedHorario.inicio}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo de la consulta (Opcional)
                                </label>
                                <textarea
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Breve descripción de tus síntomas..."
                                ></textarea>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={booking}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-wait"
                            >
                                {booking ? 'Confirmando...' : '✅ Confirmar Cita'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
