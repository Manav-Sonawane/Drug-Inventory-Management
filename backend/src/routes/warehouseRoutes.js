const express = require('express');
const router = express.Router();
const { getInventory, getExpiryAlerts, getBatchTraceability, createGRN, stockAdjustment } = require('../controllers/warehouseController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/grn', authenticate, validate(schemas.createGRN), createGRN);
router.get('/inventory', authenticate, getInventory);
router.get('/expiry-alerts', authenticate, getExpiryAlerts);
router.get('/batches/:batchId/traceability', authenticate, getBatchTraceability);
router.put('/stock-adjustment', authenticate, validate(schemas.stockAdjustment), stockAdjustment);

module.exports = router;
