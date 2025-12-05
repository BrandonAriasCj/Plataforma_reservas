"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-3 relative flex items-center gap-4">
                                <span className="text-gray-700 text-sm">
                                    Hola, {user?.name} {user?.apellido}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
