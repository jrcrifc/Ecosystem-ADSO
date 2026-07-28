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
}

export default new EmailService()
