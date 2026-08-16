const express = require('express');
const router = express.Router();

router.post('/', (req, res) => res.json({ message: 'Create shipment endpoint' }));
router.get('/:id', (req, res) => res.json({ message: 'Get shipment detail endpoint' }));
router.get('/:id/tracking', (req, res) => res.json({ message: 'Get shipment tracking endpoint' }));
router.put('/:id/pod', (req, res) => res.json({ message: 'Submit POD endpoint' }));
router.post('/:id/pod-photo', (req, res) => res.json({ message: 'Upload POD photo endpoint' }));

module.exports = router;
