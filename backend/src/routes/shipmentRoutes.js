const express = require('express');
const router = express.Router();
const { createShipment, listShipments, getShipment, getTracking, submitPOD } = require('../controllers/shipmentController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.get('/', authenticate, listShipments);
router.post('/', authenticate, validate(schemas.createShipment), createShipment);
router.get('/:id', authenticate, getShipment);
router.get('/:id/tracking', authenticate, getTracking);
router.put('/:id/pod', authenticate, validate(schemas.submitPOD), submitPOD);

module.exports = router;
