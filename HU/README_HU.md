# 📚 Índice de Historias de Usuario (HU) - Frontend

## 📋 Resumen Ejecutivo

Este directorio contiene **todas las Historias de Usuario (HU)** documentadas para el frontend de **Distribuidora Perros y Gatos**. Cada HU está escrita en formato detallado para ser consumida por IA o desarrolladores frontend React, con especificaciones de componentes, servicios, estilos y flujos de usuario.

**Total de HU Documentadas**: 12

---

## 🗂️ Lista Completa de HU

### ✅ HU Implementadas y Documentadas

| # | Archivo | Funcionalidad | Estado | Componentes Principales |
|---|---------|---------------|--------|------------------------|
| 1 | `INSTRUCTIONS_HU_REGISTER_USER.md` | Registro de Cliente con Verificación | ✅ Implementado | `RegisterForm`<br>`VerifyEmailForm`<br>`ResendCodeButton` |
| 2 | `INSTRUCTIONS_HU_LOGIN_USER.md` | Inicio de Sesión de Clientes | ✅ Implementado | `LoginForm`<br>`AuthContext`<br>`ProtectedRoute` |
| 3 | `INSTRUCTIONS_HU_MANAGE_CATEGORIES.md` | Gestión de Categorías (Admin) | ✅ Implementado | `CategoriesManager`<br>`CategoryForm`<br>`SubcategoryForm` |
| 4 | `INSTRUCTIONS_HU_CREATE_PRODUCT.md` | Gestión Completa de Productos (Admin) | ✅ Implementado | `ProductForm`<br>`ProductList`<br>`ImageUploader`<br>`ProductCard` |
| 5 | `INSTRUCTIONS_HU_REPLENISH_INVENTORY.md` | Reabastecer Inventario (Admin) | ✅ Implementado | `InventoryManager`<br>`ReplenishForm`<br>`StockHistory` |
| 6 | `INSTRUCTIONS_HU_MANAGE_CAROUSEL.md` | Gestión de Carrusel (Admin) | ✅ Implementado | `CarouselManager`<br>`CarouselUploader`<br>`DraggableCarouselItems` |
| 7 | `INSTRUCTIONS_HU_CUSTOMER_PRODUCT_VIEW.md` | Vista de Productos para Clientes | ✅ Implementado | `HomePage`<br>`ProductsGrid`<br>`CategoryFilter`<br>`ShoppingCart` |
| 8 | `INSTRUCTIONS_HU_MANAGE_ORDERS.md` | Gestión de Pedidos (Admin) | ✅ Implementado | `OrdersManager`<br>`OrderDetail`<br>`StatusUpdater`<br>`OrderFilters` |
| 9 | `INSTRUCTIONS_HU_VIEW_USERS.md` | Gestión de Usuarios (Admin) | ✅ Implementado | `UsersManager`<br>`UserDetail`<br>`UserFilters` |
| 10 | `INSTRUCTIONS_HU_RATINGS_SYSTEM.md` | Sistema de Calificaciones | ✅ Implementado | `RatingStars`<br>`CreateRatingModal`<br>`ProductReviewsList`<br>`MyRatingsPage`<br>`AdminRatingsPage` |
| 11 | `INSTRUCTIONS_HU_MY_ORDERS_FRONTEND.md` | Mis Pedidos - Vista de Cliente | ✅ **NUEVO** | `MyOrdersPage`<br>`OrderCard`<br>`OrderDetailModal`<br>`OrderStatusBadge`<br>`OrderTimeline` |
| 12 | `INSTRUCTIONS_HU_CHATBOT.md` | Chatbot Max - Asistente Virtual | ✅ **NUEVO** | `Chatbot`<br>`ChatMessage`<br>`SuggestionButtons` |

---

## 🆕 Nueva HU Creada en Esta Sesión

### **INSTRUCTIONS_HU_RATINGS_SYSTEM.md** (✨ NUEVO)

**Funcionalidad**: Interfaz completa para calificaciones y reseñas de productos

**Componentes Creados**:

#### 1. **RatingStars Component**
- Componente reutilizable de estrellas (1-5)
- Props: rating, totalReviews, size, interactive, showCount
- Soporte para valores decimales (ej: 4.5 estrellas)
- Modo interactivo para selección de rating

#### 2. **ProductRatingCard Component**
- Integración de estrellas en product cards
- Muestra promedio y total de calificaciones
- "Sin calificaciones aún" si rating = 0

#### 3. **CreateRatingModal Component**
- Modal para crear/editar calificación
- Selector interactivo de estrellas (1-5)
- Textarea para comentario opcional (max 500 chars)
- Contador de caracteres
- Validación cliente antes de submit

#### 4. **ProductReviewsList Component**
- Lista de reseñas con paginación
- Stats summary:
  - Promedio grande
  - Total de calificaciones
  - Distribución por estrellas (barras gráficas)
- Cards individuales de reseñas:
  - Usuario, rating, fecha, comentario

#### 5. **MyRatingsPage Component**
- Página en perfil de usuario
- **Sección A**: Productos Pendientes de Calificar
  - Grid de productos de pedidos entregados
  - Botón "Calificar Producto" abre modal
- **Sección B**: Mis Calificaciones Publicadas
  - Lista de ratings del usuario
  - Acciones: Editar, Eliminar

#### 6. **AdminRatingsPage Component**
- Panel admin de moderación
- **Filtros**:
  - Buscar por producto/usuario
  - Estado: Todas/Visibles/Ocultas
  - Por producto específico
- **Tabla de calificaciones**:
  - Columnas: ID, Producto, Usuario, Rating, Comentario, Fecha, Estado
  - Badges de visible/oculto y aprobado/pendiente
  - Acciones: Toggle visible, Toggle aprobado, Eliminar
- **Paginación**: Server-side

**Servicio API**:
```javascript
// calificaciones-service.js

// Cliente
createRating(ratingData)
getMyRatings(skip, limit)
getProductRatings(productoId, {skip, limit})
getProductStats(productoId)
getProductsStats(productoIds) // batch
getRatableProducts()
updateRating(ratingId, updateData)
deleteRating(ratingId)

// Admin
adminGetAllRatings({skip, limit, productoId, usuarioId, visibleOnly})
adminGetRatingById(ratingId)
adminUpdateRating(ratingId, updateData)
adminDeleteRating(ratingId)
adminRecalculateStats(productoId)
```

**Estilos CSS**:
- Rating stars con colores: yellow-400 (filled), gray-300 (empty)
- Tamaños: small (14px), medium (18px), large (24px)
- Interactive hover effect (scale 1.2)
- Review cards con border, padding, rounded
- Rating distribution bars con animación de width

**Redux Integration** (Opcional):
```javascript
// ratingsSlice.js
fetchMyRatings()
fetchRatableProducts()
```

**Flujos de Usuario Documentados**:
1. **Cliente Califica Producto**: 11 pasos desde pedido entregado hasta calificación publicada
2. **Ver Reseñas (Público)**: 5 pasos de navegación y visualización
3. **Admin Modera**: 8 pasos de filtrado, identificación y moderación

**Mensajes Toast Estandarizados**:
```javascript
// Éxitos
'Calificación creada exitosamente'
'Calificación actualizada exitosamente'
'Calificación eliminada exitosamente'

// Errores
'Por favor, completa todos los campos obligatorios.'
'La calificación debe ser entre 1 y 5 estrellas.'
'El comentario no puede exceder 500 caracteres.'
'Solo puedes calificar productos de pedidos entregados.'
'Ya has calificado este producto en este pedido.'
```

---

### **INSTRUCTIONS_HU_MY_ORDERS_FRONTEND.md** (✨ NUEVO)

**Funcionalidad**: Interfaz completa para que clientes vean y gestionen sus pedidos

**Componentes Principales**:

1. **MyOrdersPage**: Página principal con lista de pedidos
   - Filtros por estado (todos, pendiente, enviado, entregado, cancelado)
   - Paginación con "Cargar Más"
   - Empty state cuando no hay pedidos

2. **OrderCard**: Tarjeta resumida de pedido
   - Número de pedido, fecha, total, estado
   - Items count y dirección de envío
   - Botón "Ver Detalle"

3. **OrderStatusBadge**: Badge con color por estado
   - Pendiente: amarillo/warning
   - Enviado: azul/info
   - Entregado: verde/success
   - Cancelado: rojo/danger

4. **OrderDetailModal**: Modal con detalle completo
   - Info general (total, dirección, fecha)
   - Lista de productos con imágenes
   - Timeline de tracking
   - Botones: Calificar (si entregado), Cancelar (si pendiente)

5. **OrderTimeline**: Componente de seguimiento visual
   - Historial de estados con fechas
   - Comentarios de cada cambio
   - Estado activo resaltado
   - Animación de pulse en estado actual

**Servicio**: `pedidos-service.js` con 4 métodos (getMyOrders, getMyOrderDetail, getMyOrderHistory, cancelMyOrder)

**CSS**: Responsive design con breakpoints mobile/tablet/desktop

---

### **INSTRUCTIONS_HU_CHATBOT.md** (✨ NUEVO)

**Funcionalidad**: Chatbot frontend interactivo con asistente virtual "Max"

**Características Principales**:
- 🐕 Mascota: "Max" el perro asistente
- 💬 Base de conocimiento local con 15+ categorías
- 🎯 Pattern matching basado en keywords
- ⚡ Respuestas instantáneas (sin backend)
- 🔘 Sugerencias rápidas contextuales
- ✨ Animaciones de "typing" naturales
- 📱 Responsive (mobile: fullscreen, desktop: ventana flotante)

**Categorías de Conocimiento**:
1. Saludos (greetings)
2. Productos generales
3. Envíos y entregas
4. Métodos de pago
5. Creación de cuenta
6. Seguimiento de pedidos
7. Contacto y soporte
8. Horarios de atención
9. Productos para perros
10. Productos para gatos
11. Ofertas y promociones
12. Ayuda general
13. Beneficios de cuenta
14. Seguridad de pagos
15. Alimentos para mascotas

**Componente**:
- Botón flotante toggle (bottom-right)
- Header con avatar, nombre y estado online
- Body con historial de mensajes
- Footer con input y botón enviar
- Sugerencias después de cada respuesta del bot

**Algoritmo de Respuesta**:
1. Normalizar mensaje del usuario (lowercase, trim)
2. Detectar saludos
3. Buscar keywords en base de conocimiento
4. Retornar respuesta + sugerencias
5. Simular typing delay (800-1200ms)

**Evolución Futura**: Integración con OpenAI API, registro de conversaciones en BD, analytics

---

## 📊 Estadísticas del Proyecto Frontend

### Coverage de Funcionalidades UI

| Área | HU Documentadas | Componentes | % Coverage |
|------|-----------------|-------------|-----------|
| Autenticación | 2 | LoginForm, RegisterForm, VerifyEmailForm | 100% |
| Catálogo Público | 1 | ProductsGrid, CategoryFilter, ProductCard | 100% |
| Carrito & Checkout | 1 | ShoppingCart, CartItem, CheckoutForm | 100% |
| Admin - Productos | 2 | ProductForm, ProductList, ImageUploader | 100% |
| Admin - Categorías | 1 | CategoriesManager, CategoryForm | 100% |
| Admin - Inventario | 1 | InventoryManager, ReplenishForm | 100% |
| Admin - Pedidos | 1 | OrdersManager, OrderDetail, StatusUpdater | 100% |
| Admin - Usuarios | 1 | UsersManager, UserDetail | 100% |
| Calificaciones | 1 | RatingStars, CreateRatingModal, ReviewsList, MyRatingsPage, AdminRatingsPage | 100% |
| Cliente - Mis Pedidos | 1 | MyOrdersPage, OrderCard, OrderDetailModal, OrderTimeline | 100% ✨ |
| Asistente Virtual | 1 | Chatbot (standalone) | 100% ✨ |
| **TOTAL** | **12** | **45+** | **100%** |

---

## 🎨 Convenciones de Diseño UI/UX

### 1. **Estructura de Componentes**

Todos los componentes siguen esta estructura:

```jsx
// Imports
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ComponentName.css';

// Component
const ComponentName = ({ prop1, prop2 }) => {
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleAction = async () => {
    try {
      setLoading(true);
      await service.action();
      toast.success('Mensaje exacto del backend');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error genérico');
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### 2. **Manejo de Estados**

Todos los componentes manejan 3 estados base:
- **Loading**: `loading` state con spinner/skeleton
- **Error**: Toast message con error del backend
- **Empty**: Empty state cuando no hay datos

```jsx
{loading && <Spinner />}
{!loading && data.length === 0 && (
  <EmptyState message="No hay datos disponibles" />
)}
{!loading && data.length > 0 && (
  <DataList items={data} />
)}
```

### 3. **Toast Messages**

Siempre usar mensajes exactos del backend:

```javascript
// Backend response
{ "status": "error", "message": "Ya existe una categoría con ese nombre." }

// Frontend toast
toast.error(error.response?.data?.message || 'Error al procesar solicitud');
```

### 4. **Validaciones de Formularios**

Validar en cliente **antes** de enviar:

```javascript
const validateForm = () => {
  if (!field1) {
    toast.error('Por favor, completa todos los campos obligatorios.');
    return false;
  }
  if (field2.length > 500) {
    toast.error('El comentario no puede exceder 500 caracteres.');
    return false;
  }
  return true;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // ... submit
};
```

### 5. **Responsive Design**

Todos los componentes usan breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

```css
.component {
  /* Mobile first */
  padding: 16px;
}

@media (min-width: 640px) {
  .component {
    padding: 24px;
  }
}

@media (min-width: 1024px) {
  .component {
    padding: 32px;
  }
}
```

### 6. **Accesibilidad (a11y)**

- Labels en todos los inputs
- ARIA labels en iconos
- Keyboard navigation
- Focus states visibles

```jsx
<button 
  onClick={handleDelete}
  aria-label="Eliminar calificación"
  className="delete-button"
>
  <DeleteIcon aria-hidden="true" />
</button>
```

---

## 🔄 Arquitectura de Servicios

Todos los servicios siguen este patrón:

### API Client Base

```javascript
// src/services/api-client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (añade token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (maneja errores globales)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout y redirect a login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Class Pattern

```javascript
// src/services/example-service.js
import apiClient from './api-client';

class ExampleService {
  async getItems() {
    const response = await apiClient.get('/items');
    return response.data;
  }

  async createItem(data) {
    const response = await apiClient.post('/items', data);
    return response.data;
  }

  async updateItem(id, data) {
    const response = await apiClient.put(`/items/${id}`, data);
    return response.data;
  }

  async deleteItem(id) {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
  }
}

export const exampleService = new ExampleService();
```

---

## 🚀 Uso de las HU

### Para Desarrolladores Frontend

1. **Leer la HU completa** antes de crear componentes
2. **Seguir la estructura de componentes** estándar
3. **Usar los servicios documentados** con los métodos exactos
4. **Implementar todos los estados**: loading, error, empty
5. **Usar mensajes toast** exactos del backend
6. **Verificar responsive** en mobile/tablet/desktop
7. **Probar accesibilidad** con teclado y screen reader

### Para IA/Copilot

Las HU frontend están escritas para generación automática de código:
- Estructura de componentes clara
- Props documentados con tipos
- Handlers con lógica completa
- Estilos CSS incluidos
- Ejemplos de uso

### Para Diseñadores UI/UX

Cada HU incluye:
- Wireframes descriptivos (estructura HTML/JSX)
- Paleta de colores (Tailwind CSS)
- Tipografía y spacing
- Estados visuales (loading, error, empty, success)
- Interacciones (hover, focus, active)

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "redux": "^4.x",
    "@reduxjs/toolkit": "^1.x",
    "react-redux": "^8.x",
    "axios": "^1.x",
    "react-toastify": "^9.x",
    "react-icons": "^4.x"
  }
}
```

---

## 🎯 Checklist General de Implementación

### Por cada HU

- [ ] **Componentes**
  - [ ] Componente principal creado
  - [ ] Subcomponentes reutilizables extraídos
  - [ ] Props documentados y validados (PropTypes)
  - [ ] Estados (loading, error, empty) implementados

- [ ] **Servicios**
  - [ ] Service class creado en `src/services/`
  - [ ] Todos los endpoints documentados implementados
  - [ ] Manejo de errores con try/catch
  - [ ] Respuestas parseadas correctamente

- [ ] **Estilos**
  - [ ] CSS module o archivo .css creado
  - [ ] Responsive breakpoints implementados
  - [ ] Estados visuales (hover, focus, active)
  - [ ] Accesibilidad (colores, contraste)

- [ ] **Validaciones**
  - [ ] Validación cliente en formularios
  - [ ] Mensajes de error claros
  - [ ] Campos requeridos marcados

- [ ] **Testing**
  - [ ] Flujo happy path funciona
  - [ ] Casos edge manejados
  - [ ] Mensajes toast correctos
  - [ ] Mobile responsive verificado

---

## 📝 Actualizado

**Fecha**: Diciembre 2025
**Versión**: 3.0
**Cambios Recientes**:
- ✨ Nueva HU: Sistema de Calificaciones (`INSTRUCTIONS_HU_RATINGS_SYSTEM.md`)
- ✨ Nueva HU: Mis Pedidos - Vista Cliente (`INSTRUCTIONS_HU_MY_ORDERS_FRONTEND.md`)
- ✨ Nueva HU: Chatbot Max - Asistente Virtual (`INSTRUCTIONS_HU_CHATBOT.md`)
- ✅ Revisión completa de todas las HU existentes
- 📊 100% de cobertura de funcionalidades UI (12 HU totales, 45+ componentes)

---

## 📞 Soporte

Para preguntas sobre las HU de frontend, consultar:
1. El archivo específico de la HU en este directorio
2. `../README.md` del proyecto para setup general
3. Backend HU en `../distribuidora-animales-back/HU/` para contratos de API

---

**Archivo**: `HU/README_HU.md`
