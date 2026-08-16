const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'List drugs endpoint' }));
router.get('/:id', (req, res) => res.json({ message: 'Get drug detail endpoint' }));
router.post('/', (req, res) => res.json({ message: 'Create drug endpoint' }));
router.put('/:id', (req, res) => res.json({ message: 'Update drug endpoint' }));

module.exports = router;
