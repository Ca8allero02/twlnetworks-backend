const db = require('../config/db');

// ── Listar todos los programas ────────────────────────────────
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.description,
              GROUP_CONCAT(h.name SEPARATOR ', ') AS hosts
       FROM programs p
       LEFT JOIN program_hosts ph ON p.id = ph.program_id
       LEFT JOIN hosts h ON ph.host_id = h.id
       GROUP BY p.id`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error en getAll programs:', err);
    return res.status(500).json({ error: 'Error al obtener programas' });
  }
};

// ── Obtener un programa por ID ────────────────────────────────
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.description,
              GROUP_CONCAT(h.name SEPARATOR ', ') AS hosts
       FROM programs p
       LEFT JOIN program_hosts ph ON p.id = ph.program_id
       LEFT JOIN hosts h ON ph.host_id = h.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Programa no encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error en getById program:', err);
    return res.status(500).json({ error: 'Error al obtener programa' });
  }
};

// ── Obtener contenido (episodios/clips) de un programa ────────
const getContent = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT id, type, title, description, media_url, thumbnail_url, published_at
       FROM program_content
       WHERE program_id = ?
       ORDER BY published_at DESC`,
      [id]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error en getContent:', err);
    return res.status(500).json({ error: 'Error al obtener contenido' });
  }
};

module.exports = { getAll, getById, getContent };
