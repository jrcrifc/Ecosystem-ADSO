# 🔬 Ecosystem ADSO — Servidor Backend (Express)

> **Sistema de Gestión de Laboratorio Ambiental del SENA**

Este directorio contiene el backend de la aplicación **Ecosystem**, una solución fullstack para el control y administración del Laboratorio Ambiental del SENA. El servidor está construido sobre Node.js usando Express, Sequelize como ORM y MySQL como motor de base de datos relacional.

---

## 📋 Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **MySQL**: Versión 8 o superior.
- Base de datos local o remota llamada `ecosystem`.

---

## ⚙️ Instalación y Configuración

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Crear un archivo `.env` en la raíz del proyecto (o usar el existente) y configurar las variables de entorno necesarias (ver sección de Variables de Entorno en el README principal o usar las credenciales de base de datos local).

---

## 🚀 Scripts Disponibles (package.json)

En `package.json` se definen los siguientes scripts para la ejecución y mantenimiento:

- `npm start` / `npm run dev` / `npm run server`: Inicia el servidor de desarrollo utilizando `app.js` como punto de entrada (escuchando por defecto en el puerto `8000`).
- `npm run lint`: Ejecuta ESLint para analizar la calidad y el estilo de código del servidor.

---

## 📁 Estructura del Backend y Documentación de Módulos

El backend está organizado de la siguiente manera:

* **`app.js`**: Punto de entrada principal. Inicializa el servidor Express, configura middlewares globales (CORS, JSON, subida de archivos estáticos) y monta todos los routers del sistema. También levanta el servidor HTTP para Socket.io.
* **`socket.js`**: Configuración y control del servidor de WebSockets en tiempo real. Gestiona salas privadas de usuarios para notificaciones instantáneas (préstamos, aprobación de cuentas, etc.).
* **`syncDatabase.js`**: Script de sincronización manual de modelos con la base de datos usando `{ alter: true }` de Sequelize.
* **`database/db.js`**: Instancia y conexión de Sequelize a la base de datos MySQL con soporte de reconexión y logs detallados.
* **`models/`**: Definición de esquemas de tablas con Sequelize. Contiene `associations.js` que centraliza la relación de cardinalidad entre las 15+ tablas del sistema.
* **`middleware/`**:
  * `authMiddleware.js`: Filtro de seguridad que intercepta peticiones HTTP para verificar la validez del token JWT.
  * `roleMiddleware.js`: Comprobación de roles específicos (Administrador, Gestor, Pasante, Instructor, Aprendiz) para autorización de accesos.
* **`controller/`**: Controladores que reciben los requests HTTP, aplican validaciones de datos y responden con los estados correspondientes.
* **`service/`**: Capa lógica de negocio del sistema. Aquí se implementan algoritmos críticos como el método **FEFO** (First Expired, First Out) para la distribución inteligente de salidas de reactivos por lotes.
* **`routes/`**: Definición de los 20 routers Express que exponen los endpoints de la API organizados por módulos.
* **`scripts/`**: Utilidades y scripts de mantenimiento (creación de usuarios administradores iniciales, seedeo de tablas maestras, envío de emails de prueba).
