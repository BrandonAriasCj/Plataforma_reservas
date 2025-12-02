npm install

npm run dev
http://localhost:3000**

---

## 📋 Endpoints Implementados

### 👨‍⚕️ Médicos

| Método | Endpoint | Estado |
|--------|----------|--------|
| `GET` | `/medicos` | ✅ |
| `GET` | `/medicos/:id` | ✅ |
| `PUT` | `/medicos/:id` | ✅ |

### Disponibilidad

| Método | Endpoint | Estado |
|--------|----------|--------|
| `POST` | `/medicos/:id/disponibilidad` | ✅ |
| `POST` | `/medicos/:id/disponibilidad-rango` | ✅ |
| `GET` | `/medicos/:id/disponibilidades` | ✅ |
| `GET` | `/medicos/:id/calendario` | ✅ |
| `DELETE` | `/disponibilidad/:disponibilidadId` | ✅ |
| `DELETE` | `/medicos/:id/disponibilidad-rango` | ✅ |

### Citas por corregir

| Método | Endpoint | Estado |
|--------|----------|--------|
| `GET` | `/medicos/:id/citas` | ✅ |
| `PUT` | `/medicos/cita/:citaId` | ✅ |

---

## Vistas Implementadas

### Médicos

- **`/medicos`** - Lista de todos los médicos
  - Componente: `ListaMedicos.tsx`
  - Funcionalidad: Ver lista de médicos, editar y ver detalles

- **`/medicos/[id]`** - Detalles del médico
  - Componente: `DetallesMedico.tsx`
  - Funcionalidad: Ver información completa del médico

- **`/medicos/[id]/editar`** - Editar médico
  - Componente: `FormularioMedico.tsx`
  - Funcionalidad: Modificar datos del médico

### Disponibilidad

- **`/medicos/[id]/disponibilidad`** - Marcar días no disponibles
  - Componente: `MarcarDisponibilidad.tsx`
  - Funcionalidad: Marcar un día o rango de días

- **`/medicos/[id]/disponibilidad`** - Ver disponibilidades
  - Componente: `CalendarioMedico.tsx`
  - Funcionalidad: Calendario visual de disponibilidad

### Citas aun esta mal por que las citas se encarga vania

- **`/medicos/[id]/citas`** - Citas del médico
  - Componente: `CitasMedico.tsx`
  - Funcionalidad: Listar y gestionar citas

---

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página de inicio
│   ├── globals.css          # Estilos globales
│   └── medicos/
│       ├── page.tsx         # Lista de médicos
│       ├── [id]/            # Detalles médico
│       │   ├── page.tsx
│       │   ├── citas/       # Citas del médico
│       │   ├── disponibilidad/   # Marcar disponibilidad
│       │   └── editar/      # Editar médico
│
├── components/
│   └── medicos/
│       ├── ListaMedicos.tsx         # Tabla de médicos
│       ├── DetallesMedico.tsx       # Detalles del médico
│       ├── FormularioMedico.tsx     # Editar médico
│       ├── CalendarioMedico.tsx     # Calendario de disponibilidad
│       ├── MarcarDisponibilidad.tsx # Marcar no disponibles
│       └── CitasMedico.tsx          # Citas del médico
│
├── hooks/
│   ├── useMedicos.ts        # Hooks para médicos
│   ├── useDisponibilidades.ts # Hooks para disponibilidad
│   └── useCitas.ts          # Hooks para citas
│
└── services/
    └── medicoService.ts     # Cliente API (Axios)
```

---

## 🔧 Configuración del Backend

El frontend espera el backend en:
```
http://localhost:3000/api
```

Para cambiar la URL, edita `src/services/medicoService.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

O configura la variable de entorno:
```bash
NEXT_PUBLIC_API_URL=http://tu-backend:puerto/api
```

---

## 📝 Notas

- ✅ Frontend completamente funcional
- 🔗 Integrado con API Backend (Node.js + PostgreSQL)
- 📱 Responsive con Tailwind CSS
- 🎯 Tipado completo con TypeScript
- 🔄 Manejo de estados con React Hooks
- 🔐 Registro de médicos manejado por módulo de autenticación (brandon)


