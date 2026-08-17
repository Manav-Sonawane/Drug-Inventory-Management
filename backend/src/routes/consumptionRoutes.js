const express = require('express');
const router = express.Router();
const { logConsumption, getHospitalConsumption, getConsumptionTrends } = require('../controllers/consumptionController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/log', authenticate, validate(schemas.logConsumption), logConsumption);
router.get('/hospital/:hospitalId', authenticate, getHospitalConsumption);
router.get('/trends', authenticate, getConsumptionTrends);

module.exports = router;
