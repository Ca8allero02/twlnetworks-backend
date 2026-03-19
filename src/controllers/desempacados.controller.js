const db = require('../config/db');
const { sendDesempacadosApplication } = require('../services/mail.service');

// ── Postular a Desempacados (solo usuarios autenticados) ──────
const apply = async (req, res) => {
  const { full_name, email, social_links, motivation } = req.body;
  const userId = req.user.id;

  if (!full_name || !email || !motivation) {
    return res.status(400).json({ error: 'Nombre, email y motivo son requeridos' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear registro en applications (program_id=2 = Desempacados)
    const [appResult] = await conn.query(
      'INSERT INTO applications (user_id, program_id) VALUES (?, 2)',
      [userId]
    );
    const applicationId = appResult.insertId;

    // 2. Crear registro de la postulación
    await conn.query(
      `INSERT INTO desempacados_applications
         (application_id, full_name, email, social_links, motivation)
       VALUES (?, ?, ?, ?, ?)`,
      [applicationId, full_name, email, social_links || null, motivation]
    );

    await conn.commit();

    // 3. Enviar correo
    sendDesempacadosApplication({ fullName: full_name, email, socialLinks: social_links, motivation })
      .catch(err => console.error('Error enviando correo Desempacados:', err));

    return res.status(201).json({ message: 'Postulación enviada exitosamente' });

  } catch (err) {
    await conn.rollback();
    console.error('Error en apply Desempacados:', err);
    return res.status(500).json({ error: 'Error al enviar postulación' });
  } finally {
    conn.release();
  }
};

module.exports = { apply };
