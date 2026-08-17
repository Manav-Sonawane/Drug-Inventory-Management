const express = require('express');
const router = express.Router();
const { login, logout, me, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

router.post('/login', validate(schemas.login), login);
router.post('/logout', logout);
router.post('/register', validate(schemas.register), register);
router.get('/me', authenticate, me);

module.exports = router;
