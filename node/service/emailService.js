// Servicio de email (placeholder - configurar credenciales en .env para activar)
import nodemailer from 'nodemailer';

class EmailService {

  getTransportador(){
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    })
  }


  async sendPasswordResetEmail(email, tokenForPassword) {

    const transporter = this.getTransportador();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${tokenForPassword}`;

    const mailOptions = {
      from : `"Soporte Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `<h2>Recuperacion de contraseña</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p> Este enlace vence en 15 minutos.</p>
      <p>Si no  solicitastes este cambio, ignora este correo</p>
      `
    }
    return await transporter.sendMail(mailOptions)
  }
  async sendOverdueReturnAlert(email, userName, solicitudId) {
    const transporter = this.getTransportador();
    
    const mailOptions = {
      from : `"Soporte Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Aviso: Préstamo de equipo vencido",
      html: `<h2>Alerta de Devolución de Equipo</h2>
      <p>Hola <b>${userName}</b>,</p>
      <p>Te recordamos que tu solicitud de préstamo (ID: ${solicitudId}) ha superado los 15 días límite desde la fecha de entrega.</p>
      <p>Por favor, acércate al Laboratorio Ambiental para devolver los equipos lo más pronto posible.</p>
      <p>Si ya los devolviste, por favor ignora este correo.</p>
      <br>
      <p>Atentamente,<br>El equipo de Ecosystem</p>
      `
    }
    return await transporter.sendMail(mailOptions);
  }
}

export default new EmailService()
