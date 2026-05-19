import express from 'express';
import { 
    getAll, 
    getById, 
    create, 
    update,
    cambiarEstado,
    remove 
} from '../controller/solicitudController.js';
import solicitudModel from '../models/solicitudModel.js';
import solicitudxequipoModel from '../models/solicitudxequipoModel.js';
import equipoModel from '../models/EquiposModel.js';
import Estadoxequipo from '../models/estadoxequipoModel.js';
import { getIO } from '../socket.js';
import authMiddleware from '../middleware/authMiddleware.js'; // ← importa el middleware
import { todosLosRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ← todas las rutas protegidas con el middleware
router.get('/',            todosLosRoles, getAll);
router.get('/:id',         todosLosRoles, getById);
router.post('/',           todosLosRoles, create);       // aquí req.user.id ya está disponible
router.put('/:id',         todosLosRoles, update);
router.delete('/:id',      todosLosRoles, remove);

// ← Cambiar estado activo/inactivo (toggle 1/0)
router.put('/estado/:id',  todosLosRoles, async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await solicitudModel.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }
        const nuevoEstado = solicitud.estado === 1 ? 0 : 1;
        await solicitud.update({ estado: nuevoEstado });

        // Si se inactiva (cancela) la solicitud, liberar automáticamente los equipos vinculados
        if (nuevoEstado === 0) {
            const vinculos = await solicitudxequipoModel.findAll({
                where: { id_solicitud: id }
            });

            if (vinculos && vinculos.length > 0) {
                const idsEquipos = vinculos.map(v => v.id_equipo);
                
                // 1. Asegurar que los equipos sigan estando ACTIVOS (estado: 1)
                await equipoModel.update(
                    { estado: 1 },
                    { where: { id_equipo: idsEquipos } }
                );

                // 2. Registrar el estado disponible en el historial de estados de equipos
                for (const id_equipo of idsEquipos) {
                    await Estadoxequipo.create({
                        id_equipo,
                        id_estado_equipo: 1 // disponible
                    });
                }
            }
        }

        // Emitir eventos globales de refresco en tiempo real
        try {
            getIO().emit('solicitud_actualizada');
            getIO().emit('equipo_actualizado');
        } catch (socketError) {
            console.error('Error al emitir eventos de socket:', socketError);
        }

        res.json({ message: "Estado cambiado correctamente", estado: nuevoEstado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

// ← Solo admin: cambiar estado (generado, aceptado, prestado, etc.)
router.post('/cambiarEstado/:id', todosLosRoles, cambiarEstado);

export default router;