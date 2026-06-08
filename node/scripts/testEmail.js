// ============================================================
// 📧 SCRIPT DE PRUEBA DE ENVÍO DE CORREOS SMTP (testEmail.js)
// Este script verifica la conexión SMTP con el servidor de correo configurado
// en el archivo .env, intentando autenticar las credenciales y enviar un
// mensaje de correo de prueba al mismo emisor.
// Útil para diagnosticar problemas con el servicio Nodemailer de recuperación.
// Ejecución:
//   node scripts/testEmail.js
// ============================================================

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Mapear directorio absoluto al .env de la raíz del proyecto
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function test() {
  console.log('--- Probando Configuración de Email ---');
  console.log('Usuario:', process.env.EMAIL_USER);
  console.log('Servidor:', process.env.EMAIL_HOST);
  console.log('Puerto:', process.env.EMAIL_PORT);
  
  // Validar si es el correo por defecto de plantilla
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('tu_correo')) {
    console.error('❌ ERROR: No has configurado tu correo real en el archivo .env');
    return;
  }

  // Configurar transportador de correo SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('⏳ Intentando conectar con SMTP...');
    // Verificar handshake y autenticación de credenciales
    await transporter.verify();
    console.log('✅ CONEXIÓN EXITOSA: El servidor de correo aceptó tus credenciales.');
    
    console.log('⏳ Enviando correo de prueba...');
    await transporter.sendMail({
      from: `"Prueba Ecosystem" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Autoresolución al mismo correo para prueba
      subject: '🧪 Prueba de Conexión Exitosa',
      text: 'Si recibes este correo, ¡la configuración de recuperación de contraseña ya funciona!'
    });
    console.log('📧 CORREO ENVIADO: Revisa tu bandeja de entrada (y la carpeta de Spam).');
  } catch (error) {
    console.error('❌ ERROR AL ENVIAR:', error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SUGERENCIA: Tu correo o contraseña de aplicación son incorrectos.');
      console.log('Recuerda que debes usar una "Contraseña de Aplicación" de 16 letras de Gmail, no tu contraseña normal.');
    }
  }
}

test();
