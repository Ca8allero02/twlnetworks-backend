const router = require('express').Router();
const { getChampions, getChampionById, applyChicken } = require('../controllers/chickboxing.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { applicationLimiter } = require('../middlewares/rateLimit.middleware');

router.get('/champions',      getChampions);
router.get('/champions/:id',  getChampionById);
router.post('/apply',         applicationLimiter, verifyToken, applyChicken); // requiere login

module.exports = router;
