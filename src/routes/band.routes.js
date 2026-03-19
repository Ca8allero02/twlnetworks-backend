const router = require('express').Router();
const { getBandInfo, getLabelInfo } = require('../controllers/band.controller');

router.get('/kanat',   getBandInfo);
router.get('/label',   getLabelInfo);

module.exports = router;
