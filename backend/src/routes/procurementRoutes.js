const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'List purchase orders endpoint' }));
router.get('/:id', (req, res) => res.json({ message: 'Get PO detail endpoint' }));
router.post('/', (req, res) => res.json({ message: 'Create PO endpoint' }));
router.put('/:id/approve', (req, res) => res.json({ message: 'Approve PO endpoint' }));
router.put('/:id/reject', (req, res) => res.json({ message: 'Reject PO endpoint' }));

module.exports = router;
