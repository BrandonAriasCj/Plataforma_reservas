"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.roleId === 2) {
        router.push('/medicos/dashboard');
      } else {
        router.push('/paciente/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Bienvenido a la Plataforma de Reservas Médicas
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Gestiona tus citas médicas de manera fácil y rápida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Registrarse como Paciente
          </Link>
          <Link
            href="/auth/register-medico"
            className="px-8 py-3 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Soy Médico
          </Link>
        </div>
      </div>
    </div>
  );
}
