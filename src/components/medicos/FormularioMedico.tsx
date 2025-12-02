'use client';

import { useState } from 'react';
import { useRegistrarMedico, useActualizarMedico, useMedicoById } from '@/hooks/useMedicos';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormularioMedicoProps {
  medicoId?: number;
}

export default function FormularioMedico({ medicoId }: FormularioMedicoProps) {
  const router = useRouter();
  const { medico: medicoExistente, cargando: cargandoMedico } = useMedicoById(
    medicoId || null
  );
  const { registrar, cargando: cargandoRegistro, error: errorRegistro } =
    useRegistrarMedico();
  const { actualizar, cargando: cargandoActualizacion, error: errorActualizacion } =
    useActualizarMedico();

  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const [exito, setExito] = useState(false);

  // Prellenar si es edición
  const cargando = cargandoMedico;

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (medicoId && !medicoExistente) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Médico no encontrado
      </div>
    );
  }

  // Prellenar datos
  if (medicoExistente && nombre === '') {
    setNombre(medicoExistente.nombre);
    setEspecialidad(medicoExistente.especialidad);
    setEmail(medicoExistente.email);
    setTelefono(medicoExistente.telefono);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    setExito(false);

    // Validaciones
    if (!nombre || !especialidad || !email || !telefono) {
      setErrorLocal('Todos los campos son requeridos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorLocal('Email inválido');
      return;
    }

    try {
      if (medicoId) {
        await actualizar(medicoId, {
          nombre,
          especialidad,
          email,
          telefono,
        });
        setExito(true);
        setTimeout(() => router.push(`/medicos/${medicoId}`), 1500);
      } else {
        const result = await registrar({
          nombre,
          especialidad,
          email,
          telefono,
        });
        setExito(true);
        setNombre('');
        setEspecialidad('');
        setEmail('');
        setTelefono('');
        setTimeout(() => router.push(`/medicos/${result.data.id}`), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const especialidadesComunes = [
    'Cardiología',
    'Pediatría',
    'Dermatología',
    'Neurología',
    'Oftalmología',
    'Odontología',
    'Psicología',
    'Cirugía General',
    'Traumatología',
    'Medicina Interna',
  ];

  const error = errorRegistro || errorActualizacion || errorLocal;
  const esEdicion = !!medicoId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={medicoId ? `/medicos/${medicoId}` : '/medicos'}
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Volver
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {esEdicion ? 'Editar Médico' : 'Registrar Nuevo Médico'}
        </h1>

        {exito && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✓ {esEdicion ? 'Médico actualizado' : 'Médico registrado'} exitosamente
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-gray-700 font-bold mb-2">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Dr. Juan Pérez"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Especialidad */}
          <div>
            <label htmlFor="especialidad" className="block text-gray-700 font-bold mb-2">
              Especialidad *
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {especialidadesComunes.map((esp) => (
                <button
                  key={esp}
                  type="button"
                  onClick={() => setEspecialidad(esp)}
                  className={`px-3 py-1 rounded text-sm transition ${
                    especialidad === esp
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {esp}
                </button>
              ))}
            </div>
            <input
              id="especialidad"
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              placeholder="Ej: Cardiología"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: juan@hospital.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-gray-700 font-bold mb-2">
              Teléfono *
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={cargandoRegistro || cargandoActualizacion || exito}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
            >
              {cargandoRegistro || cargandoActualizacion
                ? 'Guardando...'
                : esEdicion
                  ? 'Actualizar'
                  : 'Registrar'}
            </button>
            <Link
              href={medicoId ? `/medicos/${medicoId}` : '/medicos'}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
