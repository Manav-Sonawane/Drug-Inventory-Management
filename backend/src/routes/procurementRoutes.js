const express = require('express');
const router = express.Router();
const { listOrders, getOrder, getPublicOrder, createOrder, approveOrder, rejectOrder } = require('../controllers/procurementController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.get('/public/:identifier', getPublicOrder);
router.get('/', authenticate, listOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, validate(schemas.createOrder), createOrder);
router.put('/:id/approve', authenticate, approveOrder);
router.put('/:id/reject', authenticate, validate(schemas.rejectOrder), rejectOrder);

module.exports = router;
