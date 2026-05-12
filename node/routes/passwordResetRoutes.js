import express from 'express';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import emailService from '../service/emailService.js';

const router = express.Router();

// ✅ Generar código de 6 dígitos
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =============================
// 📧 PASO 1: Solicitar código de recuperación
// =============================
router.post('/solicitar-codigo', async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Por favor, ingresa tu correo electrónico.' });
    }

    email = email.trim().toLowerCase();

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del correo electrónico no es válido.' });
    }

    const usuario = await UserModel.findOne({ where: { email } });

    if (!usuario) {
      // Por seguridad, en sistemas de alta confidencialidad se dice lo mismo, 
      // pero para un sistema de lab ambiental es mejor guiar al usuario.
      return res.status(404).json({ message: 'No encontramos ninguna cuenta asociada a este correo.' });
    }

    // Generar código y expiración (15 minutos)
    const codigo = generarCodigo();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar en BD
    await usuario.update({
      reset_code: codigo,
      reset_code_expires: expiracion,
    });

    // Enviar email
    try {
      const subject = '🔐 Código de recuperación - ECOSYSTEM';
      const html = `
          <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #0077B6, #023E8A); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">🔐</div>
              <h2 style="color: #0A1628; margin: 12px 0 4px;">Recuperar Contraseña</h2>
              <p style="color: #64748b; font-size: 14px; margin: 0;">ECOSYSTEM - Laboratorio Ambiental</p>
            </div>
            <div style="background: #fff; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #e2e8f0;">
              <p style="color: #334155; font-size: 14px; margin: 0 0 16px;">Hola <strong>${usuario.nombres_apellidos}</strong>, tu código de verificación es:</p>
              <div style="background: linear-gradient(135deg, #0077B6, #023E8A); color: #fff; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 24px; border-radius: 12px; display: inline-block;">
                ${codigo}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">Este código expira en <strong>15 minutos</strong>.</p>
              <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Si no solicitaste este código, puedes ignorar este mensaje de forma segura.</p>
            </div>
          </div>
      `;
      await emailService.sendEmail(email, subject, `Tu código es: ${codigo}`, html);
      console.log(`✅ Código enviado a ${email}: ${codigo}`);
      
      return res.json({ message: 'Código enviado exitosamente. Revisa tu correo.' });
    } catch (emailError) {
      console.error('⚠️ Error crítico de Nodemailer:', emailError.message);
      return res.status(503).json({ 
        message: 'El servicio de correo no está disponible temporalmente. Por favor, intenta más tarde o contacta al soporte técnico.' 
      });
    }

  } catch (error) {
    console.error('Error en solicitar-codigo:', error);
    res.status(500).json({ message: 'Ocurrió un error interno en el servidor.' });
  }
});

// =============================
// 🔑 PASO 2: Verificar Código
// =============================
router.post('/verificar-codigo', async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ message: 'Email y código son requeridos' });
    }

    const usuario = await UserModel.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!usuario || !usuario.reset_code) {
      return res.status(400).json({ message: 'No hay una solicitud de recuperación activa para este correo.' });
    }

    // Verificar expiración
    if (new Date() > usuario.reset_code_expires) {
      await usuario.update({ reset_code: null, reset_code_expires: null });
      return res.status(400).json({ message: 'El código ha expirado. Solicita uno nuevo.' });
    }

    // ✅ BLINDAJE HACKER: Protección contra Fuerza Bruta
    if (usuario.reset_code !== codigo.trim()) {
      const nuevosIntentos = (usuario.failed_attempts || 0) + 1;
      
      if (nuevosIntentos >= 3) {
        await usuario.update({ reset_code: null, reset_code_expires: null, failed_attempts: 0 });
        return res.status(400).json({ message: 'Has excedido el número de intentos permitidos. El código ha sido invalidado.' });
      }

      await usuario.update({ failed_attempts: nuevosIntentos });
      return res.status(400).json({ message: `Código de verificación incorrecto. Intento ${nuevosIntentos}/3.` });
    }

    // Si es correcto, reseteamos intentos
    await usuario.update({ failed_attempts: 0 });
    res.json({ message: 'Código verificado correctamente.' });

  } catch (error) {
    console.error('Error en verificar-codigo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// =============================
// 🔑 PASO 3: Cambiar datos de acceso (Email y Password)
// =============================
router.post('/cambiar-password', async (req, res) => {
  try {
    const { email, codigo, nuevo_email, nueva_password } = req.body;

    if (!email || !codigo || !nueva_password) {
      return res.status(400).json({ message: 'Los campos obligatorios están incompletos' });
    }

    if (nueva_password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (nuevo_email && nuevo_email.trim().toLowerCase() !== email.trim().toLowerCase()) {
      const existeEmail = await UserModel.findOne({ where: { email: nuevo_email.trim().toLowerCase() } });
      if (existeEmail) {
        return res.status(400).json({ message: 'El nuevo correo electrónico ya está registrado con otro usuario' });
      }
    }

    // Verificar código nuevamente
    const usuario = await UserModel.findOne({
      where: {
        email: email.trim().toLowerCase(),
        reset_code: codigo.trim(),
        reset_code_expires: { [Op.gt]: new Date() }
      }
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Código inválido o expirado. Solicita uno nuevo.' });
    }

    // Preparar actualizaciones
    const updates = {
      password: await bcrypt.hash(nueva_password, 10),
      reset_code: null,
      reset_code_expires: null,
    };

    // Si proporcionó un nuevo email, actualizarlo
    if (nuevo_email) {
      updates.email = nuevo_email.trim().toLowerCase();
    }

    await usuario.update(updates);

    res.json({ message: 'Datos actualizados correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.' });

  } catch (error) {
    console.error('Error en cambiar-password:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
