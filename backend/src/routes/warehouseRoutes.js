const express = require('express');
const router = express.Router();

router.post('/grn', (req, res) => res.json({ message: 'Create GRN endpoint' }));
router.get('/inventory', (req, res) => res.json({ message: 'Get inventory endpoint' }));
router.get('/batches/:batchId/traceability', (req, res) => res.json({ message: 'Batch traceability endpoint' }));
router.put('/stock-adjustment', (req, res) => res.json({ message: 'Stock adjustment endpoint' }));
router.get('/expiry-alerts', (req, res) => res.json({ message: 'Expiry alerts endpoint' }));

module.exports = router;
