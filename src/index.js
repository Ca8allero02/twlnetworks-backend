require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { globalLimiter } = require('./middlewares/rateLimit.middleware');

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({
  origin: [
    'https://www.twlnetworks.org',
    'https://twlnetworks.org',
    'http://localhost:5173' // para desarrollo local
  ],
  credentials: true
}));
app.use(express.json());
app.use(globalLimiter);

// ── Rutas API ─────────────────────────────────────────────────
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

// ── Servir frontend estático (build de React) ─────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── Cualquier ruta que no sea /api → devolver index.html ──────
// Esto permite que React Router maneje las rutas del cliente
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Ruta no encontrada' });
  }
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
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