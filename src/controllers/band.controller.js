const db = require('../config/db');

// ── Información de la banda con sus integrantes ───────────────
const getBandInfo = async (req, res) => {
  try {
    const [band] = await db.query(
      `SELECT b.id, b.name, b.origin, b.genre,
              ml.name AS label, ml.description AS label_description
       FROM bands b
       LEFT JOIN music_labels ml ON b.label_id = ml.id
       WHERE b.id = 1`
    );

    if (band.length === 0) {
      return res.status(404).json({ error: 'Banda no encontrada' });
    }

    const [members] = await db.query(
      'SELECT id, name, role FROM band_members WHERE band_id = 1 ORDER BY id'
    );

    return res.json({ ...band[0], members });

  } catch (err) {
    console.error('Error en getBandInfo:', err);
    return res.status(500).json({ error: 'Error al obtener información de la banda' });
  }
};

// ── Información de Golden Feather Studios ────────────────────
const getLabelInfo = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, description FROM music_labels WHERE id = 1'
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Productora no encontrada' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error en getLabelInfo:', err);
    return res.status(500).json({ error: 'Error al obtener información de la productora' });
  }
};

module.exports = { getBandInfo, getLabelInfo };
