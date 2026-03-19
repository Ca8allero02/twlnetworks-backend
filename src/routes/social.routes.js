const router = require('express').Router();
const { getByEntity } = require('../controllers/social.controller');

// Ejemplos de uso:
// GET /api/social?entity_type=network
// GET /api/social?entity_type=band&entity_id=1
// GET /api/social?entity_type=program&entity_id=2
router.get('/', getByEntity);

module.exports = router;
