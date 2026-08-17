const express = require('express');
const router = express.Router();
const { listDrugs, getDrug, createDrug, updateDrug } = require('../controllers/drugController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.get('/', authenticate, listDrugs);
router.get('/:id', authenticate, getDrug);
router.post('/', authenticate, validate(schemas.createDrug), createDrug);
router.put('/:id', authenticate, validate(schemas.updateDrug), updateDrug);

module.exports = router;
