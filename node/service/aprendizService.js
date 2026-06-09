// Servicio para gestionar aprendices
import AprendizModel from "../models/aprendizModel.js";
import UserModel from "../models/userModel.js";
import FichaModel from "../models/fichaModel.js";

class AprendizService {
  // Obtiene todos los aprendices
  async getAll() {
    return await AprendizModel.findAll({
      include: [
        { model: UserModel, as: 'usuario', attributes: ['email', 'estado', 'documento', 'nombres_apellidos'] },
        { model: FichaModel, as: 'ficha', attributes: ['numero_ficha'] }
      ]
    });
  }

  // Crea un aprendiz manualmente (Administrador)
  async create(data) {
    const { documento, nombres_apellidos, email, id_ficha } = data;
    if (!documento || !nombres_apellidos || !email) throw new Error("Faltan campos obligatorios");
    
    // Verifica si ya existe
    const existDoc = await UserModel.findOne({ where: { documento } });
    if (existDoc) throw new Error("El documento ya está registrado en el sistema");
    
    const existEmail = await UserModel.findOne({ where: { email } });
    if (existEmail) throw new Error("El correo ya está registrado en el sistema");

    const bcrypt = await import("bcrypt");
    const { v4: uuidv4 } = await import("uuid");

    const hashedPassword = await bcrypt.hash(documento, 10);
    
    const user = await UserModel.create({
      uuid: uuidv4(),
      documento,
      nombres_apellidos,
      email,
      password: hashedPassword,
      rol: 'Aprendiz',
      estado: 'aprobado',
      id_ficha
    });

    const aprendiz = await AprendizModel.create({
      documento,
      nombres_apellidos,
      email,
      id_ficha,
      id_usuario: user.id_usuario
    });

    return aprendiz;
  }

  // Actualiza un aprendiz
  async update(id_aprendiz, data) {
    const aprendiz = await AprendizModel.findByPk(id_aprendiz);
    if (!aprendiz) throw new Error("Aprendiz no encontrado");

    const user = await UserModel.findByPk(aprendiz.id_usuario);
    if (!user) throw new Error("Usuario asociado no encontrado");

    const { documento, nombres_apellidos, email, id_ficha } = data;

    // Verificar unicidad si cambia
    if (documento && documento !== user.documento) {
      const exist = await UserModel.findOne({ where: { documento } });
      if (exist) throw new Error("El documento ya está en uso");
    }
    if (email && email !== user.email) {
      const exist = await UserModel.findOne({ where: { email } });
      if (exist) throw new Error("El correo ya está en uso");
    }

    await user.update({
      documento: documento || user.documento,
      nombres_apellidos: nombres_apellidos || user.nombres_apellidos,
      email: email || user.email,
      id_ficha: id_ficha !== undefined ? id_ficha : user.id_ficha
    });

    await aprendiz.update({
      documento: documento || aprendiz.documento,
      nombres_apellidos: nombres_apellidos || aprendiz.nombres_apellidos,
      email: email || aprendiz.email,
      id_ficha: id_ficha !== undefined ? id_ficha : aprendiz.id_ficha
    });

    return aprendiz;
  }

  // Elimina un aprendiz
  async delete(id_aprendiz) {
    const aprendiz = await AprendizModel.findByPk(id_aprendiz);
    if (!aprendiz) throw new Error("Aprendiz no encontrado");

    const user = await UserModel.findByPk(aprendiz.id_usuario);
    
    await aprendiz.destroy();
    if (user) {
      await user.destroy();
    }
    return true;
  }
}

export default new AprendizService();
