const router = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');
const {
  createChampion, updateChampion, updateStats, deleteChampion,
  createSponsor, updateSponsor, deleteSponsor,
  createSocialLink, updateSocialLink, deleteSocialLink,
  createContent, updateContent, deleteContent,
  getApplications, deleteApplication,
  updateBandMember
} = require('../controllers/admin.controller');

// Todas las rutas del panel requieren token válido + rol admin
router.use(verifyToken, verifyAdmin);

// ── Campeones ─────────────────────────────────────────────────
router.post('/champions',              createChampion);
router.put('/champions/:id',           updateChampion);
router.put('/champions/:id/stats',     updateStats);
router.delete('/champions/:id',        deleteChampion);

// ── Patrocinadores ────────────────────────────────────────────
router.post('/sponsors',               createSponsor);
router.put('/sponsors/:id',            updateSponsor);
router.delete('/sponsors/:id',         deleteSponsor);

// ── Redes sociales ────────────────────────────────────────────
router.post('/social',                 createSocialLink);
router.put('/social/:id',              updateSocialLink);
router.delete('/social/:id',           deleteSocialLink);

// ── Contenido de programas ────────────────────────────────────
router.post('/content',                createContent);
router.put('/content/:id',             updateContent);
router.delete('/content/:id',          deleteContent);

// ── Postulaciones (solo lectura) ──────────────────────────────
router.get('/applications',            getApplications);
router.delete('/applications/:id',     deleteApplication);

// ── Banda ─────────────────────────────────────────────────────
router.put('/band/members/:id',        updateBandMember);

module.exports = router;
