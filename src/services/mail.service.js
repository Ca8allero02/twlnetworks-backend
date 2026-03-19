const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ── Enviar correo de nueva postulación Chickboxing ────────────
const sendChickboxingApplication = async (data) => {
  const { userName, userEmail, chickenName, backstory, description } = data;

  await transporter.sendMail({
    from: `"TWL Networks" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_FROM,
    subject: `🐔 Nueva postulación Chickboxing: ${chickenName}`,
    html: `
      <h2>Nueva postulación - Chickboxing Championship</h2>
      <p><strong>Usuario:</strong> ${userName} (${userEmail})</p>
      <hr>
      <p><strong>Nombre del pollo:</strong> ${chickenName}</p>
      <p><strong>Historia de fondo:</strong><br>${backstory}</p>
      <p><strong>Descripción:</strong><br>${description}</p>
    `
  });
};

// ── Enviar correo de nueva postulación Desempacados ───────────
const sendDesempacadosApplication = async (data) => {
  const { fullName, email, socialLinks, motivation } = data;

  await transporter.sendMail({
    from: `"TWL Networks" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_FROM,
    subject: `🎙️ Nueva postulación Desempacados: ${fullName}`,
    html: `
      <h2>Nueva postulación - Desempacados</h2>
      <p><strong>Nombre completo:</strong> ${fullName}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Redes sociales:</strong><br>${socialLinks || 'No especificadas'}</p>
      <p><strong>Motivo de postulación:</strong><br>${motivation}</p>
    `
  });
};

module.exports = { sendChickboxingApplication, sendDesempacadosApplication };
