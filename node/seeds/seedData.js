import estadoSolicitudModel from '../models/estadoSolicitudModel.js';
import estadoEquipoModel from '../models/estadoEquipoModel.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'

export const seedDatabase = async () => {
    try {
        // Insertar datos en estado_solicitud si está vacía
        const countEstadosSolicitud = await estadoSolicitudModel.count();
        if (countEstadosSolicitud === 0) {
            console.log('Insertando datos en estado_solicitud...');
            await estadoSolicitudModel.bulkCreate([
                { estado: 'generado', estados: 1 },
                { estado: 'aceptado', estados: 1 },
                { estado: 'prestado', estados: 1 },
                { estado: 'cancelado', estados: 1 },
                { estado: 'entregado', estados: 1 }
            ]);
            console.log('Datos de estado_solicitud insertados correctamente');
        } else {
            console.log('estado_solicitud ya contiene datos');
        }

        // Insertar datos en Estado_equipo si está vacía
        const countEstadosEquipo = await estadoEquipoModel.count();
        if (countEstadosEquipo === 0) {
            console.log('Insertando datos en Estado_equipo...');
            await estadoEquipoModel.bulkCreate([
                { estado: 'Disponible', estados: 1 },
                { estado: 'En uso', estados: 1 },
                { estado: 'Mantenimiento', estados: 1 },
                { estado: 'Dañado', estados: 1 },
                { estado: 'Retirado', estados: 1 }
            ]);
            console.log('Datos de Estado_equipo insertados correctamente');
        } else {
            console.log('Estado_equipo ya contiene datos');
        }

        // Insertar usuario(s) por defecto
        const countUsuarios = await userModel.count();
        if (countUsuarios === 0) {
            console.log('Insertando usuarios por defecto...');
            const adminHash = await bcrypt.hash('Admin1234', 10);
            const userHash = await bcrypt.hash('User1234', 10);

            // crear administrador y un usuario normal
            await userModel.bulkCreate([
                {
                    userEmail: 'admin@example.com',
                    password: adminHash,
                    userType: 'gestor',          // clave administrativa
                    admin: true
                },
                {
                    userEmail: 'user@example.com',
                    password: userHash,
                    userType: 'aprendiz',        // usuario normal
                    admin: false
                }
            ]);
            console.log('Usuarios por defecto insertados correctamente:');
            console.log(' - admin@example.com / Admin1234 (admin)');
            console.log(' - user@example.com / User1234 (normal)');
        } else {
            console.log('Usuarios ya contiene datos');
        }
    } catch (error) {
        console.error('Error al ejecutar seedDatabase:', error);
    }
};
