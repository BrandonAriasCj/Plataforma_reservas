'use client';

import { CalendarioResponse } from '@/hooks/useDisponibilidades';

interface CalendarioMedicoProps {
  calendario: CalendarioResponse;
  medicoId: number;
  onActualizar?: () => void;
}

export default function CalendarioMedico({
  calendario,
  medicoId,
  onActualizar,
}: CalendarioMedicoProps) {
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];

  // Obtener primer día del mes
  const primerDia = new Date(calendario.ano, calendario.mes - 1, 1).getDay();

  // Crear array de días (con celdas vacías al inicio)
  const diasArray = [];
  for (let i = 0; i < primerDia; i++) {
    diasArray.push(null);
  }
  for (let i = 1; i <= calendario.dias_total; i++) {
    diasArray.push(i);
  }

  return (
    <div className="grid grid-cols-7 gap-2 mb-6">
      {/* Encabezado de días */}
      {diasSemana.map((dia) => (
        <div
          key={dia}
          className="text-center font-bold text-gray-700 p-2 bg-gray-100 rounded"
        >
          {dia}
        </div>
      ))}

      {/* Días del calendario */}
      {diasArray.map((dia, index) => {
        if (dia === null) {
          return (
            <div
              key={`empty-${index}`}
              className="aspect-square bg-gray-50 rounded"
            ></div>
          );
        }

        const diaInfo = calendario.calendario[dia.toString()];
        const isDisponible = diaInfo?.disponible;

        return (
          <div
            key={dia}
            className={`aspect-square p-2 rounded border-2 text-center cursor-pointer transition hover:shadow-md ${
              isDisponible
                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
            title={isDisponible ? 'Disponible' : 'No disponible'}
          >
            <div className="font-bold text-sm text-gray-800">{dia}</div>
          </div>
        );
      })}
    </div>
  );
}
