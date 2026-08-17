const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
        }

        // Update last login timestamp
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password_hash, ...safeUser } = user;
        res.json({ status: 'success', token, user: safeUser });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/logout
 * (Client should discard the token; no server-side blacklist for simplicity)
 */
const logout = (req, res) => {
    res.json({ status: 'success', message: 'Logged out successfully.' });
};

/**
 * GET /api/auth/me
 * Returns current user from JWT
 */
const me = (req, res, next) => {
    try {
        const user = db.prepare(
            'SELECT id, email, full_name, role, hospital_id, warehouse_id, vendor_id, is_active, created_at, last_login FROM users WHERE id = ?'
        ).get(req.user.id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found.' });
        }
        res.json({ status: 'success', user });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/register (Admin only — seed first admin via script)
 * Body: { email, password, full_name, role }
 */
const register = (req, res, next) => {
    try {
        const { email, password, full_name, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ status: 'error', message: 'email, password, and role are required.' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ status: 'error', message: 'User with this email already exists.' });
        }

        const password_hash = bcrypt.hashSync(password, 10);
        const id = uuidv4();

        db.prepare(
            'INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)'
        ).run(id, email, password_hash, full_name || '', role.toUpperCase());

        res.status(201).json({ status: 'success', message: 'User created.', userId: id });
    } catch (err) {
        next(err);
    }
};

module.exports = { login, logout, me, register };
