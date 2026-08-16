const express = require('express');
const router = express.Router();

router.post('/log', (req, res) => res.json({ message: 'Log consumption endpoint' }));
router.get('/hospital/:hospitalId', (req, res) => res.json({ message: 'Get consumption history endpoint' }));
router.get('/trends', (req, res) => res.json({ message: 'Get consumption trends endpoint' }));

module.exports = router;
