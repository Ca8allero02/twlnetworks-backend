const router = require('express').Router();
const { apply } = require('../controllers/desempacados.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { applicationLimiter } = require('../middlewares/rateLimit.middleware');

router.post('/apply', applicationLimiter, verifyToken, apply); // requiere login

module.exports = router;