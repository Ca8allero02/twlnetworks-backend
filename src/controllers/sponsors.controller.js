const db = require('../config/db');

// ── Listar patrocinadores globales (homepage) ─────────────────
const getGlobalSponsors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.logo_url, s.website_url
       FROM sponsors s
       JOIN program_sponsors ps ON s.id = ps.sponsor_id
       WHERE ps.scope = 'global'`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error en getGlobalSponsors:', err);
    return res.status(500).json({ error: 'Error al obtener patrocinadores' });
  }
};

// ── Listar patrocinadores de un programa específico ───────────
const getSponsorsByProgram = async (req, res) => {
  const { programId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.logo_url, s.website_url
       FROM sponsors s
       JOIN program_sponsors ps ON s.id = ps.sponsor_id
       WHERE ps.program_id = ?`,
      [programId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error en getSponsorsByProgram:', err);
    return res.status(500).json({ error: 'Error al obtener patrocinadores del programa' });
  }
};

module.exports = { getGlobalSponsors, getSponsorsByProgram };
