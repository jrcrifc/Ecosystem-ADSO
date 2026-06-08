// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa los controladores de movimientos de reactivos
import { 
  getAllmovimientoreactivo, 
  getmovimientoreactivo, 
  createmovimientoreactivo, 
  updatemovimientoreactivo, 
  deletemovimientoreactivo 
} from '../controller/movimientoreactivosController.js';
// Importa el modelo de movimientos de reactivos para consultas en la base de datos
import movimientoreactivoModel from '../models/movimientoreactivosModel.js';
// Importa el modelo de proveedores para las relaciones
import proveedorModel from '../models/proveedoresModel.js';
// Importa el modelo de salidas para las relaciones
import salidasModel from '../models/salidasModel.js';
// Importa el middleware de autorización para administradores y gestores
import { adminOGestor } from '../middleware/roleMiddleware.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Define la ruta GET /api/movimientos/stock-lotes/:id_reactivo para calcular stock por lotes
router.get('/stock-lotes/:id_reactivo', adminOGestor, async (req, res) => {
  try {
    // Obtiene el ID del reactivo desde los parámetros de la ruta
    const { id_reactivo } = req.params;
    // Obtiene la fecha actual para comparar vencimientos
    const hoy = new Date();
    // Ajusta la zona horaria para obtener la fecha local en formato YYYY-MM-DD
    const offset = hoy.getTimezoneOffset() * 60000;
    const localHoyStr = new Date(hoy - offset).toISOString().slice(0, 10);
    const timeHoyLocal = new Date(localHoyStr).getTime();

    // Busca todos los movimientos activos del reactivo con sus relaciones
    const movimientos = await movimientoreactivoModel.findAll({
      where: { id_reactivo, estado: 1 },
      include: [
        // Incluye el proveedor asociado al movimiento
        { model: proveedorModel, as: 'proveedor' },
        // Incluye las salidas asociadas al movimiento
        { model: salidasModel, as: 'salidas', where: { estado: 1 }, required: false }
      ]
    });

    // Agrupa los movimientos por lote y calcula la cantidad disponible
    const loteMap = {};
    movimientos.forEach(m => {
      const lote = m.lote || 'Sin lote';
      // Inicializa el lote si no existe en el mapa
      if (!loteMap[lote]) {
        loteMap[lote] = {
          lote,
          id_movimiento_reactivo: m.id_movimiento_reactivo,
          fecha_vencimiento: m.fecha_vencimiento || null,
          cantidad_disponible: 0
        };
      }
      // Suma la cantidad inicial y resta las salidas
      loteMap[lote].cantidad_disponible += parseFloat(m.cantidad_inicial || 0);
      loteMap[lote].cantidad_disponible -= parseFloat(m.cantidad_salida || 0);
    });

    // Calcula los días restantes para el vencimiento de cada lote
    const todosLotes = Object.values(loteMap).map(l => {
      // Calcula los días para vencer si existe fecha de vencimiento
      const diasParaVencer = l.fecha_vencimiento
        ? Math.round((new Date(l.fecha_vencimiento).getTime() - timeHoyLocal) / (1000 * 60 * 60 * 24))
        : null;
      return {
        ...l,
        cantidad_disponible: Math.max(0, parseFloat(l.cantidad_disponible.toFixed(3))),
        dias_para_vencer: diasParaVencer
      };
    });

    // Filtra los lotes disponibles (no vencidos y con cantidad positiva)
    const lotes_disponibles = todosLotes.filter(l =>
      l.cantidad_disponible > 0 && (l.dias_para_vencer === null || l.dias_para_vencer >= 0)
    );

    // Filtra los lotes vencidos
    const lotes_vencidos = todosLotes.filter(l =>
      l.dias_para_vencer !== null && l.dias_para_vencer < 0
    );

    // Mapea el historial de entradas desde los movimientos
    const entradas = movimientos.map(m => ({
      id: m.id_movimiento_reactivo,
      tipo: 'entrada',
      lote: m.lote || 'Sin lote',
      cantidad: parseFloat(m.cantidad_inicial || 0),
      fecha: m.createdAt,
      proveedor: m.proveedor ? `${m.proveedor.nom_proveedor} ${m.proveedor.apel_proveedor || ''}`.trim() : null,
      fecha_vencimiento: m.fecha_vencimiento || null
    }));

    // Mapea el historial de salidas desde las relaciones
    const salidas = [];
    movimientos.forEach(m => {
      if (m.salidas && m.salidas.length > 0) {
        m.salidas.forEach(s => {
          salidas.push({
            id: s.id_salida,
            tipo: 'salida',
            lote: m.lote || 'Sin lote',
            cantidad: parseFloat(s.cantidad_salida || 0),
            fecha: s.fecha_salida || s.createdAt
          });
        });
      }
    });

    // Combina entradas y salidas ordenadas por fecha descendente
    const historial = [...entradas, ...salidas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Responde con los lotes disponibles, vencidos y el historial
    res.json({
      lotes_disponibles,
      resumen_vencidos: {
        cantidad_lotes_vencidos: lotes_vencidos.length,
        detalles: lotes_vencidos
      },
      historial
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Define la ruta GET /api/movimientos para obtener todos los movimientos
router.get('/', adminOGestor, getAllmovimientoreactivo);

// Define la ruta GET /api/movimientos/:id para obtener un movimiento por ID
router.get('/:id', adminOGestor, getmovimientoreactivo);

// Define la ruta POST /api/movimientos para crear un nuevo movimiento
router.post('/', adminOGestor, createmovimientoreactivo);

// Define la ruta PUT /api/movimientos/:id para actualizar un movimiento existente
router.put('/:id', adminOGestor, updatemovimientoreactivo);

// Define la ruta DELETE /api/movimientos/:id para eliminar un movimiento
router.delete('/:id', adminOGestor, deletemovimientoreactivo);

// Define la ruta PUT /api/movimientos/estado/:id para verificar la existencia de un movimiento
router.put("/estado/:id", adminOGestor, async (req, res) => {
  try {
    // Busca el movimiento por ID
    const movimiento = await movimientoreactivoModel.findByPk(req.params.id);
    // Si no existe responde con 404
    if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado" });
    // Responde con éxito si el movimiento existe
    return res.status(200).json({ success: true, message: "Estado verificado correctamente" });
  } catch (error) {
    console.error("Error en ruta /estado/:id:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
  }
});

// Exporta el router para ser usado en la aplicación
export default router;