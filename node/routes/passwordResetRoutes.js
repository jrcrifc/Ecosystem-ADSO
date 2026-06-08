// Importa Express para crear las rutas del servidor
import express from 'express';
// Importa el modelo de usuario para consultas en la base de datos
import UserModel from '../models/userModel.js';
// Importa bcrypt para el cifrado de contraseñas
import bcrypt from 'bcrypt';
// Importa operadores de Sequelize para comparaciones en las consultas
import { Op } from 'sequelize';
// Importa el servicio de envío de correos electrónicos
import emailService from '../service/emailService.js';

// Crea una nueva instancia del Router
const router = express.Router();

// Función que genera un código aleatorio de 6 dígitos
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Define la ruta POST /api/password-reset/solicitar-codigo para solicitar un código de recuperación
router.post('/solicitar-codigo', async (req, res) => {
  try {
    // Obtiene el email del cuerpo de la petición
    let { email } = req.body;

    // Valida que se haya proporcionado un email
    if (!email) {
      return res.status(400).json({ message: 'Por favor, ingresa tu correo electrónico.' });
    }

    // Normaliza el email a minúsculas y sin espacios
    email = email.trim().toLowerCase();

    // Valida el formato del email con una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del correo electrónico no es válido.' });
    }

    // Busca al usuario asociado al email en la base de datos
    const usuario = await UserModel.findOne({ where: { email } });

    // Si no existe el usuario responde con 404
    if (!usuario) {
      return res.status(404).json({ message: 'No encontramos ninguna cuenta asociada a este correo.' });
    }

    // Genera un código aleatorio de 6 dígitos
    const codigo = generarCodigo();
    // Establece la expiración del código a 15 minutos
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    // Guarda el código y la expiración en la base de datos
    await usuario.update({
      reset_code: codigo,
      reset_code_expires: expiracion,
    });

    // Envía el correo electrónico con el código de verificación
    try {
      const subject = 'Código de recuperacion - ECOSYSTEM';
      const html = `
          <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #0077B6, #023E8A); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;"></div>
              <h2 style="color: #0A1628; margin: 12px 0 4px;">Recuperar Contrasena</h2>
              <p style="color: #64748b; font-size: 14px; margin: 0;">ECOSYSTEM - Laboratorio Ambiental</p>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #e2e8f0;">
              <p style="color: #334155; font-size: 14px; margin: 0 0 16px;">Hola <strong>${usuario.nombres_apellidos}</strong>, tu codigo de verificacion es:</p>
              <div style="background: linear-gradient(135deg, #0077B6, #023E8A); color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 24px; border-radius: 12px; display: inline-block;">
                ${codigo}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">Este codigo expira en <strong>15 minutos</strong>.</p>
              <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Si no solicitaste este codigo, puedes ignorar este mensaje de forma segura.</p>
            </div>
          </div>
      `;
      // Envía el correo electrónico
      await emailService.sendEmail(email, subject, `Tu codigo es: ${codigo}`, html);
      
      // Responde con mensaje de éxito
      return res.json({ message: 'Codigo enviado exitosamente. Revisa tu correo.' });
    } catch (emailError) {
      // Si falla el envío del correo responde con error 503
      return res.status(503).json({ 
        message: 'El servicio de correo no esta disponible temporalmente. Por favor, intenta mas tarde o contacta al soporte tecnico.' 
      });
    }

  } catch (error) {
    console.error('Error en solicitar-codigo:', error);
    res.status(500).json({ message: 'Ocurrio un error interno en el servidor.' });
  }
});

// Define la ruta POST /api/password-reset/verificar-codigo para validar el código de recuperación
router.post('/verificar-codigo', async (req, res) => {
  try {
    // Obtiene el email y código del cuerpo de la petición
    const { email, codigo } = req.body;

    // Valida que ambos campos estén presentes
    if (!email || !codigo) {
      return res.status(400).json({ message: 'Email y codigo son requeridos' });
    }

    // Busca al usuario por email
    const usuario = await UserModel.findOne({ where: { email: email.trim().toLowerCase() } });

    // Si no existe usuario o no tiene código activo responde con error
    if (!usuario || !usuario.reset_code) {
      return res.status(400).json({ message: 'No hay una solicitud de recuperacion activa para este correo.' });
    }

    // Verifica si el código ha expirado
    if (new Date() > usuario.reset_code_expires) {
      // Limpia el código expirado
      await usuario.update({ reset_code: null, reset_code_expires: null });
      return res.status(400).json({ message: 'El codigo ha expirado. Solicita uno nuevo.' });
    }

    // Verifica si el código ingresado es incorrecto
    if (usuario.reset_code !== codigo.trim()) {
      // Incrementa el contador de intentos fallidos
      const nuevosIntentos = (usuario.failed_attempts || 0) + 1;
      
      // Si supera 3 intentos fallidos invalida el código
      if (nuevosIntentos >= 3) {
        await usuario.update({ reset_code: null, reset_code_expires: null, failed_attempts: 0 });
        return res.status(400).json({ message: 'Has excedido el numero de intentos permitidos. El codigo ha sido invalidado.' });
      }

      // Actualiza el contador de intentos fallidos
      await usuario.update({ failed_attempts: nuevosIntentos });
      return res.status(400).json({ message: `Codigo de verificacion incorrecto. Intento ${nuevosIntentos}/3.` });
    }

    // Si el código es correcto reinicia los intentos fallidos
    await usuario.update({ failed_attempts: 0 });
    // Responde con éxito
    res.json({ message: 'Codigo verificado correctamente.' });

  } catch (error) {
    console.error('Error en verificar-codigo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Define la ruta POST /api/password-reset/cambiar-password para restablecer la contraseña
router.post('/cambiar-password', async (req, res) => {
  try {
    // Obtiene los campos del cuerpo de la petición
    const { email, codigo, nuevo_email, nueva_password } = req.body;

    // Valida que los campos obligatorios estén presentes
    if (!email || !codigo || !nueva_password) {
      return res.status(400).json({ message: 'Los campos obligatorios estan incompletos' });
    }

    // Valida que la nueva contraseña tenga al menos 8 caracteres
    if (nueva_password.length < 8) {
      return res.status(400).json({ message: 'La contrasena debe tener minimo 8 caracteres' });
    }

    // Verifica si el nuevo email ya está registrado por otro usuario
    if (nuevo_email && nuevo_email.trim().toLowerCase() !== email.trim().toLowerCase()) {
      const existeEmail = await UserModel.findOne({ where: { email: nuevo_email.trim().toLowerCase() } });
      if (existeEmail) {
        return res.status(400).json({ message: 'El nuevo correo electronico ya esta registrado con otro usuario' });
      }
    }

    // Verifica el código y su vigencia en la base de datos
    const usuario = await UserModel.findOne({
      where: {
        email: email.trim().toLowerCase(),
        reset_code: codigo.trim(),
        reset_code_expires: { [Op.gt]: new Date() }
      }
    });

    // Si el código es inválido o expiró responde con error
    if (!usuario) {
      return res.status(400).json({ message: 'Codigo invalido o expirado. Solicita uno nuevo.' });
    }

    // Prepara las actualizaciones cifrando la nueva contraseña con bcrypt
    const updates = {
      password: await bcrypt.hash(nueva_password, 10),
      reset_code: null,
      reset_code_expires: null,
    };

    // Si se especificó un nuevo email lo incluye en las actualizaciones
    if (nuevo_email) {
      updates.email = nuevo_email.trim().toLowerCase();
    }

    // Aplica las actualizaciones en la base de datos
    await usuario.update(updates);

    // Responde con mensaje de éxito
    res.json({ message: 'Datos actualizados correctamente. Ya puedes iniciar sesion con tus nuevas credenciales.' });

  } catch (error) {
    console.error('Error en cambiar-password:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Exporta el router para ser usado en la aplicación
export default router;

