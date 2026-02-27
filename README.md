# Ultragroup - Prueba Técnica (Frontend Developer)

## 1. Descripción del Proyecto
Este proyecto es una implementación técnica para el rol de Frontend Developer en UltraGroup. Es una aplicación web construida con **Next.js**, diseñada para gestionar un sistema de reserva de hoteles con dos módulos principales:
- **Perfil Agencia (Administración):** Gestionar hoteles, habitaciones y visualizar reservas.
- **Perfil Viajero (Reserva):** Buscar, ver y reservar habitaciones de hotel.

## 2. Proceso de desarollo

De acuerdo a la instrucción generada se destilaron requisitos funcionales implementables que fueron priorizados y agrupados en épicas.

Cada epica se desarollo un ciclo rápido de análisis, diseño (Usando Sketchs en Figjam) y Pruebas.

## 2. Stack Tecnológico y Herramientas
- **Framework:** Next.js (App Router)
- **Gestión de Estado:** Zustand
- **Estilos:** Tailwind CSS
- **Mock API:** Mockoon (Simulación de API local)

Zustand nos permite realizar una gestión de estado global de manera sencilla y eficiente teniendo en cuenta el alcance del proyecto.

El uso herramientas como Mockoon permite la rápida iteración y desarrollo del proyecto, ya que nos permite simular una API local sin necesidad de un backend.



## 3. Arquitectura 

La aplicación sigue un **Diseño Dirigido por Dominio (DDD - Domain-Driven Design)** estricto implementado sobre el App Router de Next.js, con un claro abismo de responsabilidades utilizando la carpeta `src/`.

Esta separación de responsabilidades nos permite mantener el código limpio y fácil de escalar, clave al momento de integrar nuestro código con un backend real.

### Estructura del Proyecto
- **`src/app/`**: Contiene la presentación UI, layouts, abstracción de componentes React, y la declaración de rutas de la aplicación  
- **`src/domain/`**: El núcleo de la lógica de negocio. Contiene interfaces, validaciones complejas de los formularios, y esquemas de **Zod** (ej. `auth.schema.ts`), garantizando que la integridad relacional de los datos exista y pueda importarse independientemente de la interfaz.
- **`src/actions/`**: Implementación de **Next.js Server Actions**. Funciones marcadas con `"use server"` que se ejecutan directamente en un entorno de servidor aislado. Estas acciones consumen la API, procesan reglas de sistema, hidratan las Cookies (`next/headers`) usando directivas `HttpOnly` y devuelven la data pura lista hacia la interfaz de cliente.
- **`src/store/`**: Gestión de persistencia de estado del cliente manejado por **Zustand**. Aislado para proveer tokens temporales, estado de sesión inmediato UI (`isAuthenticated`) logrando una rápida lectura y evitar prop-drilling. Usa un middleware persistente para sobrevivir la recarga de pestañas.
- **`src/middleware.ts`**: Middleware de Edge-Runtime de Next.js intercepta nativamente cada solicitud al servidor y re-valida rápidamente la autorización leyendo la Cookie `auth_token` provista en acciones seguras. Enruta tráfico inválido de perfiles `agencia` o `viajero` directamente hacia `/(auth)/login`.

### Modelado y Stack Adicional
- **Integridad y Formularios:** Validaciones pesadas implementadas sin acoplamiento a la vista en base a **Zod** + **React Hook Form**. Manejo dinámico de errores en inputs y un custom `ErrorMap`.
- **Mock API Local**: Las acciones asíncronas se conectan hacia una estructura bucket REST en `http://localhost:3001/api` con Mockoon que permite un desarrollo desvinculado con filtros automáticos de consulta como `_eq`.
- **Pruebas (Testing):** Suites de Jest configuradas simulando al App Router y `actions` para probar estados y envío de forms puros.

## 4. Empezando

### 4.1 Ejecutando el Frontend
Primero, instala las dependencias:
```bash
npm install
```

Luego, ejecuta el servidor de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4.2 Ejecutando la Mock API (Mockoon)
Necesitas servir la mock API a través de Mockoon.
Opción 1: Puedes importar el archivo JSON del entorno de Mockoon en la aplicación de escritorio de Mockoon y hacer clic en iniciar.
Opción 2: Usa la CLI de Mockoon (ej., `@mockoon/cli`).

## 5. Hoja de Ruta de Implementación y Funcionalidades

### Módulo 1: Dashboard de Agencia
- **Autenticación:** Correo y contraseña fijos para la agencia.
- **Gestión de Hoteles:** Crear, editar y alternar el estado (habilitar/deshabilitar) de los hoteles.
- **Gestión de Habitaciones:** Crear, editar y alternar el estado de las habitaciones (Costo base, impuestos, tipo de habitación: Sencilla, Doble, Presidencial, ubicación).
- **Gestión de Reservas:** Ver todas las reservas asignadas a un hotel específico.

### Módulo 2: Dashboard del Viajero
- **Autenticación del Viajero:** Registro detallado con validaciones (Nombre, Fecha de nacimiento, Género, Tipo de documento, Número de documento, Email, Teléfono, Contraseña).
- **Búsqueda y Filtro:** Buscar por ciudad (ignorando mayúsculas y tildes) y fechas de entrada/salida.
- **Flujo de Reserva:** Ver habitaciones de hotel disponibles, verificar fechas y detalles de la habitación, y confirmar la reserva.

## 6. ¿Como podemos escalarlo?:
- **Localización de Textos (String Localization)**
- **Tipos de Hotel Dinámicos**
- **Paginación**

## 7. Testing
Pruebas unitarias con cobertura para funcionalidades críticas básicas (Configuración de estado, custom hooks).
