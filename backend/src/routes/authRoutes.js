const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => res.json({ message: 'Login endpoint' }));
router.post('/logout', (req, res) => res.json({ message: 'Logout endpoint' }));
router.post('/refresh-token', (req, res) => res.json({ message: 'Refresh token endpoint' }));
router.get('/me', (req, res) => res.json({ message: 'Current user endpoint' }));

module.exports = router;
