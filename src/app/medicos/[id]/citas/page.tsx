'use client';

import { useParams } from 'next/navigation';
import CitasMedico from '@/components/medicos/CitasMedico';

export default function CitasMedicoPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  return <CitasMedico medicoId={id} />;
}
