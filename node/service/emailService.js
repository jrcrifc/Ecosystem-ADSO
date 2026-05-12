import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ConfigModel from "../models/configModel.js";

dotenv.config();

class EmailService {
  /**
   * Obtiene la configuración desde la base de datos con fallback al .env
   */
  async getConfig() {
    try {
      const configs = await ConfigModel.findAll();
      const configMap = {};
      configs.forEach(c => {
        configMap[c.clave] = c.valor;
      });

      return {
        user: configMap['EMAIL_USER'] || process.env.EMAIL_USER,
        pass: configMap['EMAIL_PASS'] || process.env.EMAIL_PASS,
        host: configMap['EMAIL_HOST'] || process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(configMap['EMAIL_PORT'] || process.env.EMAIL_PORT || "587")
      };
    } catch (error) {
      console.error("❌ Error al cargar config de DB:", error.message);
      return {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587")
      };
    }
  }

  /**
   * Envía un correo electrónico cargando config dinámica
   */
  async sendEmail(to, subject, text, html) {
    const config = await this.getConfig();

    if (!config.user || !config.pass || config.user.includes('tu_correo')) {
      console.warn("⚠️ EmailService: No hay credenciales válidas en DB ni .env. Saltando envío.");
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Ecosystem SENA" <${config.user}>`,
        to,
        subject,
        text,
        html,
      });
      console.log("📧 Correo enviado exitosamente (Config Dinámica): %s", info.messageId);
    } catch (error) {
      console.error("❌ Error al enviar correo dinámico:", error);
    }
  }

  /**
   * Notifica aprobación de cuenta
   */
  async sendAprovalEmail(to, name) {
    const subject = "¡Tu cuenta en Ecosystem ha sido aprobada!";
    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #0077B6;">Hola, ${name}</h2>
        <p>Nos complace informarte que tu cuenta ha sido <strong>aprobada</strong> por el administrador.</p>
        <p>Ya puedes acceder a todas las funcionalidades del Laboratorio Ambiental.</p>
        <br>
        <a href="http://localhost:5173" style="background: #0077B6; color: white; padding: 10px 20px; text-decoration: none; borderRadius: 5px;">Entrar a Ecosystem</a>
        <br><br>
        <p>Saludos,<br>Equipo Ecosystem</p>
      </div>
    `;
    await this.sendEmail(to, subject, "Tu cuenta ha sido aprobada", html);
  }

  /**
   * Notifica al administrador sobre un nuevo registro
   */
  async notifyAdminNewUser(adminEmail, userData) {
    const subject = "👤 Nuevo registro pendiente - ECOSYSTEM";
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0077B6, #023E8A); padding: 30px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px;">Nuevo Usuario Registrado</h2>
          <p style="margin: 10px 0 0; opacity: 0.9;">Un nuevo usuario requiere revisión y aprobación.</p>
        </div>
        <div style="padding: 30px; background: #ffffff; color: #334155;">
          <p style="font-size: 16px; margin-top: 0;">Hola Administrador,</p>
          <p>Se ha registrado un nuevo usuario en el sistema con los siguientes datos:</p>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Nombre:</strong></td>
                <td style="padding: 8px 0;">${userData.nombres_apellidos}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Documento:</strong></td>
                <td style="padding: 8px 0;">${userData.documento}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;">${userData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;"><strong>Rol solicitado:</strong></td>
                <td style="padding: 8px 0;"><span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${userData.rol}</span></td>
              </tr>
            </table>
          </div>

          <p>Por favor, ingresa al panel administrativo para aprobar o rechazar esta solicitud.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5173/gestion-usuarios" style="background: #0077B6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Ir a Gestión de Usuarios</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
          Este es un correo automático de ECOSYSTEM - Laboratorio Ambiental SENA.
        </div>
      </div>
    `;
    await this.sendEmail(adminEmail, subject, `Nuevo registro: ${userData.nombres_apellidos}`, html);
  }
}

export default new EmailService();
