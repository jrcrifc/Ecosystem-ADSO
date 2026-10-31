// Servicio para gestionar instructores (exclusivamente en la tabla instructores)
import InstructorModel from "../models/instructorModel.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { registrarLog } from "./logService.js";
import { getIO } from "../socket.js";

class InstructorService {
  // Obtiene todos los instructores desde la tabla instructores
  async getAll() {
    return await InstructorModel.findAll({
      attributes: { exclude: ['password'] },
      order: [['id_instructor', 'DESC']]
    });
  }

  // Crea un instructor manualmente (SOLO en la tabla instructores)
  async create(data) {
    let { documento, nombres_apellidos, email, tipo_vinculacion, telefono } = data;
    documento = (documento || "").trim();
    nombres_apellidos = (nombres_apellidos || "").trim();
    email = (email || "").trim().toLowerCase();

    if (!documento || !nombres_apellidos || !email) {
      throw new Error("Documento, Nombres y Correo son obligatorios");
    }

    // Verifica que no exista ni en instructores ni en usuarios
    const existDocInst = await InstructorModel.findOne({ where: { documento } });
    const existDocUser = await UserModel.findOne({ where: { documento } });
    if (existDocInst || existDocUser) {
      throw new Error("El documento ya está registrado en el sistema");
    }

    const existNameInst = await InstructorModel.findOne({ where: { nombres_apellidos } });
    if (existNameInst) {
      throw new Error("Ya existe un instructor registrado con este nombre exacto");
    }

    const existEmailInst = await InstructorModel.findOne({ where: { email } });
    const existEmailUser = await UserModel.findOne({ where: { email } });
    if (existEmailInst || existEmailUser) {
      throw new Error("El correo ya está registrado en el sistema");
    }

    const hashedPassword = await bcrypt.hash(documento, 10);

    const instructor = await InstructorModel.create({
      documento,
      nombres_apellidos,
      email,
      password: hashedPassword,
      tipo_vinculacion: tipo_vinculacion || null,
      telefono: telefono || null,
      estado: 'activo',
      id_usuario: null
    });

    await registrarLog(email, 'REGISTRO', 'AUTH', `Instructor registrado: ${nombres_apellidos}`);

    const { password: _, ...instSinPassword } = instructor.toJSON();
    return instSinPassword;
  }

  // Actualiza un instructor directamente en la tabla instructores
  async update(id_instructor, data) {
    const instructor = await InstructorModel.findByPk(id_instructor);
    if (!instructor) throw new Error("Instructor no encontrado");

    const documento = data.documento ? data.documento.trim() : instructor.documento;
    const nombres_apellidos = data.nombres_apellidos ? data.nombres_apellidos.trim() : instructor.nombres_apellidos;
    const email = data.email ? data.email.trim().toLowerCase() : instructor.email;
    const { tipo_vinculacion, telefono } = data;

    if (documento && documento !== instructor.documento) {
      const existInst = await InstructorModel.findOne({ where: { documento } });
      const existUser = await UserModel.findOne({ where: { documento } });
      if (existInst || existUser) throw new Error("El documento ya está en uso");
    }
    if (email && email !== instructor.email) {
      const existInst = await InstructorModel.findOne({ where: { email } });
      const existUser = await UserModel.findOne({ where: { email } });
      if (existInst || existUser) throw new Error("El correo ya está en uso");
    }
    if (nombres_apellidos && nombres_apellidos !== instructor.nombres_apellidos) {
      const existInst = await InstructorModel.findOne({ where: { nombres_apellidos } });
      if (existInst) throw new Error("Ya existe un instructor registrado con este nombre exacto");
    }

    await instructor.update({
      documento,
      nombres_apellidos,
      email,
      tipo_vinculacion: tipo_vinculacion !== undefined ? tipo_vinculacion : instructor.tipo_vinculacion,
      telefono: telefono !== undefined ? telefono : instructor.telefono
    });

    const { password: _, ...instSinPassword } = instructor.toJSON();
    return instSinPassword;
  }

  // Alterna el estado activo/inactivo de un instructor
  async toggleActivo(id_instructor) {
    const instructor = await InstructorModel.findByPk(id_instructor);
    if (!instructor) throw new Error("Instructor no encontrado");

    const nuevoEstado = instructor.estado === 'inactivo' ? 'activo' : 'inactivo';
    await instructor.update({ estado: nuevoEstado });

    if (nuevoEstado === 'inactivo') {
      try {
        const io = getIO();
        io.to(`user_${id_instructor}`).emit("force_logout", {
          mensaje: "Tu cuenta de instructor ha sido inactivada por el administrador."
        });
      } catch (err) {
        console.error("No se pudo emitir force_logout:", err);
      }
      await registrarLog('ADMIN', 'INACTIVAR_INSTRUCTOR', 'GESTION_USUARIOS', `Inactivado instructor: ${instructor.email || instructor.documento}`);
    } else {
      await registrarLog('ADMIN', 'ACTIVAR_INSTRUCTOR', 'GESTION_USUARIOS', `Reactivado instructor: ${instructor.email || instructor.documento}`);
    }

    return { id_instructor: instructor.id_instructor, estado: nuevoEstado };
  }

  // Elimina un instructor
  async delete(id_instructor) {
    const instructor = await InstructorModel.findByPk(id_instructor);
    if (!instructor) throw new Error("Instructor no encontrado");

    await instructor.destroy();
    return true;
  }
}

export default new InstructorService();
