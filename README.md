# Ultragroup - Prueba Técnica (Frontend Developer)

Este proyecto es una aplicación web construida con **Next.js** diseñada para gestionar un sistema integral de reserva de hoteles. Para abordar este reto, dividí la aplicación en dos módulos principales enfocados en los usuarios finales:
- **Perfil Agencia (Administración):** Un panel dedicado a la gestión operativa, permitiendo administrar hoteles, configurar habitaciones y visualizar las reservas realizadas.
- **Perfil Viajero (Reserva):** Una interfaz intuitiva para que los usuarios puedan buscar disponibilidad, explorar habitaciones y reservar.

---

## 1. Proceso de Desarrollo y Diseño

Creo firmemente que una buena ejecución comienza con una buena planificación. A partir de las instrucciones iniciales, destilé los requisitos funcionales, los prioricé y los agrupé en épicas de desarrollo.

Para cada épica, ejecuté un ciclo rápido de análisis, diseño y pruebas. **Antes de escribir una sola línea de código, utilicé FigJam para realizar *sketches* (bocetos) rápidos.** Esto me permitió aterrizar mis ideas inicialmente, visualizar la arquitectura de la información y definir los flujos de usuario de manera visual. 

**Puedes explorar los bocetos y el proceso de ideación aquí:** [Ver Sketches en FigJam](https://www.figma.com/file/FSsS4mgdWmabOshqimH4W5?node-id=0-1&p=f&t=bLxDGm5EgfbmVZPf-0&type=whiteboard)

---

## 2. Decisiones Técnicas

Para construir una solución robusta, escalable y mantenible, tomé las siguientes decisiones sobre el stack tecnológico:

* **Next.js (App Router):** Elegí el estándar más moderno de React. Utilizar el App Router me permitió aprovechar los Server Components y las Server Actions, mejorando el rendimiento y aislando la lógica de peticiones del lado del cliente.
* **Zustand (Gestión de Estado):** En lugar de opciones más pesadas como Redux, opté por Zustand. Nos permite realizar una gestión de estado global de manera sencilla, eficiente y sin *boilerplate* innecesario, ajustándose perfectamente al alcance del proyecto e integrando persistencia de sesión fácilmente, Zustand es ultilizando donde realmente se necesita mantener el estado entre vistas, esto para las fecha de inicio y final y la información de sesión del usuario.
* **Mockoon (Mock API Local):** Esta herramienta me permitió simular una API RESTful local, facilitando una iteración rápida y permitiendo probar flujos asíncronos y filtros  de manera realista. https://mockoon.com/ 
* **Zod + React Hook Form:** Para garantizar la integridad de los datos, separé la validación de la interfaz de usuario. Zod me permitió crear esquemas estrictos que validan las reglas de negocio antes de enviar cualquier dato al servidor.

---

## 3. Arquitectura 

La aplicación sigue un enfoque estricto de **Domain Driven Design (DDD)** adaptado al ecosistema de Next.js. Esta clara separación de responsabilidades asegura que el código sea limpio y fácilmente escalable cuando se integre con un backend de producción.

La carpeta `src/` está estructurada de la siguiente manera:

- **`app/` (Capa de Presentación):** Contiene la UI, layouts, componentes de React y la declaración de rutas. Aquí vive todo lo que el usuario ve y con lo que interactúa.
- **`domain/` (Capa de Dominio):** El corazón de la lógica de negocio. Contiene las interfaces, tipos y esquemas de validación de **Zod** (ej. `auth.schema.ts`). Garantiza que las reglas de negocio sean independientes de la interfaz visual.
- **`actions/` (Capa de Infraestructura/Servidor):** Implementación de **Next.js Server Actions** (`"use server"`). Estas funciones consumen la API, procesan reglas de negocio, manejan las Cookies de sesión (`HttpOnly` vía `next/headers`) y devuelven datos limpios al cliente.
- **`store/` (Capa de Estado):** Aislado para manejar la persistencia del cliente con **Zustand**. Provee acceso inmediato al estado de sesión (`isAuthenticated`), evitando el *prop-drilling* y sobreviviendo a recargas del navegador gracias a su *middleware* persistente.
- **`middleware.ts` (Seguridad):** Se ejecuta en el Edge-Runtime de Next.js. Intercepta las solicitudes, valida rápidamente el token de autorización (`auth_token`) y enruta el tráfico protegiendo las rutas de `agencia` y `viajero`.

---

## 4. Despliegue y CI/CD

El proyecto cuenta con despliegue en Vercel y Render, con integración y despliegue continuo (CI/CD) automatizado, donde por cada push a la rama main se ejecuta un pipeline de despliegue. 
* **Frontend en Vercel:** La aplicación Next.js fue desplegada en Vercel. La decisión de utilizar Vercel se basa en que es la plataforma nativa creada por los propios desarrolladores de Next.js, lo que garantiza integración total (Zero-config deployment) y aprovechamiento al máximo de Edge Network, Serverless Functions para Server Actions y la caché óptima del App Router.
   * **URL:** [https://ultragroup-black.vercel.app/](https://ultragroup-black.vercel.app/)

* **API en Render:** Para la Mock API, utilicé Render. Render facilita el despliegue de microservicios y aplicaciones basadas en contenedores de manera rápida y eficiente, sin complicaciones. Provee un entorno estable, ideal para exponer la API Mock y mantenerla corriendo en línea para que el Frontend la pueda consumir desde Vercel sin inconvenientes.
   * **URL:** [https://mock-api-s7b2.onrender.com](https://mock-api-s7b2.onrender.com)

---

## 5. Guía de Inicio Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### 5.1. Ejecutando el Frontend
1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5.2. Ejecutando la Mock API (Mockoon)

Para el desarrollo local, clona el repositorio de la [Mock API](https://github.com/DanielPalacios05/mock-api) y sírvela en el puerto `3001`.


* **Opción 1:** Puedes importar el archivo JSON del entorno de Mockoon en la aplicación de escritorio y hacer clic en iniciar.
* **Opción 2:** Usa la CLI de Mockoon:
  ```bash
  npm install -g @mockoon/cli
  mockoon-cli start --data ./mock-api.json --port 3001
  ```

---

## 6. Funcionalidades y Hoja de Ruta

### Módulo 1: Dashboard de Agencia
- **Autenticación:** Correo y contraseña fijos para la agencia.
- **Gestión de Hoteles:** Crear, editar y alternar el estado (habilitar/deshabilitar) de los hoteles.
- **Gestión de Habitaciones:** Crear, editar y alternar el estado de las habitaciones (Costo base, impuestos, tipo de habitación: Sencilla, Doble, Presidencial, ubicación).
- **Gestión de Reservas:** Ver todas las reservas asignadas a un hotel específico.

### Módulo 2: Dashboard del Viajero
- **Autenticación del Viajero:** Registro detallado con validaciones (Nombre, Fecha de nacimiento, Género, Tipo de documento, Número de documento, Email, Teléfono, Contraseña).
- **Búsqueda y Filtro:** Buscar por ciudad (ignorando mayúsculas y tildes) y fechas de entrada/salida.
- **Flujo de Reserva:** Ver habitaciones de hotel disponibles, verificar fechas y detalles de la habitación, y confirmar la reserva.

---

## 7. Datos por Defecto en la API y Limitaciones

Para facilitar las pruebas del aplicativo sin necesidad de crear registros iniciales, la API incluye los siguientes datos por defecto:

**Usuarios:**
- **Agencia (Administrador):**
  - Email: `admin@ultragroup.com`
  - Contraseña: `ultragroup123`
- **Viajero:**
  - Email: `danielpalacios.diego@gmail.com`
  - Contraseña: `daripadi123`

**Hoteles y Habitaciones:**
- **Hotel Paraíso Resort (Cartagena):** Incluye una habitación tipo Sencilla disponible.
- **UltraGroup Business (Bogotá):** Incluye una habitación tipo Especial deshabilitada.

**Limitaciones del Free Tier de Render:**
Dado que la Mock API está desplegada en la capa gratuita (Free Tier) de Render, existen ciertas limitaciones a tener en cuenta durante la evaluación:
- **Inactividad (Spin down):** Render suspende los servicios web gratuitos tras 15 minutos sin recibir tráfico.
- **Tiempos de Arranque (Cold starts):** Si la API entra en reposo, la primera petición que realice el frontend puede tardar **hasta 50 segundos o más** en recibir una respuesta mientras el contenedor vuelve a encenderse.
- Si ves un "Error" al intentar iniciar sesión o cargar hoteles por primera vez, por favor **espera un momento y vuelve a intentarlo**, ya que es el tiempo que toma el servidor en despertar.

---

## 8. Escalabilidad hacia Entornos Empresariales

Para llevar esta aplicación desde un Mock API hacia un entorno de producción empresarial de alta demanda, se deben considerar los siguientes ejes de escalabilidad:

- **Base de Datos y Transacciones Seguras:** Reemplazar la Mock API por un backend real integrado con una base de datos relacional (ej. PostgreSQL). Esto es vital para asegurar transacciones ACID durante la reserva, evitando problemas de concurrencia y *overbooking*.
- **Estrategias de Caché:** Implementar capas de caché (ej. Redis) para acelerar drásticamente consultas repetitivas (como el listado de hoteles o filtrado por ciudad) y aligerar la carga de la base de datos principal.
- **Mejoras UX / Frontend:**
  - **Paginación y Virtualización:** En la gestión de la agencia, implementar estrategias de paginación real o *infinite scroll* optimizado para manejar inventarios de miles de habitaciones sin afectar el rendimiento de renderizado en el navegador.
  - **Localización (i18n):** Adaptar la plataforma a múltiples idiomas.
  - **Tipos de Hotel Dinámicos:** Permitir clasificaciones complejas controladas desde el administrador.
---