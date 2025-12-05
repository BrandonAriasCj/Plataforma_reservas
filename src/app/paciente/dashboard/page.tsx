"use client";

import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout title="Panel de Paciente">
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Bienvenido a tu panel personal
                </h2>
                <p className="text-gray-500 max-w-lg">
                    Aquí podrás gestionar tus citas médicas, ver tu historial y actualizar tu perfil.
                </p>
                {/* Future content: List of upcoming appointments */}
                <div className="mt-8">
                    <p className="text-sm text-gray-400">Próximamente: Lista de citas</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
