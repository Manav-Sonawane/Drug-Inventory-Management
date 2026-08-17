const express = require('express');
const router = express.Router();
const { getDashboardKPIs, getStockoutFrequency, getVendorPerformance, getExpiryWaste, getProcurementEfficiency } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.get('/dashboard', authenticate, getDashboardKPIs);
router.get('/stockout-frequency', authenticate, getStockoutFrequency);
router.get('/vendor-performance', authenticate, getVendorPerformance);
router.get('/expiry-waste', authenticate, getExpiryWaste);
router.get('/procurement-efficiency', authenticate, getProcurementEfficiency);

module.exports = router;
