const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

// Rutas de autenticación con limitación de tasa
router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);
router.get('/profile',   verifyToken, getProfile);

module.exports = router;

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   verifyToken, getProfile);

module.exports = router;
