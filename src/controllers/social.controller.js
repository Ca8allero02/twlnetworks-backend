const db = require('../config/db');

// ── Obtener enlaces sociales por entidad ──────────────────────
// entity_type: 'network' | 'band' | 'program' | 'label'
// entity_id: id del registro (NULL para 'network')
const getByEntity = async (req, res) => {
  const { entity_type, entity_id } = req.query;

  if (!entity_type) {
    return res.status(400).json({ error: 'entity_type es requerido' });
  }

  try {
    let query, params;

    if (entity_type === 'network') {
      query = `SELECT id, platform, url FROM social_links WHERE entity_type = 'network'`;
      params = [];
    } else {
      if (!entity_id) {
        return res.status(400).json({ error: 'entity_id es requerido para este entity_type' });
      }
      query = `SELECT id, platform, url FROM social_links WHERE entity_type = ? AND entity_id = ?`;
      params = [entity_type, entity_id];
    }

    const [rows] = await db.query(query, params);
    return res.json(rows);

  } catch (err) {
    console.error('Error en getByEntity:', err);
    return res.status(500).json({ error: 'Error al obtener redes sociales' });
  }
};

module.exports = { getByEntity };
