import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function test() {
  console.log('--- Probando Configuración de Email ---');
  console.log('Usuario:', process.env.EMAIL_USER);
  console.log('Servidor:', process.env.EMAIL_HOST);
  console.log('Puerto:', process.env.EMAIL_PORT);
  
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('tu_correo')) {
    console.error('❌ ERROR: No has configurado tu correo real en el archivo .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('⏳ Intentando conectar con Gmail...');
    await transporter.verify();
    console.log('✅ CONEXIÓN EXITOSA: El servidor de correo aceptó tus credenciales.');
    
    console.log('⏳ Enviando correo de prueba...');
    await transporter.sendMail({
      from: `"Prueba Ecosystem" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🧪 Prueba de Conexión Exitosa',
      text: 'Si recibes este correo, ¡la configuración de recuperación de contraseña ya funciona!'
    });
    console.log('📧 CORREO ENVIADO: Revisa tu bandeja de entrada (y la carpeta de Spam).');
  } catch (error) {
    console.error('❌ ERROR AL ENVIAR:', error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SUGERENCIA: Tu correo o contraseña de aplicación son incorrectos.');
      console.log('Recuerda que debes usar una "Contraseña de Aplicación" de 16 letras, no tu contraseña normal.');
    }
  }
}

test();
