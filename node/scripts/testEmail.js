// ============================================================
// 📧 SCRIPT DE PRUEBA DE ENVÍO DE CORREOS SMTP (testEmail.js)
// Este script verifica la conexión SMTP con el servidor de correo configurado
// en node/.env, intentando autenticar las credenciales y enviar un correo de prueba.
// Ejecución:
//   node node/scripts/testEmail.js [correo_destino_opcional]
// ============================================================

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function test() {
  const destino = process.argv[2] || process.env.EMAIL_USER;
  console.log('--- Probando Configuración de Email (SMTP) ---');
  console.log('Emisor (EMAIL_USER):', process.env.EMAIL_USER);
  console.log('Servidor (EMAIL_HOST):', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('Puerto (EMAIL_PORT):', process.env.EMAIL_PORT || '587');
  console.log('Destinatario de prueba:', destino);
  
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('tu_correo') || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('tu_contraseña')) {
    console.error('\n❌ AVISO: Aún no has descomentado y configurado EMAIL_USER y EMAIL_PASS en el archivo node/.env');
    console.log('👉 Abre node/.env y configura:');
    console.log('   EMAIL_HOST=smtp.gmail.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_USER=tu_correo@gmail.com');
    console.log('   EMAIL_PASS=tu_contraseña_de_aplicacion_de_16_letras');
    console.log('   FRONTEND_URL=http://localhost:5173');
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
    console.log('⏳ Intentando conectar con SMTP...');
    await transporter.verify();
    console.log('✅ CONEXIÓN EXITOSA: El servidor SMTP aceptó tus credenciales.');
    
    console.log(`⏳ Enviando correo de prueba a ${destino}...`);
    await transporter.sendMail({
      from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER}>`,
      to: destino,
      subject: '🧪 Prueba de Correo - Ecosystem ADSO',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #dbeafe; border-radius: 12px;">
          <h2 style="color: #0077B6;">¡Conexión de Correo Exitosa!</h2>
          <p>El servidor de correos de <strong>Ecosystem ADSO</strong> está configurado correctamente.</p>
          <ul>
            <li>Recuperación de contraseña (Olvidé contraseña)</li>
            <li>Notificación automática de devolución e ingreso a revisión técnica</li>
            <li>Notificación automática del resultado de revisión del estado del equipo</li>
          </ul>
        </div>
      `
    });
    console.log('📧 CORREO ENVIADO EXITOSAMENTE: Revisa la bandeja de entrada (y carpeta de Spam).');
  } catch (error) {
    console.error('❌ ERROR AL ENVIAR:', error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SUGERENCIA: Tu correo o contraseña de aplicación son incorrectos.');
      console.log('Recuerda que en Gmail debes generar una "Contraseña de Aplicación" de 16 letras (Seguridad -> Verificación en 2 pasos -> Contraseñas de aplicaciones).');
    }
  }
}

test();
