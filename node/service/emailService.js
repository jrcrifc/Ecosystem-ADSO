// Servicio de email (placeholder - configurar credenciales en .env para activar)
import nodemailer from 'nodemailer';

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailService {
  // Notifica a un admin cuando un nuevo usuario se registra
  async notifyAdminNewUser(adminEmail, userData) {
    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu_correo@gmail.com') {
        console.log('📧 Email no configurado - Notificación de nuevo usuario omitida');
        return;
      }
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: '🆕 Nuevo usuario registrado en Ecosystem',
        html: `<p>Se ha registrado un nuevo usuario:</p>
               <p><strong>Nombre:</strong> ${userData.nombres_apellidos}</p>
               <p><strong>Email:</strong> ${userData.email}</p>
               <p><strong>Rol:</strong> ${userData.rol}</p>`
      });
    } catch (error) {
      console.error('❌ Error al enviar email de notificación:', error.message);
    }
  }

  // Envía email de aprobación al usuario
  async sendAprovalEmail(userEmail, nombre) {
    try {
      if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu_correo@gmail.com') {
        console.log('📧 Email no configurado - Notificación de aprobación omitida');
        return;
      }
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: '✅ Tu cuenta en Ecosystem ha sido aprobada',
        html: `<p>Hola <strong>${nombre}</strong>,</p>
               <p>Tu cuenta ha sido aprobada. Ya puedes iniciar sesión en el sistema.</p>`
      });
    } catch (error) {
      console.error('❌ Error al enviar email de aprobación:', error.message);
    }
  }
}

export default new EmailService();
