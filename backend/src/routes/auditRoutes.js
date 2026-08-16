const express = require('express');
const router = express.Router();

router.get('/logs', (req, res) => res.json({ message: 'Get audit logs endpoint' }));
router.get('/logs/:entityType/:entityId', (req, res) => res.json({ message: 'Get entity audit logs endpoint' }));

module.exports = router;
