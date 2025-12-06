"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import DisponibilidadForm from '@/components/medicos/DisponibilidadForm';
import ListaDisponibilidades from '@/components/medicos/ListaDisponibilidades';
import GestionCitas from '@/components/medicos/GestionCitas';
import { getMedicoById, actualizarMedico } from '@/services/medicoService';
import { useDisponibilidades } from '@/hooks/useDisponibilidades';

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

    // Estado para edición de perfil
    const [isEditing, setIsEditing] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [formData, setFormData] = useState({
        telefono: '',
        especialidad: '',
        descripcion: ''
    });

    // Hook para obtener disponibilidades reales
    const { disponibilidades } = useDisponibilidades(user?.medico_id || null, refreshKey);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !authLoading) {
            cargarMedico();
        }
    }, [user?.medico_id, mounted, authLoading]);

    useEffect(() => {
        if (medico && user) {
            setFormData({
                telefono: user.telefono || '',
                especialidad: medico.especialidad || '',
                descripcion: medico.descripcion || ''
            });
        }
    }, [medico, user]);

    const cargarMedico = async () => {
        if (!user?.medico_id) {
            setError('No se encontró medico_id');
            setLoading(false);
            return;
        }
        try {
            const response = await getMedicoById(user.medico_id);
            // Ajuste para extraer los datos reales si vienen envueltos en "data"
            const medicoData = response.data || response;

            setMedico(medicoData);
            setError(null);
        } catch (err: any) {
            console.error('Error cargando médico:', err);
            setError(`Error: ${err.message || 'No se pudo cargar el médico'}`);
        } finally {
            setLoading(false);
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleDisponibilidadChanged = () => {
        cargarMedico();
    };

    const handleSaveProfile = async () => {
        if (!user?.medico_id) return;
        try {
            setSavingProfile(true);
            await actualizarMedico(user.medico_id, formData);
            await cargarMedico(); // Recargar datos
            setIsEditing(false);
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar perfil');
        } finally {
            setSavingProfile(false);
        }
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
                            {disponibilidades.length}
                        </div>
                        <div className="text-gray-600">Días No Disponibles</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('resumen')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === 'resumen'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('disponibilidad')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === 'disponibilidad'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Disponibilidad
                        </button>
                        <button
                            onClick={() => setActiveTab('citas')}
                            className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === 'citas'
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Información Profesional</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                                        >
                                            Editar Información
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-4 py-2"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={savingProfile}
                                                className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2 disabled:opacity-50"
                                            >
                                                {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                                            <input
                                                type="text"
                                                value={formData.telefono}
                                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad</label>
                                            <select
                                                value={formData.especialidad}
                                                onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Seleccione una especialidad</option>
                                                <option value="Medicina General">Medicina General</option>
                                                <option value="Cardiología">Cardiología</option>
                                                <option value="Pediatría">Pediatría</option>
                                                <option value="Dermatología">Dermatología</option>
                                                <option value="Ginecología">Ginecología</option>
                                                <option value="Traumatología">Traumatología</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción Profesional</label>
                                            <textarea
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={4}
                                                placeholder="Describa su experiencia y enfoque..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Email</label>
                                            <p className="text-lg">{user?.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                                            <p className="text-lg">{medico?.usuario?.telefono || user?.telefono || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Especialidad</label>
                                            <p className="text-lg">{medico?.especialidad}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Descripción</label>
                                            <p className="text-lg text-gray-700">{medico?.descripcion || 'Sin descripción'}</p>
                                        </div>
                                    </div>
                                )}
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
                        <div className="space-y-6">
                            <DisponibilidadForm
                                medicoId={user.medico_id}
                                onActualizado={handleDisponibilidadChanged}
                            />
                            <ListaDisponibilidades
                                medicoId={user.medico_id}
                                refreshKey={refreshKey}
                                onActualizado={handleDisponibilidadChanged}
                            />
                        </div>
                    )}

                    {activeTab === 'citas' && user?.medico_id && (
                        <GestionCitas
                            medicoId={user.medico_id}
                            onUpdate={handleDisponibilidadChanged}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
