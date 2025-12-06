"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import DisponibilidadForm from '@/components/medicos/DisponibilidadForm';
import GestionCitas from '@/components/medicos/GestionCitas';
import { getMedicoById } from '@/services/medicoService';

interface Medico {
  id: number;
  usuario_id: number;
  especialidad: string;
  descripcion?: string;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  disponibilidades: any[];
  citas: any[];
}

export default function DoctorDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const [medico, setMedico] = useState<Medico | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'resumen' | 'disponibilidad' | 'citas'>('resumen');
    const [refreshKey, setRefreshKey] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !authLoading) {
            cargarMedico();
        }
    }, [user?.medico_id, mounted, authLoading]);

    const cargarMedico = async () => {
        if (!user?.medico_id) {
            setError('No se encontró medico_id');
            setLoading(false);
            return;
        }
        try {
            console.log('Cargando médico con ID:', user.medico_id);
            const data = await getMedicoById(user.medico_id);
            console.log('Datos del médico:', data);
            setMedico(data);
            setError(null);
        } catch (err: any) {
            console.error('Error al cargar médico:', err);
            setError(`Error: ${err.message || 'No se pudo cargar el médico'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDisponibilidadChanged = () => {
        setRefreshKey(prev => prev + 1);
        cargarMedico();
    };

    if (!mounted) {
        return null;
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    if (loading) {
        return (
            <DashboardLayout title="Panel de Médico">
                <div className="flex items-center justify-center h-full">
                    <p>Cargando datos del médico...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title="Panel de Médico">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 font-semibold mb-4">{error}</p>
                        <p className="text-gray-600 mb-4">User ID: {user?.userId}</p>
                        <p className="text-gray-600">Medico ID: {user?.medico_id}</p>
                        <button 
                            onClick={() => cargarMedico()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!medico) {
        return (
            <DashboardLayout title="Panel de Médico">
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-600">No se encontró información del médico</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Panel de Médico">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-2">
                        Dr. {user?.apellido}
                    </h1>
                    <p className="text-blue-100 mb-4">{medico?.especialidad || 'Especialidad no definida'}</p>
                    {medico?.descripcion && <p className="text-blue-100">{medico.descripcion}</p>}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-blue-600">{medico?.citas?.length || 0}</div>
                        <div className="text-gray-600">Citas Totales</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-yellow-600">
                            {medico?.citas?.filter((c: any) => c.estado === 'pendiente').length || 0}
                        </div>
                        <div className="text-gray-600">Citas Pendientes</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-red-600">
                            {medico?.disponibilidades?.length || 0}
                        </div>
                        <div className="text-gray-600">Días No Disponibles</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('resumen')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${
                                activeTab === 'resumen'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('disponibilidad')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${
                                activeTab === 'disponibilidad'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Disponibilidad
                        </button>
                        <button
                            onClick={() => setActiveTab('citas')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${
                                activeTab === 'citas'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Citas
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'resumen' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold mb-4">Información Profesional</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Email</label>
                                        <p className="text-lg">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                                        <p className="text-lg">{user?.telefono}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Especialidad</label>
                                        <p className="text-lg">{medico?.especialidad}</p>
                                    </div>
                                    {medico?.descripcion && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Descripción</label>
                                            <p className="text-lg">{medico.descripcion}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                                <h3 className="font-semibold text-blue-900 mb-2">📋 Próximos Pasos</h3>
                                <ul className="list-disc list-inside text-blue-800 space-y-1">
                                    <li>Marca tu disponibilidad en el calendario</li>
                                    <li>Revisa y confirma las citas de tus pacientes</li>
                                    <li>Actualiza tu información profesional</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'disponibilidad' && user?.medico_id && (
                        <DisponibilidadForm 
                            medicoId={user.medico_id} 
                            onActualizado={handleDisponibilidadChanged}
                        />
                    )}

                    {activeTab === 'citas' && user?.medico_id && (
                        <GestionCitas medicoId={user.medico_id} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
