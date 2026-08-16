const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => res.json({ message: 'Dashboard KPIs endpoint' }));
router.get('/stockout-frequency', (req, res) => res.json({ message: 'Stockout frequency endpoint' }));
router.get('/vendor-performance', (req, res) => res.json({ message: 'Vendor performance endpoint' }));
router.get('/expiry-waste', (req, res) => res.json({ message: 'Expiry waste endpoint' }));
router.get('/procurement-efficiency', (req, res) => res.json({ message: 'Procurement efficiency endpoint' }));

module.exports = router;
