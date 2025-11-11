## Resumen rápido

Este repositorio es una aplicación dividida en dos partes principales:
- Backend: carpeta `node/` — Node.js + Express + Sequelize (MySQL).
- Frontend: carpeta `frontend/` — React (Vite) con Axios.

Lee estas rutas para entender la estructura concreta: `node/app.js`, `node/routes/*`, `node/controller/*`, `node/service/*`, `node/models/*`, y `node/database/db.js`, además de `frontend/src/*`.

## Arquitectura y flujo de datos (por archivo)

- `node/app.js`: punto de entrada del servidor. Registra rutas bajo `/api/*`, carga `dotenv`, y conecta con Sequelize (`node/database/db.js`).
- `node/routes/*.js`: define endpoints REST y enlaza controladores (ej. `node/routes/personaSolicitanteRoutes.js`).
- `node/controller/*Controller.js`: recibe req/res y traduce llamadas a la capa de servicio. Observa que los controladores devuelven códigos HTTP específicos (200, 201, 204, 400, 404, 500).
- `node/service/*Service.js`: encapsula lógica de acceso a datos (Sequelize). Devuelve/promete entidades o lanza errores para que el controlador los maneje.
- `node/models/*.js`: definiciones de Sequelize. Ejemplo: `node/models/personaSolicitanteModel.js` usa la PK `id_persona_solicitante` y `freezeTableName: true`.
- `node/database/db.js`: configuración de Sequelize. Actualmente usa valores hardcodeados: database `ecosystem`, user `root`, no password, host `localhost`, dialect `mysql`.
- `frontend/src/api/axiosConfig.js`: instancia Axios con `baseURL = import.meta.env.VITE_API_URL`. Todas las llamadas front usan esa instancia (ej. `frontend/src/personaSolicitante/crudPersonaSolicitantes.jsx`).

## Convenciones de proyecto útiles para un agente

- Capa por responsabilidad: routes -> controllers -> services -> models. Cambios en una capa rara vez deben tocar otra directamente.
- Nombres de PK y campos Sequelize: se usan nombres en PascalCase para columnas (e.g., `Nombres`, `Documento`) y `id_persona_solicitante` como PK.
- Errores y estatus: los controladores traducen excepciones a códigos HTTP; revisa controladores para el mapeo exacto cuando agregues endpoints.
- DB credentials: están en `node/database/db.js` (hardcoded). Antes de cambiar a `.env`, confirma dependencias y comunicación con el equipo.

## Cómo ejecutar (local)

Backend (carpeta `node`):

 - instalar dependencias y ejecutar con nodemon (el script `start` usa `nodemon app.js` en `node/package.json`).

Frontend (carpeta `frontend`):

 - usar Vite (`npm run dev`). `frontend/package.json` expone `dev`, `build`, `preview`.

Nota sobre variables de entorno:
- Backend: `node/app.js` carga `dotenv` pero `db.js` no lee `.env` actualmente. Revisa `node/database/db.js` antes de asumir variables.
- Frontend: usa `VITE_API_URL` (en `.env` del frontend) para `axios`.

Ejemplo de endpoints (útil para pruebas y generación de mocks):
- GET /api/personaSolicitante -> devuelve lista (controlador -> servicio -> modelo.findAll).
- GET /api/personaSolicitante/:id -> devuelve 1 registro.
- POST /api/personaSolicitante -> crea registro (201).
- PUT /api/personaSolicitante/:id -> actualiza registro (200).
- DELETE /api/personaSolicitante/:id -> elimina (204).

## Puntos de fragilidad / cosas a vigilar

- Duplicación de prefijos API en frontend: algunos componentes usan rutas como `api/personaSolicitante` *además* de `VITE_API_URL`; verifica el valor de `VITE_API_URL` para evitar duplicar `/api` en las llamadas.
- Mensajes de error vacíos en servicios: en `personaSolicitanteService.update` y `delete` se lanzan `new Error('')` sin mensaje — esto complica el debugging; una tarea de mejora sería normalizar los mensajes.
- Modelos usan `DataTypes.CHAR`/`NUMBER` en lugar de `INTEGER`/`STRING` en algunos campos; confirmar expectativas del esquema MySQL si generas migraciones.

## Ficheros de referencia rápidos

- Backend entry: `node/app.js`
- DB config: `node/database/db.js`
- Ejemplo modelo: `node/models/personaSolicitanteModel.js`
- Rutas de ejemplo: `node/routes/personaSolicitanteRoutes.js`
- Ejemplo controller: `node/controller/personaSolicitanteController.js`
- Ejemplo service: `node/service/personaSolicitanteService.js`
- Frontend Axios: `frontend/src/api/axiosConfig.js`
- Frontend component ejemplo: `frontend/src/personaSolicitante/crudPersonaSolicitantes.jsx`

## Recomendaciones para PRs automáticas del agente

- Cuando agregues o modifiques endpoints, actualiza la capa de routes -> controller -> service -> model en ese orden.
- Para cambios que afectan la API pública, actualiza ejemplos en el frontend o los componentes de prueba.
- Si tocas DB config, no introduzcas credenciales en el repo; prefiere `.env` y actualiza `node/database/db.js` para leer `process.env`.

Si quieres, actualizo este archivo con ejemplos de `VITE_API_URL` y comandos PowerShell para arrancar ambas partes.
