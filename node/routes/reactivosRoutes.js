// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de reactivos para manejar la lógica de cada endpoint
import {
  getAllreactivos,
  getreactivos,
  createreactivos,
  updatereactivos,
  deletereactivos
} from '../controller/reactivosController.js';
// Importa el modelo de reactivos para consultas en la base de datos
import reactivosModel from '../models/reactivosModel.js';
// Importa el modelo de movimientos de reactivos para calcular disponibilidad
import movimientoreactivoModel from '../models/movimientoreactivosModel.js';
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/reactivos/stock/disponibilidad para calcular el stock disponible por lote
router.get('/stock/disponibilidad', adminOGestor, async (req, res) => {
  try {
    // Obtiene la fecha actual para comparar con fechas de vencimiento
    const hoy = new Date();
    // Busca todos los reactivos activos
    const reactivos = await reactivosModel.findAll({ where: { estado: 1 } });
    // Busca todos los movimientos activos
    const movimientos = await movimientoreactivoModel.findAll({ where: { estado: 1 } });

    // Calcula la disponibilidad para cada reactivo
    const resultado = reactivos.map(r => {
      // Filtra los movimientos que pertenecen a este reactivo
      const movs = movimientos.filter(m => m.id_reactivo === r.id_reactivo);

      // Agrupa los movimientos por lote
      const loteMap = {};
      movs.forEach(m => {
        const lote = m.lote || 'Sin lote';
        // Inicializa el lote si no existe en el mapa
        if (!loteMap[lote]) {
          loteMap[lote] = {
            fecha_vencimiento: m.fecha_vencimiento || null,
            cantidad_disponible: 0
          };
        }
        // Suma la cantidad inicial y resta las salidas para calcular el disponible
        loteMap[lote].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
        loteMap[lote].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
      });

      // Recorre los lotes para separar los vencidos de los disponibles
      let cantidad_inventario = 0;
      let lotes_vencidos_count = 0;
      let cantidad_vencida = 0;

      Object.values(loteMap).forEach(l => {
        const disponible = parseFloat(l.cantidad_disponible.toFixed(3));
        // Ignora lotes sin cantidad disponible
        if (disponible <= 0) return;
        
        // Determina si el lote está vencido comparando con la fecha actual
        const vencido = l.fecha_vencimiento && new Date(l.fecha_vencimiento) <= hoy;
        if (vencido) {
          // Contabiliza en los lotes vencidos
          lotes_vencidos_count++;
          cantidad_vencida += disponible;
        } else {
          // Suma al inventario disponible
          cantidad_inventario += disponible;
        }
      });

      // Retorna el objeto con la información calculada del reactivo
      return {
        id_reactivo: r.id_reactivo,
        nom_reactivo: r.nom_reactivo,
        presentacion_reactivo: r.presentacion_reactivo,
        cantidad_inventario: Math.max(0, parseFloat(cantidad_inventario.toFixed(3))),
        estado_stock: cantidad_inventario > 0 ? 'disponible' : 'agotado',
        lotes_vencidos: lotes_vencidos_count,
        cantidad_vencida: parseFloat(cantidad_vencida.toFixed(3))
      };
    });

    // Responde con el listado de disponibilidad calculado
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Define la ruta GET /api/reactivos para obtener todos los reactivos
router.get('/', adminOGestor, getAllreactivos);

// Define la ruta GET /api/reactivos/:id para obtener un reactivo por ID
router.get('/:id', adminOGestor, getreactivos);

// Define la ruta POST /api/reactivos para crear un nuevo reactivo
router.post('/', adminOGestor, createreactivos);

// Define la ruta PUT /api/reactivos/:id para actualizar un reactivo existente
router.put('/:id', adminOGestor, updatereactivos);

// Define la ruta DELETE /api/reactivos/:id para eliminar un reactivo
router.delete('/:id', adminOGestor, deletereactivos);

// Define la ruta PUT /api/reactivos/estado/:id para activar/inactivar un reactivo
router.put('/estado/:id', adminOGestor, async (req, res) => {
  try {
    // Busca el reactivo por ID
    const reactivo = await reactivosModel.findByPk(req.params.id);
    // Si no existe responde con 404
    if (!reactivo) return res.status(404).json({ message: "reactivo no encontrado" });
    // Calcula el nuevo estado invirtiendo el actual
    const nuevoEstado = reactivo.estado === 1 ? 0 : 1;
    // Actualiza el estado del reactivo
    await reactivo.update({ estado: nuevoEstado });
    // Responde con el mensaje de éxito
    res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Exporta el router para ser usado en la aplicación
export default router;