// ============================================================
// 📋 MIDDLEWARE DE AUDITORÍA GLOBAL (auditoriaMiddleware)
// Intercepta todas las peticiones para registrar en la base de datos
// qué usuario hizo qué acción, en qué módulo y con qué detalles.
// Se ejecuta al finalizar la respuesta para asegurar que capture a req.user
// ============================================================

import LogModel from '../models/logModel.js';

export default function auditoriaMiddleware(req, res, next) {
  // Hook en el evento 'finish' de la respuesta para tener acceso a req.user (si fue inyectado)
  res.on('finish', async () => {
    try {
      // Ignoramos peticiones sin usuario autenticado
      if (!req.user) return;
      
      // Ignoramos peticiones GET (consultas) para no saturar la base de datos
      if (req.method === 'GET') return;
      
      // Obtenemos el identificador del usuario
      const usuario = req.user.email || req.user.documento || `User ID: ${req.user.id}`;

      // Determinamos la acción basada en el método HTTP
      let accion = 'Otra';
      if (req.method === 'GET') accion = 'Consulta';
      if (req.method === 'POST') accion = 'Creación';
      if (req.method === 'PUT' || req.method === 'PATCH') accion = 'Actualización';
      if (req.method === 'DELETE') accion = 'Eliminación';

      // Determinamos el módulo basándonos en la URL (ej. /api/equipos -> equipos)
      // Extraemos el primer segmento después de /api/
      let modulo = 'general';
      const match = req.originalUrl.match(/\/api\/([^\/\?]+)/);
      if (match && match[1]) {
        modulo = match[1];
      }

      // Preparamos los detalles (body, query, params)
      // Clonamos el body para poder limpiar contraseñas
      const bodyClean = { ...req.body };
      if (bodyClean.password) bodyClean.password = '***';
      if (bodyClean.newPassword) bodyClean.newPassword = '***';

      const detallesObj = {
        metodo: req.method,
        ruta: req.originalUrl,
        body: Object.keys(bodyClean).length > 0 ? bodyClean : undefined,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        status: res.statusCode
      };

      const detalles = JSON.stringify(detallesObj);

      // Guardamos el log en la base de datos
      await LogModel.create({
        usuario,
        accion,
        modulo,
        detalles
      });

    } catch (error) {
      console.error('❌ Error al registrar auditoría:', error.message);
    }
  });

  next();
}
