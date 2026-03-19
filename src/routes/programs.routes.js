const router = require('express').Router();
const { getAll, getById, getContent } = require('../controllers/programs.controller');

router.get('/',              getAll);
router.get('/:id',           getById);
router.get('/:id/content',   getContent);

module.exports = router;
