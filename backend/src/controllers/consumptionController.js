const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * POST /api/consumption/log
 * Body: { hospital_id, batch_id, quantity, ward, department, notes, consumed_date }
 */
const logConsumption = (req, res, next) => {
    try {
        const { hospital_id, batch_id, quantity, ward, department, notes, consumed_date } = req.body;
        if (!hospital_id || !batch_id || !quantity) {
            return res.status(400).json({ status: 'error', message: 'hospital_id, batch_id, and quantity are required.' });
        }

        const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batch_id);
        if (!batch) return res.status(404).json({ status: 'error', message: 'Batch not found.' });
        if (batch.current_qty < quantity) {
            return res.status(400).json({
                status: 'error',
                message: `Insufficient stock. Available: ${batch.current_qty}, Requested: ${quantity}`
            });
        }

        const doLog = db.transaction(() => {
            const id = uuidv4();
            db.prepare(
                `INSERT INTO consumption (id, hospital_id, batch_id, quantity, consumed_date, ward, department, logged_by, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(id, hospital_id, batch_id, quantity,
                consumed_date || new Date().toISOString().split('T')[0],
                ward || null, department || null, req.user?.id || null, notes || null);

            // Deduct stock from batch
            db.prepare('UPDATE batches SET current_qty = current_qty - ? WHERE id = ?').run(quantity, batch_id);

            db.prepare(
                `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values, reason)
                 VALUES (?, 'batch', ?, 'UPDATE', ?, ?, ?)`
            ).run(uuidv4(), batch_id, req.user?.id || null,
                JSON.stringify({ deducted: quantity, ward }),
                `Consumption logged for ${ward || department || 'hospital'}`);

            return id;
        });

        const consumptionId = doLog();
        const record = db.prepare(`
            SELECT c.*, b.batch_number, d.name as drug_name, h.name as hospital_name
            FROM consumption c
            JOIN batches b ON c.batch_id = b.id
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN hospitals h ON c.hospital_id = h.id
            WHERE c.id = ?
        `).get(consumptionId);

        res.status(201).json({ status: 'success', data: record });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/consumption/hospital/:hospitalId
 * Query: ?limit=, ?offset=
 */
const getHospitalConsumption = (req, res, next) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const records = db.prepare(`
            SELECT c.*, b.batch_number, b.expiry_date,
                   d.name as drug_name, d.category,
                   h.name as hospital_name,
                   u.full_name as logged_by_name
            FROM consumption c
            JOIN batches b ON c.batch_id = b.id
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN hospitals h ON c.hospital_id = h.id
            LEFT JOIN users u ON c.logged_by = u.id
            WHERE c.hospital_id = ?
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?
        `).all(req.params.hospitalId, Number(limit), Number(offset));

        const total = db.prepare('SELECT COUNT(*) as count FROM consumption WHERE hospital_id = ?')
            .get(req.params.hospitalId).count;

        res.json({ status: 'success', data: records, total, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/consumption/trends
 * Query: ?days=30, ?hospital_id=
 */
const getConsumptionTrends = (req, res, next) => {
    try {
        const { days = 30, hospital_id } = req.query;
        let query = `
            SELECT
                d.name as drug_name, d.category,
                SUM(c.quantity) as total_consumed,
                COUNT(*) as log_count,
                AVG(c.quantity) as avg_per_log,
                strftime('%Y-%m', c.consumed_date) as month
            FROM consumption c
            JOIN batches b ON c.batch_id = b.id
            JOIN drugs d ON b.drug_id = d.id
            WHERE c.consumed_date >= DATE('now', ?)
        `;
        const params = [`-${days} days`];

        if (hospital_id) { query += ' AND c.hospital_id = ?'; params.push(hospital_id); }
        query += ' GROUP BY d.id, month ORDER BY total_consumed DESC';

        const trends = db.prepare(query).all(...params);
        res.json({ status: 'success', data: trends });
    } catch (err) {
        next(err);
    }
};

module.exports = { logConsumption, getHospitalConsumption, getConsumptionTrends };
