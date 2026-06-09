// Servicio para gestionar instructores
import InstructorModel from "../models/instructorModel.js";
import UserModel from "../models/userModel.js";

class InstructorService {
  // Obtiene todos los instructores
  async getAll() {
    return await InstructorModel.findAll({
      include: [{
        model: UserModel,
        as: 'usuario',
        attributes: ['email', 'estado', 'documento', 'nombres_apellidos']
      }]
    });
  }

  // Crea un instructor manualmente
  async create(data) {
    const { documento, nombres_apellidos, email } = data;
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
      rol: 'Instructor',
      estado: 'aprobado'
    });

    const instructor = await InstructorModel.create({
      documento,
      nombres_apellidos,
      email,
      id_usuario: user.id_usuario
    });

    return instructor;
  }

  // Actualiza un instructor
  async update(id_instructor, data) {
    const instructor = await InstructorModel.findByPk(id_instructor);
    if (!instructor) throw new Error("Instructor no encontrado");

    const user = await UserModel.findByPk(instructor.id_usuario);
    if (!user) throw new Error("Usuario asociado no encontrado");

    const { documento, nombres_apellidos, email } = data;

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
      email: email || user.email
    });

    await instructor.update({
      documento: documento || instructor.documento,
      nombres_apellidos: nombres_apellidos || instructor.nombres_apellidos,
      email: email || instructor.email
    });

    return instructor;
  }

  // Elimina un instructor
  async delete(id_instructor) {
    const instructor = await InstructorModel.findByPk(id_instructor);
    if (!instructor) throw new Error("Instructor no encontrado");

    const user = await UserModel.findByPk(instructor.id_usuario);
    
    await instructor.destroy();
    if (user) {
      await user.destroy();
    }
    return true;
  }
}

export default new InstructorService();
