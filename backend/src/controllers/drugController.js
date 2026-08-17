const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * GET /api/drugs
 * Query params: ?search=, ?category=
 */
const listDrugs = (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = 'SELECT * FROM drugs WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR generic_name LIKE ? OR manufacturer LIKE ?)';
            const like = `%${search}%`;
            params.push(like, like, like);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        query += ' ORDER BY name ASC';

        const drugs = db.prepare(query).all(...params);
        res.json({ status: 'success', data: drugs });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/drugs/:id
 * Returns drug + all its batches
 */
const getDrug = (req, res, next) => {
    try {
        const drug = db.prepare('SELECT * FROM drugs WHERE id = ?').get(req.params.id);
        if (!drug) return res.status(404).json({ status: 'error', message: 'Drug not found.' });

        const batches = db.prepare(
            `SELECT b.*, w.name as warehouse_name
             FROM batches b
             LEFT JOIN warehouses w ON b.warehouse_id = w.id
             WHERE b.drug_id = ?
             ORDER BY b.expiry_date ASC`
        ).all(req.params.id);

        res.json({ status: 'success', data: { ...drug, batches } });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/drugs
 * Body: { name, generic_name, manufacturer, category, unit_price, expiry_threshold_days, temperature_sensitive, notes }
 */
const createDrug = (req, res, next) => {
    try {
        const { name, generic_name, manufacturer, category, unit_price, expiry_threshold_days, temperature_sensitive, notes } = req.body;
        if (!name) return res.status(400).json({ status: 'error', message: 'Drug name is required.' });

        const id = uuidv4();
        db.prepare(
            `INSERT INTO drugs (id, name, generic_name, manufacturer, category, unit_price, expiry_threshold_days, temperature_sensitive, notes, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(id, name, generic_name || null, manufacturer || null, category || null,
            unit_price || null, expiry_threshold_days || 30,
            temperature_sensitive ? 1 : 0, notes || null, req.user?.id || null);

        // Audit log
        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values)
             VALUES (?, 'drug', ?, 'CREATE', ?, ?)`
        ).run(uuidv4(), id, req.user?.id || null, JSON.stringify(req.body));

        const created = db.prepare('SELECT * FROM drugs WHERE id = ?').get(id);
        res.status(201).json({ status: 'success', data: created });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/drugs/:id
 */
const updateDrug = (req, res, next) => {
    try {
        const existing = db.prepare('SELECT * FROM drugs WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ status: 'error', message: 'Drug not found.' });

        const { name, generic_name, manufacturer, category, unit_price, expiry_threshold_days, temperature_sensitive, notes } = req.body;

        db.prepare(
            `UPDATE drugs SET
                name = ?, generic_name = ?, manufacturer = ?, category = ?,
                unit_price = ?, expiry_threshold_days = ?, temperature_sensitive = ?, notes = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`
        ).run(
            name || existing.name,
            generic_name !== undefined ? generic_name : existing.generic_name,
            manufacturer !== undefined ? manufacturer : existing.manufacturer,
            category !== undefined ? category : existing.category,
            unit_price !== undefined ? unit_price : existing.unit_price,
            expiry_threshold_days || existing.expiry_threshold_days,
            temperature_sensitive !== undefined ? (temperature_sensitive ? 1 : 0) : existing.temperature_sensitive,
            notes !== undefined ? notes : existing.notes,
            req.params.id
        );

        // Audit log
        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, old_values, new_values)
             VALUES (?, 'drug', ?, 'UPDATE', ?, ?, ?)`
        ).run(uuidv4(), req.params.id, req.user?.id || null, JSON.stringify(existing), JSON.stringify(req.body));

        const updated = db.prepare('SELECT * FROM drugs WHERE id = ?').get(req.params.id);
        res.json({ status: 'success', data: updated });
    } catch (err) {
        next(err);
    }
};

module.exports = { listDrugs, getDrug, createDrug, updateDrug };
