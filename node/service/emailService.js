// ============================================================
// 📧 SERVICIO DE CORREOS ELECTRÓNICOS (EmailService)
// Maneja el envío de correos electrónicos mediante Nodemailer (SMTP):
// 1. Recuperación de contraseña (verificando el correo del usuario/instructor)
// 2. Confirmación de devolución de equipo e ingreso automático a revisión
// 3. Resultado de la revisión técnica del equipo (disponible, mantenimiento, inactivo, individual o múltiple)
// 4. Alerta de préstamo de equipo vencido
// ============================================================

import nodemailer from 'nodemailer';

class EmailService {

  tieneCredencialesConfiguradas() {
    return Boolean(
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      !process.env.EMAIL_USER.includes('tu_correo') &&
      !process.env.EMAIL_PASS.includes('tu_contraseña')
    );
  }

  getTransportador() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''),
      }
    });
  }

  // 1. Correo de restablecimiento de contraseña
  async sendPasswordResetEmail(email, tokenForPassword) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${tokenForPassword}`;

    if (!this.tieneCredencialesConfiguradas()) {
      console.log(`[EmailService - MODO SIMULACIÓN] Solicitud de recuperación de contraseña para: ${email}`);
      console.log(`[EmailService - ENLACE DE RECUPERACIÓN]: ${resetUrl}`);
      return { simulated: true, resetUrl };
    }

    const transporter = this.getTransportador();

    const mailOptions = {
      from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Restablecer contraseña - Ecosystem ADSO",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #dbeafe; border-radius: 16px; background: #ffffff;">
          <h2 style="color: #0077B6; margin-top: 0;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Recibimos una solicitud para restablecer la contraseña asociada al correo <strong>${email}</strong> en la plataforma <strong>Ecosystem</strong>.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #0077B6, #023E8A); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 99px; font-weight: bold; display: inline-block;">
              Restablecer mi contraseña
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">⏳ Este enlace es válido por <strong>15 minutos</strong>.</p>
          <p style="font-size: 13px; color: #64748b;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Correo de recuperación enviado a ${email}`);
    return info;
  }

  // 2. Correo de alerta por préstamo vencido
  async sendOverdueReturnAlert(email, userName, solicitudId, equiposTexto = '') {
    if (!this.tieneCredencialesConfiguradas()) {
      console.log(`[EmailService - MODO SIMULACIÓN] Alerta de préstamo vencido enviada a ${email} (${userName}) - Solicitud #${solicitudId}`);
      return true;
    }

    const transporter = this.getTransportador();
    const detalleEquiposHtml = equiposTexto
      ? `<p><strong>Equipo(s) pendiente(s) por devolver:</strong> ${equiposTexto}</p>`
      : '';

    const mailOptions = {
      from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `⚠️ Aviso: Préstamo de equipo vencido (Solicitud #${solicitudId})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: #fff5f5;">
          <h2 style="color: #dc2626; margin-top: 0;">Alerta de Devolución de Equipo</h2>
          <p>Hola <b>${userName}</b>,</p>
          <p>Te recordamos que el plazo de devolución de tu solicitud de préstamo (<strong>#${solicitudId}</strong>) se encuentra vencido y aún no se registra la entrega en el sistema.</p>
          ${detalleEquiposHtml}
          <p>Por favor, acércate al Laboratorio Ambiental para devolver el(los) equipo(s) lo más pronto posible.</p>
          <p>Si ya realizaste la devolución, comunícate con el administrador del laboratorio.</p>
          <hr style="border: none; border-top: 1px solid #fecaca; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
        </div>
      `
    };
    return await transporter.sendMail(mailOptions);
  }

  // 3. Correo automático al instructor cuando devuelve el equipo y la solicitud pasa a Entregado (En Revisión)
  async sendDevolucionEnRevisionEmail(email, userName, equiposNombres, solicitudId) {
    try {
      const listaEquipos = Array.isArray(equiposNombres) ? equiposNombres.join(', ') : equiposNombres;

      if (!this.tieneCredencialesConfiguradas()) {
        console.log(`[EmailService - MODO SIMULACIÓN] Correo de devolución y revisión automática a ${email} (${userName}) - Solicitud #${solicitudId} - Equipos: ${listaEquipos}`);
        return true;
      }

      const transporter = this.getTransportador();

      const mailOptions = {
        from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER || 'soporte@ecosystem.com'}>`,
        to: email,
        subject: `🔬 Solicitud #${solicitudId} en Entregado (En Revisión): Equipo(s) en Revisión Técnica`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #d8b4fe; border-radius: 12px; background: #faf5ff;">
            <h2 style="color: #7c3aed; margin-top: 0;">Estado Actualizado: Entregado (En Revisión)</h2>
            <p>Hola <b>${userName}</b>,</p>
            <p>Te informamos que el estado de tu solicitud <strong>#${solicitudId}</strong> cambió a <strong style="color: #7c3aed;">Entregado (En Revisión)</strong> debido a que el(los) equipo(s) devuelto(s) ingresaron a revisión técnica en el Laboratorio Ambiental.</p>
            <p><strong>Equipo(s) en revisión:</strong> ${listaEquipos}</p>
            <p>Una vez se verifique que el(los) equipo(s) se encuentran en buen estado, la solicitud pasará automáticamente a <strong style="color: #059669;">Entregado</strong> y los equipos quedarán disponibles nuevamente. Te notificaremos por este medio y en la campanita cualquier novedad.</p>
            <hr style="border: none; border-top: 1px solid #e9d5ff; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Correo de devolución/revisión enviado a ${email} (Solicitud #${solicitudId})`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Error enviando correo de devolución a ${email}:`, error?.message);
      return false;
    }
  }

  // 4. Correo automático al instructor con el resultado de la revisión del estado del equipo (soporta 1 o múltiples equipos en la solicitud)
  async sendNotificacionRevisionEmail(email, userName, equipoNombre, nuevoEstado, solicitudDetalle = null) {
    try {
      if (!this.tieneCredencialesConfiguradas()) {
        console.log("[EmailService - MODO SIMULACIÓN] Correo a " + email + " (" + userName + ") sobre equipo " + equipoNombre + " -> " + nuevoEstado);
        return true;
      }
      const transporter = this.getTransportador();

      const esMultiple = solicitudDetalle && Array.isArray(solicitudDetalle.equipos) && solicitudDetalle.equipos.length > 1;
      const numSolicitudTexto = solicitudDetalle?.id_solicitud ? ` (Solicitud #${solicitudDetalle.id_solicitud})` : '';

      // Si la solicitud tiene 2 o más equipos, construimos el desglose detallado de cada equipo
      let desgloseHtml = '';
      if (esMultiple) {
        const itemsHtml = solicitudDetalle.equipos.map(item => {
          let badge = '';
          if (item.estadoRevision === 'disponible') {
            badge = '<span style="color: #059669; font-weight: bold;">✅ Entregado en buen estado (Disponible)</span>';
          } else if (item.estadoRevision === 'mantenimiento') {
            badge = '<span style="color: #d97706; font-weight: bold;">🔧 En Mantenimiento (Entregado en mal estado)</span>';
          } else if (item.estadoRevision === 'inactivo') {
            badge = '<span style="color: #dc2626; font-weight: bold;">🚨 Inactivo (Daño grave - Se realizará reporte)</span>';
          } else {
            badge = '<span style="color: #7c3aed; font-weight: bold;">🔬 En revisión técnica</span>';
          }
          return `<li style="margin-bottom: 6px;"><strong>${item.nom_equipo}</strong>: ${badge}</li>`;
        }).join('');

        desgloseHtml = `
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px 18px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a; font-size: 14px;">
              📋 Estado detallado de los equipos de tu Solicitud #${solicitudDetalle.id_solicitud}:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.5;">
              ${itemsHtml}
            </ul>
          </div>
        `;
      }

      let subject = "";
      let htmlContent = "";

      if (nuevoEstado === 'disponible') {
        subject = `✅ Revisión Aprobada: ${equipoNombre} en buen estado${numSolicitudTexto}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #bbf7d0; border-radius: 12px; background: #f0fdf4;">
            <h2 style="color: #059669; margin-top: 0;">Entrega de Equipo Aprobada${numSolicitudTexto}</h2>
            <p>Hola <b>${userName}</b>,</p>
            <p>Te informamos que la revisión técnica del equipo <strong>${equipoNombre}</strong> que devolviste al Laboratorio Ambiental fue satisfactoria y se recibió en <strong>buen estado</strong>.</p>
            <p>El equipo ya se encuentra <span style="color: #059669; font-weight: bold;">DISPONIBLE</span> nuevamente en el inventario.</p>
            ${desgloseHtml}
            <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `;
      } else if (nuevoEstado === 'mantenimiento') {
        subject = `🔧 Equipo en Mantenimiento tras Revisión: ${equipoNombre}${numSolicitudTexto}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #fed7aa; border-radius: 12px; background: #fffaf5;">
            <h2 style="color: #d97706; margin-top: 0;">Novedad en Revisión: Equipo en Mantenimiento${numSolicitudTexto}</h2>
            <p>Hola <b>${userName}</b>,</p>
            <p>Te informamos que durante la revisión técnica, el equipo <strong>${equipoNombre}</strong> que entregaste pasó a estado <strong style="color: #d97706;">MANTENIMIENTO</strong> debido a que fue entregado en mal estado o presentó fallas operativas.</p>
            ${desgloseHtml}
            <p style="background: #ffedd5; padding: 12px; border-radius: 8px; color: #9a3412; font-weight: bold;">
              Por favor comunícate con el administrador o acércate al Laboratorio Ambiental para verificar la novedad del equipo entregado.
            </p>
            <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `;
      } else if (nuevoEstado === 'inactivo') {
        subject = `🚨 Urgente: Equipo Dañado / Inactivo tras Revisión - ${equipoNombre}${numSolicitudTexto}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: #fff5f5;">
            <h2 style="color: #dc2626; margin-top: 0;">Aviso Urgente: Equipo Dañado / Inactivado${numSolicitudTexto}</h2>
            <p>Hola <b>${userName}</b>,</p>
            <p>Te notificamos que el equipo <strong>${equipoNombre}</strong> que entregaste o devolviste presentó un <strong>daño grave</strong> durante la revisión técnica y ha sido colocado en estado <strong style="color: #dc2626;">INACTIVO</strong>.</p>
            ${desgloseHtml}
            <p style="background: #fee2e2; padding: 12px; border-radius: 8px; color: #991b1b; font-weight: bold;">
              Se realizará el respectivo reporte del daño. Por favor acércate de manera urgente al Laboratorio Ambiental y comunícate con el administrador.
            </p>
            <hr style="border: none; border-top: 1px solid #fecaca; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `;
      }

      const mailOptions = {
        from: '"Laboratorio Ambiental Ecosystem" <' + (process.env.EMAIL_USER || 'soporte@ecosystem.com') + '>',
        to: email,
        subject,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("[EmailService] Correo enviado a " + email + ": " + subject);
      return info;
    } catch (error) {
      console.error("[EmailService] Error enviando correo de revisión a " + email + ":", error?.message);
      return false;
    }
  }

  // 4b. Correo al administrador cuando un equipo devuelto se inactiva por daño grave
  async sendReporteDanoAdminEmail(adminEmail, instructorNombre, equipoNombre, solicitudId, solicitudDetalle = null) {
    try {
      if (!this.tieneCredencialesConfiguradas()) return true;
      const transporter = this.getTransportador();

      let desgloseHtml = '';
      if (solicitudDetalle && Array.isArray(solicitudDetalle.equipos) && solicitudDetalle.equipos.length > 1) {
        const itemsHtml = solicitudDetalle.equipos.map(item => {
          return `<li><strong>${item.nom_equipo}</strong>: ${item.estadoRevision.toUpperCase()}</li>`;
        }).join('');
        desgloseHtml = `<p><strong>Desglose de equipos de la Solicitud #${solicitudId}:</strong></p><ul>${itemsHtml}</ul>`;
      }

      const mailOptions = {
        from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `🚨 Reporte de Equipo Dañado / Inactivo: ${equipoNombre} (Solicitud #${solicitudId})`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: #fff5f5;">
            <h2 style="color: #dc2626; margin-top: 0;">Reporte de Daño Grave en Devolución (Solicitud #${solicitudId})</h2>
            <p>Se ha registrado que el equipo <strong>${equipoNombre}</strong>, devuelto por el instructor <strong>${instructorNombre}</strong>, presentó daño grave durante la revisión y pasó a estado <strong>INACTIVO</strong>.</p>
            ${desgloseHtml}
            <p>Se ha notificado al instructor por correo y en la campanita para que se acerque al Laboratorio Ambiental a formalizar el reporte correspondiente.</p>
            <hr style="border: none; border-top: 1px solid #fecaca; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `
      };
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("[EmailService] Error enviando reporte a admin:", error?.message);
      return false;
    }
  }

  // 5. Correo automático a instructores/administradores que pidieron aviso cuando un equipo termine revisión
  async sendEquipoDisponibleSuscriptorEmail(email, userName, equipoNombre) {
    try {
      if (!this.tieneCredencialesConfiguradas()) {
        console.log(`[EmailService - MODO SIMULACIÓN] Aviso de disponibilidad tras revisión a ${email} (${userName}) -> Equipo: ${equipoNombre}`);
        return true;
      }
      const transporter = this.getTransportador();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      const mailOptions = {
        from: `"Laboratorio Ambiental Ecosystem" <${process.env.EMAIL_USER || 'soporte@ecosystem.com'}>`,
        to: email,
        subject: `🔔 ¡Equipo Disponible!: ${equipoNombre} ya superó la revisión técnica`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 24px; border: 1px solid #bae6fd; border-radius: 14px; background: #f0f9ff;">
            <h2 style="color: #0077B6; margin-top: 0;">🔔 ¡El equipo que esperabas ya está disponible!</h2>
            <p>Hola <b>${userName}</b>,</p>
            <p>Solicitaste que te avisáramos cuando el equipo <strong>${equipoNombre}</strong> terminara su revisión técnica en el Laboratorio Ambiental.</p>
            <p>Te confirmamos que la revisión ha finalizado satisfactoriamente y el equipo ya se encuentra en estado <strong style="color: #059669;">DISPONIBLE</strong> para que puedas solicitarlo de inmediato.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${frontendUrl}/solicitud" style="background: linear-gradient(135deg, #0077B6, #023E8A); color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 99px; font-weight: bold; display: inline-block;">
                Ir a Solicitudes en Ecosystem
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #bae6fd; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">Sistema Ecosystem ADSO - Laboratorio Ambiental SENA</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Aviso de disponibilidad enviado a ${email} para equipo ${equipoNombre}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Error enviando aviso de disponibilidad a ${email}:`, error?.message);
      return false;
    }
  }
}

export default new EmailService();
