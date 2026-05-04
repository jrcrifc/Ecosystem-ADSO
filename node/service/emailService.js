import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
      },
    });
  }

  /**
   * Envía un correo electrónico
   * @param {string} to - Destinatario
   * @param {string} subject - Asunto
   * @param {string} text - Contenido en texto plano
   * @param {string} html - Contenido en HTML (opcional)
   */
  async sendEmail(to, subject, text, html) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Nodemailer: No hay credenciales configuradas. Saltando envío.");
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Ecosystem SENA" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log("📧 Correo enviado: %s", info.messageId);
    } catch (error) {
      console.error("❌ Error al enviar correo:", error);
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
}

export default new EmailService();
