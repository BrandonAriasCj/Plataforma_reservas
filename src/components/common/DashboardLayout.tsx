"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const homeLink = user?.roleId === 2 ? '/medicos/dashboard' : '/paciente/dashboard';
    const isPaciente = user?.roleId === 1;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href={homeLink} className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
                                <h1 className="text-xl font-bold text-indigo-600">{title}</h1>
                            </Link>

                            <div className="hidden md:flex space-x-4">
                                <Link
                                    href={homeLink}
                                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Inicio
                                </Link>

                                {isPaciente && (
                                    <>
                                        <Link
                                            href="/paciente/citas"
                                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Mis Citas
                                        </Link>
                                        <Link
                                            href="/paciente/reservar"
                                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Reservar Cita
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-3 relative flex items-center gap-4">
                                <span className="text-gray-700 text-sm hidden sm:block">
                                    Hola, {user?.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 bg-white">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
