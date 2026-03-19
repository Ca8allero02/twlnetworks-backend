const { getAllStreamingStatus } = require('../services/streaming.service');

// Cache simple en memoria para no saturar las APIs externas
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 60 * 1000; // 60 segundos

// ── GET /api/streaming/status ─────────────────────────────────
const getStatus = async (req, res) => {
  try {
    const now = Date.now();

    // Devolver caché si todavía es válido
    if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
      return res.json({ ...cache.data, cached: true });
    }

    const platforms = await getAllStreamingStatus();
    const anyLive   = platforms.some(p => p.live);

    const result = {
      anyLive,
      platforms,
      checkedAt: new Date().toISOString(),
      cached: false
    };

    // Guardar en caché
    cache = { data: result, timestamp: now };

    return res.json(result);

  } catch (err) {
    console.error('Error en streaming status:', err);
    return res.status(500).json({ error: 'Error al verificar estado de streaming' });
  }
};

module.exports = { getStatus };
