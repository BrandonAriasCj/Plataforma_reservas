'use client';

import { useState, useEffect } from 'react';
import { useDisponibilidades, useEliminarNoDisponible } from '@/hooks/useDisponibilidades';

interface ListaDisponibilidadesProps {
    medicoId: number;
    refreshKey?: number;
    onActualizado?: () => void;
}

export default function ListaDisponibilidades({ medicoId, refreshKey, onActualizado }: ListaDisponibilidadesProps) {
    const { disponibilidades, cargando, error } = useDisponibilidades(medicoId, refreshKey);
    const { eliminarDia, cargando: eliminando, error: errorEliminar } = useEliminarNoDisponible();
    const [eliminandoId, setEliminandoId] = useState<number | null>(null);

    const handleEliminar = async (id: number, fecha: string) => {
        if (!confirm(`\u00bfDeseas volver a marcar el ${formatearFecha(fecha)} como DISPONIBLE?`)) {
            return;
        }

        setEliminandoId(id);
        try {
            await eliminarDia(id);
            onActualizado?.();
        } catch (err) {
            console.error('Error al eliminar:', err);
        } finally {
            setEliminandoId(null);
        }
    };

    const formatearFecha = (fecha: string) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(new Date(fecha));
    };

    const getDiaSemana = (fecha: string) => {
        const dias = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];
        return dias[new Date(fecha).getDay()];
    };

    if (cargando) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">D\u00edas No Disponibles</h2>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">D\u00edas No Disponibles</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
                    {error}
                </div>
            )}

            {errorEliminar && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
                    {errorEliminar}
                </div>
            )}

            {disponibilidades.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Todos los d\u00edas est\u00e1n disponibles</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        No has marcado ning\u00fan d\u00eda como no disponible
                    </p>
                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-4">
                        Tienes <strong>{disponibilidades.length}</strong> d\u00eda{disponibilidades.length !== 1 ? 's' : ''} marcado{disponibilidades.length !== 1 ? 's' : ''} como no disponible{disponibilidades.length !== 1 ? 's' : ''}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {disponibilidades.map((disp) => (
                            <div
                                key={disp.id}
                                className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="inline-block w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold">
                                                {getDiaSemana(disp.fecha)}
                                            </span>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {new Date(disp.fecha).getDate()}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(new Date(disp.fecha))}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 capitalize mt-2">
                                            {formatearFecha(disp.fecha)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleEliminar(disp.id, disp.fecha)}
                                        disabled={eliminandoId === disp.id}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                        title="Marcar como disponible"
                                    >
                                        {eliminandoId === disp.id ? (
                                            <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
