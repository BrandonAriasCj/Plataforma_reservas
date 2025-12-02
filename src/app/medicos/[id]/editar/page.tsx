'use client';

import { useParams } from 'next/navigation';
import FormularioMedico from '@/components/medicos/FormularioMedico';

export default function EditarMedicoPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  return <FormularioMedico medicoId={id} />;
}
