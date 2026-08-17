const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * GET /api/admin/users
 * Query: ?role=
 */
const listUsers = (req, res, next) => {
    try {
        const { role } = req.query;
        let query = 'SELECT id, email, full_name, role, hospital_id, warehouse_id, vendor_id, is_active, created_at, last_login FROM users WHERE 1=1';
        const params = [];
        if (role) { query += ' AND role = ?'; params.push(role.toUpperCase()); }
        query += ' ORDER BY created_at DESC';

        const users = db.prepare(query).all(...params);
        res.json({ status: 'success', data: users, total: users.length });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/admin/users
 * Body: { email, password, full_name, role, hospital_id?, warehouse_id?, vendor_id? }
 */
const createUser = (req, res, next) => {
    try {
        const { email, password, full_name, role, hospital_id, warehouse_id, vendor_id } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ status: 'error', message: 'email, password, and role are required.' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(409).json({ status: 'error', message: 'User with this email already exists.' });

        const id = uuidv4();
        const password_hash = bcrypt.hashSync(password, 10);

        db.prepare(
            `INSERT INTO users (id, email, password_hash, full_name, role, hospital_id, warehouse_id, vendor_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(id, email, password_hash, full_name || '', role.toUpperCase(),
            hospital_id || null, warehouse_id || null, vendor_id || null);

        res.status(201).json({ status: 'success', message: 'User created successfully.', userId: id });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/admin/users/:id
 * Body: { full_name?, role?, is_active?, hospital_id?, warehouse_id?, vendor_id? }
 */
const updateUser = (req, res, next) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });

        const { full_name, role, is_active, hospital_id, warehouse_id, vendor_id } = req.body;

        db.prepare(
            `UPDATE users SET
                full_name = ?, role = ?, is_active = ?,
                hospital_id = ?, warehouse_id = ?, vendor_id = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`
        ).run(
            full_name !== undefined ? full_name : user.full_name,
            role !== undefined ? role.toUpperCase() : user.role,
            is_active !== undefined ? (is_active ? 1 : 0) : user.is_active,
            hospital_id !== undefined ? hospital_id : user.hospital_id,
            warehouse_id !== undefined ? warehouse_id : user.warehouse_id,
            vendor_id !== undefined ? vendor_id : user.vendor_id,
            req.params.id
        );

        res.json({ status: 'success', message: 'User updated.' });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/admin/users/:id
 * Soft-delete: sets is_active = 0
 */
const deleteUser = (req, res, next) => {
    try {
        const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' });

        db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
        res.json({ status: 'success', message: 'User deactivated.' });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/vendors
 */
const listVendors = (req, res, next) => {
    try {
        const vendors = db.prepare('SELECT * FROM vendors ORDER BY name ASC').all();
        res.json({ status: 'success', data: vendors });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/admin/vendors
 * Body: { name, contact }
 */
const createVendor = (req, res, next) => {
    try {
        const { name, contact } = req.body;
        if (!name) return res.status(400).json({ status: 'error', message: 'Vendor name is required.' });

        const id = uuidv4();
        db.prepare('INSERT INTO vendors (id, name, contact) VALUES (?, ?, ?)').run(id, name, contact || null);
        const vendor = db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);
        res.status(201).json({ status: 'success', data: vendor });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/warehouses
 */
const listWarehouses = (req, res, next) => {
    try {
        const warehouses = db.prepare('SELECT * FROM warehouses ORDER BY name ASC').all();
        res.json({ status: 'success', data: warehouses });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/admin/warehouses
 */
const createWarehouse = (req, res, next) => {
    try {
        const { name, location } = req.body;
        if (!name) return res.status(400).json({ status: 'error', message: 'Warehouse name is required.' });
        const id = uuidv4();
        db.prepare('INSERT INTO warehouses (id, name, location) VALUES (?, ?, ?)').run(id, name, location || null);
        res.status(201).json({ status: 'success', data: db.prepare('SELECT * FROM warehouses WHERE id = ?').get(id) });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/hospitals
 */
const listHospitals = (req, res, next) => {
    try {
        const hospitals = db.prepare('SELECT * FROM hospitals ORDER BY name ASC').all();
        res.json({ status: 'success', data: hospitals });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/admin/hospitals
 */
const createHospital = (req, res, next) => {
    try {
        const { name, location } = req.body;
        if (!name) return res.status(400).json({ status: 'error', message: 'Hospital name is required.' });
        const id = uuidv4();
        db.prepare('INSERT INTO hospitals (id, name, location) VALUES (?, ?, ?)').run(id, name, location || null);
        res.status(201).json({ status: 'success', data: db.prepare('SELECT * FROM hospitals WHERE id = ?').get(id) });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/admin/system-settings (placeholder)
 */
const getSystemSettings = (req, res) => {
    res.json({
        status: 'success',
        data: {
            app_name: 'Drug Inventory Management System',
            version: '1.0.0',
            low_stock_threshold: 50,
            expiry_warning_days: 30,
            critical_expiry_days: 7
        }
    });
};

module.exports = {
    listUsers, createUser, updateUser, deleteUser,
    listVendors, createVendor,
    listWarehouses, createWarehouse,
    listHospitals, createHospital,
    getSystemSettings
};
