
# 🤖 AI_WORKFLOW.md

Documento vivo que define cómo el **Equipo 3 – Gatos y Perros** integra inteligencia artificial en su flujo de trabajo para el desarrollo del MVP de sistema de pedidos - **Frontend React**.

> **Propósito**: Usar IA como **asistente técnico**, no como reemplazo del pensamiento crítico del equipo.

---

## 🚀 Inicio Rápido del Proyecto (Frontend)

### Para Nuevos Desarrolladores

Si es tu primera vez clonando el repositorio del frontend:

1. **Requisitos previos**:
   - Windows con PowerShell 5.1+
   - Node.js 16+ y npm
   - Git instalado
   - **Backend corriendo** (ver setup del backend primero)

2. **Clonar repositorio**:
   ```powershell
   git clone <url-del-repositorio-frontend>
   cd distribuidora-animales-front
   ```

3. **Instalación rápida**:
   ```powershell
   # Instalar dependencias
   npm install
   
   # Configurar variables de entorno (script interactivo)
   .\setup-env.ps1
   
   # Iniciar aplicación
   npm start
   ```

4. **Verificar instalación**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs (debe estar corriendo)

**Tiempo estimado**: 2-3 minutos

### Setup Completo (Backend + Frontend)

Si es tu primera vez con todo el proyecto:

```powershell
# 1. Setup Backend (obligatorio primero)
cd distribuidora-animales-back
.\fix-migrations.ps1
.\setup.ps1

# 2. Setup Frontend (después de que backend esté corriendo)
cd ..\distribuidora-animales-front
npm install
.\setup-env.ps1
npm start
```

**Tiempo total**: 8-12 minutos

---

## 🧩 Metodología

- Trabajamos con **Kanban** en GitHub Projects.
- Reuniones diarias a las 8:00 am
- Tareas pequeñas (<1 día) para facilitar integración continua.
- Todo el código pasa por **pull request con al menos una revisión**.

---

## 💬 Interacciones clave

| Canal          | Uso |
|----------------|-----|
| **Chat Google**    | Comunicación diaria, resolución rápida de dudas |
| **GitHub**     | Discusión técnica, pull requests, issues |
| **Reuniones**  | Toma de decisiones arquitectónicas, priorización |

---

## 📚 Documentos clave

| Documento             | Propósito |
|-----------------------|---------|
| `README.md`           | Guía completa de instalación y uso del frontend |
| `ARCHITECTURE.md`     | Arquitectura del frontend (componentes, estado, rutas) |
| `AI_WORKFLOW.md`      | Este documento: normas para uso de IA y setup inicial |
| `package.json`        | Dependencias y scripts npm |
| `setup-env.ps1`       | **Script de configuración de variables de entorno** |
| `check-env.js`        | **Script de validación de configuración** |
| `/HU/`                | Historias de usuario implementadas en el frontend |
| `/Pronts/`            | Guías, documentación y mejoras implementadas |
| `/src/components/`    | Componentes reutilizables React |
| `/src/pages/`         | Páginas de la aplicación |
| `/src/services/`      | Servicios de API (axios) |

---

## 🔧 Scripts de Automatización

### `setup-env.ps1`
**Cuándo ejecutar**: Después de clonar el repositorio o al resetear configuración

**Qué hace**:
- Verifica si existe `.env`
- Crea `.env` desde `.env.example` automáticamente
- Solicita URL del backend (con default: http://localhost:8000/api)
- Configura entorno (development/production)
- Valida la configuración creada

**Uso**:
```powershell
.\setup-env.ps1
```

### `check-env.js`
**Cuándo ejecutar**: Para verificar configuración antes de iniciar

**Qué hace**:
- Valida que `.env` exista
- Verifica variables requeridas (REACT_APP_API_URL)
- Muestra configuración actual

**Uso**:
```bash
node check-env.js
```

### Scripts npm

```bash
# Desarrollo
npm start              # Inicia dev server (ejecuta prestart automáticamente)
npm run build          # Build para producción
npm test               # Tests interactivos
npm test -- --coverage # Tests con coverage

# Utilidades
npm run eject          # ⚠️ Irreversible - expone configuración de Webpack
```

---

## ⚛️ Workflow con React

### Flujo de Trabajo Diario

```powershell
# 1. Asegurarse de que backend esté corriendo
cd ..\distribuidora-animales-back
docker-compose ps

# 2. Iniciar frontend
cd ..\distribuidora-animales-front
npm start

# 3. Trabajar en componentes/páginas...

# 4. Ver cambios en tiempo real (hot reload automático)
# El navegador se recarga automáticamente al guardar archivos

# 5. Ejecutar tests
npm test
```

### Comandos Frecuentes

```bash
# Instalar nueva dependencia
npm install <paquete>

# Instalar dependencia de desarrollo
npm install --save-dev <paquete>

# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias desde cero
rm -rf node_modules package-lock.json
npm install
```

### Estructura de Componentes React

```javascript
// Componente funcional con hooks (preferido)
import React, { useState, useEffect } from 'react';

const MiComponente = ({ prop1, prop2 }) => {
  const [estado, setEstado] = useState(valorInicial);
  
  useEffect(() => {
    // Efecto secundario
  }, [dependencias]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MiComponente;
```

### Gestión de Estado con Redux

```javascript
// En src/redux/actions/miAction.js
export const miAccion = (payload) => ({
  type: 'MI_ACCION',
  payload
});

// En src/redux/reducers/miReducer.js
const initialState = { /* estado inicial */ };

export default function miReducer(state = initialState, action) {
  switch (action.type) {
    case 'MI_ACCION':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Uso en componente
import { useDispatch, useSelector } from 'react-redux';

const MiComponente = () => {
  const dispatch = useDispatch();
  const miEstado = useSelector(state => state.miReducer);
  
  const handleClick = () => {
    dispatch(miAccion({ dato: 'valor' }));
  };
};
```

---

## 🤖 Dinámicas de interacción con IA

### ✅ Uso permitido
- Generar **esqueletos de código**: componentes React, Dockerfiles, workers en Python.
- Explicar conceptos técnicos: patrón Saga, colas de mensajes, accesibilidad WCAG.
- Redactar o mejorar **documentación técnica** (README, guías).
- Simular conversaciones de equipo para alinear ideas.

### 🚫 Uso prohibido
- Entregar código generado 100% por IA sin comprensión del equipo.
- Usar IA para resolver exámenes, tareas individuales o entregas académicas sin autoría clara.

### 🔁 Validación obligatoria
1. Todo output de IA se **revisa en pareja** antes de commitear.
2. El código generado debe:
   - Pasar pruebas locales.
   - Seguir las convenciones del equipo.
   - Ser entendido por al menos dos miembros.
3. Si la IA sugiere una solución arquitectónica, se **discute en reunión** antes de implementar.

### 📁 Gestión de prompts
- Los prompts útiles se guardan en `/Pronts/` con nombre descriptivo:  
  - `INSTALACION_RAPIDA.md` - Guía rápida de instalación
  - `CARRUSEL_MODERNO_IMPLEMENTADO.md` - Implementación del carrusel
  - `FILTROS_CATEGORIAS_IMPLEMENTADO.md` - Sistema de filtros
  - `TARJETAS_PRODUCTOS_MEJORADAS.md` - Mejoras en UI de productos
  - `GUIA_PRUEBAS.md` - Guía de testing

### 🌍 Ética y responsabilidad
- La IA es una **herramienta de productividad**, no un actor autónomo.
- El equipo asume **responsabilidad total** sobre el código y decisiones técnicas.
- Priorizamos **transparencia**: si algo se generó con IA, se menciona en el PR o commit (ej: `feat: filtros de categorías (asistido por IA)`).

---

## 📋 Checklist para Nuevos Miembros del Equipo (Frontend)

### Día 1: Setup Inicial
- [ ] Instalar Node.js 16+ y npm
- [ ] Clonar repositorio frontend
- [ ] **Verificar que backend esté corriendo** (prerequisito)
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `setup-env.ps1` para configurar .env
- [ ] Ejecutar `npm start` y verificar http://localhost:3000
- [ ] Probar login con usuario administrador del backend
- [ ] Explorar Swagger del backend http://localhost:8000/docs

### Día 2-3: Familiarización
- [ ] Leer `README.md` completo
- [ ] Revisar `ARCHITECTURE.md` para entender estructura
- [ ] Explorar componentes en `/src/components/`
- [ ] Revisar páginas en `/src/pages/`
- [ ] Entender servicios de API en `/src/services/`
- [ ] Revisar Redux store en `/src/redux/`
- [ ] Ejecutar tests: `npm test`
- [ ] Leer historias de usuario en `/HU/`

### Semana 1: Contribución
- [ ] Tomar primera tarea del backlog (componente pequeño)
- [ ] Seguir convenciones de código React del equipo
- [ ] Crear componente reutilizable en `/src/components/ui/`
- [ ] Escribir tests para el componente
- [ ] Crear PR con descripción clara
- [ ] Responder a comentarios de code review
- [ ] Asistir a daily standup

---

## 🆘 Soporte y Resolución de Problemas

### Problemas Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| "Cannot connect to API" | Verificar que backend esté corriendo (`docker-compose ps`), validar `.env` con `node check-env.js` |
| Puerto 3000 en uso | Detener proceso con `Get-NetTCPConnection -LocalPort 3000` o usar otro puerto: `$env:PORT=3001; npm start` |
| Módulos no encontrados | Reinstalar: `rm -rf node_modules; npm install` |
| Cambios no se reflejan | Limpiar cache: Ctrl+F5 en navegador o `rm -rf build; npm start` |
| CORS errors | Verificar configuración CORS en backend `main.py` |
| Tests fallan | Verificar que backend esté corriendo y `.env` configurado |

### Canales de Ayuda

1. **Primera opción**: Revisar documentación en `/Pronts/`
2. **Segunda opción**: Buscar en `/HU/` la historia de usuario relacionada
3. **Tercera opción**: Preguntar en el chat del equipo
4. **Cuarta opción**: Crear issue en GitHub con etiqueta `frontend` y `help-wanted`
5. **Última opción**: Pedir revisión en reunión diaria

---

## 🎨 Convenciones de Código Frontend

### Estructura de Archivos
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, Card)
│   └── layout/         # Layouts (Header, Footer, Sidebar)
├── pages/              # Páginas completas (Home, Login, Admin)
├── services/           # Llamadas a API (axios)
├── redux/              # Estado global
├── hooks/              # Custom hooks
├── utils/              # Funciones auxiliares
└── styles/             # Estilos globales
```

### Nomenclatura
- **Componentes**: PascalCase (`ProductCard.js`)
- **Servicios**: camelCase (`authService.js`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.js`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Imports Ordenados
```javascript
// 1. Librerías externas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Componentes
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';

// 3. Servicios y hooks
import { authService } from '../services/authService';
import useAuth from '../hooks/useAuth';

// 4. Estilos
import './MyComponent.css';
```

---

> 🐾 *"La IA no piensa, pero nos ayuda a pensar mejor."*  
> — Equipo 3, Gatos y Perros

---

## 📚 Referencias Técnicas (Frontend)

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router v6](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Jest Testing](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

**Última actualización**: Diciembre 2025