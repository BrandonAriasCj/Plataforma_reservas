'use client';

import { useParams } from 'next/navigation';
import DetallesMedico from '@/components/medicos/DetallesMedico';

export default function MedicoDetallesPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  return <DetallesMedico medicoId={id} />;
}
