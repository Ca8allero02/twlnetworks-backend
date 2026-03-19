const router = require('express').Router();
const { getStatus } = require('../controllers/streaming.controller');

router.get('/status', getStatus);

module.exports = router;
