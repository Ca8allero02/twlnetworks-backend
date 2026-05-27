const db = require('../config/db');

// ════════════════════════════════════════════════════════════
// CAMPEONES
// ════════════════════════════════════════════════════════════

const createChampion = async (req, res) => {
  const { name, season, image_url } = req.body;
  if (!name || !season) {
    return res.status(400).json({ error: 'Nombre y temporada son requeridos' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO chickboxing_champions (program_id, name, season, image_url) VALUES (1, ?, ?, ?)',
      [name, season, image_url || null]
    );
    // Crear estadísticas iniciales en 0
    await conn.query(
      'INSERT INTO chickboxing_stats (champion_id, wins, losses, knockouts) VALUES (?, 0, 0, 0)',
      [result.insertId]
    );

    await conn.commit();
    return res.status(201).json({ message: 'Campeón creado', id: result.insertId });
  } catch (err) {
    await conn.rollback();
    console.error('Error en createChampion:', err);
    return res.status(500).json({ error: 'Error al crear campeón' });
  } finally {
    conn.release();
  }
};

const updateChampion = async (req, res) => {
  const { id } = req.params;
  const { name, season, image_url } = req.body;
  try {
    await db.query(
      'UPDATE chickboxing_champions SET name=?, season=?, image_url=? WHERE id=?',
      [name, season, image_url || null, id]
    );
    return res.json({ message: 'Campeón actualizado' });
  } catch (err) {
    console.error('Error en updateChampion:', err);
    return res.status(500).json({ error: 'Error al actualizar campeón' });
  }
};

const updateStats = async (req, res) => {
  const { id } = req.params; // champion_id
  const { wins, losses, knockouts } = req.body;
  try {
    await db.query(
      'UPDATE chickboxing_stats SET wins=?, losses=?, knockouts=? WHERE champion_id=?',
      [wins ?? 0, losses ?? 0, knockouts ?? 0, id]
    );
    return res.json({ message: 'Estadísticas actualizadas' });
  } catch (err) {
    console.error('Error en updateStats:', err);
    return res.status(500).json({ error: 'Error al actualizar estadísticas' });
  }
};

const deleteChampion = async (req, res) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM chickboxing_stats WHERE champion_id = ?', [id]);
    await conn.query('DELETE FROM chickboxing_champions WHERE id = ?', [id]);
    await conn.commit();
    return res.json({ message: 'Campeón eliminado' });
  } catch (err) {
    await conn.rollback();
    console.error('Error en deleteChampion:', err);
    return res.status(500).json({ error: 'Error al eliminar campeón' });
  } finally {
    conn.release();
  }
};

// ════════════════════════════════════════════════════════════
// PATROCINADORES
// ════════════════════════════════════════════════════════════

const createSponsor = async (req, res) => {
  const { name, logo_url, website_url, program_id, scope } = req.body;
  if (!name) return res.status(400).json({ error: 'Nombre es requerido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO sponsors (name, logo_url, website_url) VALUES (?, ?, ?)',
      [name, logo_url || null, website_url || null]
    );
    await conn.query(
      'INSERT INTO program_sponsors (sponsor_id, program_id, scope) VALUES (?, ?, ?)',
      [result.insertId, program_id || null, scope || 'global']
    );

    await conn.commit();
    return res.status(201).json({ message: 'Patrocinador creado', id: result.insertId });
  } catch (err) {
    await conn.rollback();
    console.error('Error en createSponsor:', err);
    return res.status(500).json({ error: 'Error al crear patrocinador' });
  } finally {
    conn.release();
  }
};

const updateSponsor = async (req, res) => {
  const { id } = req.params;
  const { name, logo_url, website_url } = req.body;
  try {
    await db.query(
      'UPDATE sponsors SET name=?, logo_url=?, website_url=? WHERE id=?',
      [name, logo_url || null, website_url || null, id]
    );
    return res.json({ message: 'Patrocinador actualizado' });
  } catch (err) {
    console.error('Error en updateSponsor:', err);
    return res.status(500).json({ error: 'Error al actualizar patrocinador' });
  }
};

const deleteSponsor = async (req, res) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM program_sponsors WHERE sponsor_id = ?', [id]);
    await conn.query('DELETE FROM sponsors WHERE id = ?', [id]);
    await conn.commit();
    return res.json({ message: 'Patrocinador eliminado' });
  } catch (err) {
    await conn.rollback();
    console.error('Error en deleteSponsor:', err);
    return res.status(500).json({ error: 'Error al eliminar patrocinador' });
  } finally {
    conn.release();
  }
};

// ════════════════════════════════════════════════════════════
// REDES SOCIALES
// ════════════════════════════════════════════════════════════

const createSocialLink = async (req, res) => {
  const { entity_type, entity_id, platform, url } = req.body;
  if (!entity_type || !platform || !url) {
    return res.status(400).json({ error: 'entity_type, platform y url son requeridos' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO social_links (entity_type, entity_id, platform, url) VALUES (?, ?, ?, ?)',
      [entity_type, entity_id || null, platform, url]
    );
    return res.status(201).json({ message: 'Enlace creado', id: result.insertId });
  } catch (err) {
    console.error('Error en createSocialLink:', err);
    return res.status(500).json({ error: 'Error al crear enlace social' });
  }
};

const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { platform, url } = req.body;
  try {
    await db.query(
      'UPDATE social_links SET platform=?, url=? WHERE id=?',
      [platform, url, id]
    );
    return res.json({ message: 'Enlace actualizado' });
  } catch (err) {
    console.error('Error en updateSocialLink:', err);
    return res.status(500).json({ error: 'Error al actualizar enlace social' });
  }
};

const deleteSocialLink = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM social_links WHERE id = ?', [id]);
    return res.json({ message: 'Enlace eliminado' });
  } catch (err) {
    console.error('Error en deleteSocialLink:', err);
    return res.status(500).json({ error: 'Error al eliminar enlace social' });
  }
};

// ════════════════════════════════════════════════════════════
// CONTENIDO DE PROGRAMAS (episodios / clips)
// ════════════════════════════════════════════════════════════

const createContent = async (req, res) => {
  const { program_id, type, title, description, media_url, thumbnail_url, published_at } = req.body;
  if (!program_id || !title) {
    return res.status(400).json({ error: 'program_id y title son requeridos' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO program_content
         (program_id, type, title, description, media_url, thumbnail_url, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [program_id, type || 'episode', title, description || null,
       media_url || null, thumbnail_url || null, published_at || null]
    );
    return res.status(201).json({ message: 'Contenido creado', id: result.insertId });
  } catch (err) {
    console.error('Error en createContent:', err);
    return res.status(500).json({ error: 'Error al crear contenido' });
  }
};

const updateContent = async (req, res) => {
  const { id } = req.params;
  const { type, title, description, media_url, thumbnail_url, published_at } = req.body;
  try {
    await db.query(
      `UPDATE program_content
       SET type=?, title=?, description=?, media_url=?, thumbnail_url=?, published_at=?
       WHERE id=?`,
      [type, title, description || null, media_url || null,
       thumbnail_url || null, published_at || null, id]
    );
    return res.json({ message: 'Contenido actualizado' });
  } catch (err) {
    console.error('Error en updateContent:', err);
    return res.status(500).json({ error: 'Error al actualizar contenido' });
  }
};

const deleteContent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM program_content WHERE id = ?', [id]);
    return res.json({ message: 'Contenido eliminado' });
  } catch (err) {
    console.error('Error en deleteContent:', err);
    return res.status(500).json({ error: 'Error al eliminar contenido' });
  }
};

// ════════════════════════════════════════════════════════════
// POSTULACIONES (vista para el admin)
// ════════════════════════════════════════════════════════════

const getApplications = async (req, res) => {
  const { program_id } = req.query;
  try {
    // Base query con datos del usuario y programa
    let query = `
      SELECT 
        a.id, a.created_at, a.program_id,
        u.name AS user_name, u.email AS user_email,
        p.name AS program
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN programs p ON a.program_id = p.id
    `;
    const params = [];
    if (program_id) {
      query += ' WHERE a.program_id = ?';
      params.push(program_id);
    }
    query += ' ORDER BY a.created_at DESC';

    const [applications] = await db.query(query, params);

    // Para cada postulación, buscar el detalle según el programa
    const result = await Promise.all(applications.map(async (app) => {
      if (app.program_id === 1) {
        // Chickboxing — buscar datos del pollo
        const [chicken] = await db.query(
          'SELECT name, backstory, description, image_url FROM chickboxing_chickens WHERE application_id = ?',
          [app.id]
        );
        return { ...app, detail: chicken[0] || null }
      } else if (app.program_id === 2) {
        // Desempacados — buscar datos de la postulación
        const [desempacados] = await db.query(
          'SELECT full_name, email, social_links, motivation FROM desempacados_applications WHERE application_id = ?',
          [app.id]
        );
        return { ...app, detail: desempacados[0] || null }
      }
      return { ...app, detail: null }
    }))

    return res.json(result);
  } catch (err) {
    console.error('Error en getApplications:', err);
    return res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener program_id para saber qué tabla de detalle borrar
    const [rows] = await conn.query(
      'SELECT program_id FROM applications WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    const programId = rows[0].program_id;

    // Borrar detalle según programa
    if (programId === 1) {
      await conn.query('DELETE FROM chickboxing_chickens WHERE application_id = ?', [id]);
    } else if (programId === 2) {
      await conn.query('DELETE FROM desempacados_applications WHERE application_id = ?', [id]);
    }

    // Borrar la postulación base
    await conn.query('DELETE FROM applications WHERE id = ?', [id]);

    await conn.commit();
    return res.json({ message: 'Postulación eliminada' });
  } catch (err) {
    await conn.rollback();
    console.error('Error en deleteApplication:', err);
    return res.status(500).json({ error: 'Error al eliminar postulación' });
  } finally {
    conn.release();
  }
};

// ════════════════════════════════════════════════════════════
// BANDA - actualizar miembros
// ════════════════════════════════════════════════════════════

const updateBandMember = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    await db.query(
      'UPDATE band_members SET name=?, role=? WHERE id=?',
      [name, role, id]
    );
    return res.json({ message: 'Integrante actualizado' });
  } catch (err) {
    console.error('Error en updateBandMember:', err);
    return res.status(500).json({ error: 'Error al actualizar integrante' });
  }
};

module.exports = {
  createChampion, updateChampion, updateStats, deleteChampion,
  createSponsor, updateSponsor, deleteSponsor,
  createSocialLink, updateSocialLink, deleteSocialLink,
  createContent, updateContent, deleteContent,
  getApplications, deleteApplication,
  updateBandMember
};
