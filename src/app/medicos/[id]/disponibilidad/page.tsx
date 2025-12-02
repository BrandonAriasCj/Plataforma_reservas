'use client';

import { useParams } from 'next/navigation';
import MarcarDisponibilidad from '@/components/medicos/MarcarDisponibilidad';

export default function MarcarDisponibilidadPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  return <MarcarDisponibilidad medicoId={id} />;
}
