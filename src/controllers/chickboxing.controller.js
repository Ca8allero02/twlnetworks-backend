const db = require('../config/db');
const { sendChickboxingApplication } = require('../services/mail.service');

// ── Listar campeones con sus estadísticas ─────────────────────
const getChampions = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.season, c.image_url,
              s.wins, s.losses, s.knockouts
       FROM chickboxing_champions c
       LEFT JOIN chickboxing_stats s ON c.id = s.champion_id
       ORDER BY c.season DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error en getChampions:', err);
    return res.status(500).json({ error: 'Error al obtener campeones' });
  }
};

// ── Obtener un campeón por ID ─────────────────────────────────
const getChampionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.season, c.image_url,
              s.wins, s.losses, s.knockouts
       FROM chickboxing_champions c
       LEFT JOIN chickboxing_stats s ON c.id = s.champion_id
       WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Campeón no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error en getChampionById:', err);
    return res.status(500).json({ error: 'Error al obtener campeón' });
  }
};

// ── Postular un pollo (solo usuarios autenticados) ────────────
const applyChicken = async (req, res) => {
  const { name, backstory, description, image_url } = req.body;
  const userId = req.user.id;

  if (!name || !backstory || !description) {
    return res.status(400).json({ error: 'Nombre, historia y descripción son requeridos' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear registro en applications (program_id=1 = Chickboxing)
    const [appResult] = await conn.query(
      'INSERT INTO applications (user_id, program_id) VALUES (?, 1)',
      [userId]
    );
    const applicationId = appResult.insertId;

    // 2. Crear registro del pollo
    await conn.query(
      `INSERT INTO chickboxing_chickens (application_id, name, backstory, description, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [applicationId, name, backstory, description, image_url || null]
    );

    await conn.commit();

    // 3. Enviar correo (no bloquea la respuesta)
    sendChickboxingApplication({
      userName: req.user.name,
      userEmail: req.user.email,
      chickenName: name,
      backstory,
      description
    }).catch(err => console.error('Error enviando correo Chickboxing:', err));

    return res.status(201).json({ message: 'Postulación enviada exitosamente' });

  } catch (err) {
    await conn.rollback();
    console.error('Error en applyChicken:', err);
    return res.status(500).json({ error: 'Error al enviar postulación' });
  } finally {
    conn.release();
  }
};

module.exports = { getChampions, getChampionById, applyChicken };
