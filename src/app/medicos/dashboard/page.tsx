"use client";

import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function DoctorDashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout title="Panel de Médico">
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Bienvenido, Dr. {user?.apellido}
                </h2>
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <p className="text-blue-700">
                        <span className="font-bold">Especialidad:</span> {user?.especialidad || 'No definida'}
                    </p>
                </div>
                <p className="text-gray-500 max-w-lg">
                    Gestione su agenda, pacientes y consultas desde este panel.
                </p>
                {/* Future content: Calendar or appointment requests */}
                <div className="mt-8">
                    <p className="text-sm text-gray-400">Próximamente: Calendario de Citas</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
