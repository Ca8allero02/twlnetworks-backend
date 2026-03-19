const router = require('express').Router();
const { getGlobalSponsors, getSponsorsByProgram } = require('../controllers/sponsors.controller');

router.get('/',                    getGlobalSponsors);
router.get('/program/:programId',  getSponsorsByProgram);

module.exports = router;
