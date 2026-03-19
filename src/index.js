require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { globalLimiter } = require('./middlewares/rateLimit.middleware');

// ── Middlewares globales ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(globalLimiter); // Aplica el límite global a todas las rutas

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/programs',    require('./routes/programs.routes'));
app.use('/api/chickboxing', require('./routes/chickboxing.routes'));
app.use('/api/desempacados',require('./routes/desempacados.routes'));
app.use('/api/band',        require('./routes/band.routes'));
app.use('/api/sponsors',    require('./routes/sponsors.routes'));
app.use('/api/social',      require('./routes/social.routes'));
app.use('/api/streaming',   require('./routes/streaming.routes'));
app.use('/api/admin',       require('./routes/admin.routes'));

// ── Ruta de salud ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'TWL Networks API' });
});

// ── Manejo de rutas no encontradas ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Manejo global de errores ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ──────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TWL Networks API corriendo en puerto ${PORT}`);
});
