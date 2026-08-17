const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * GET /api/purchase-orders
 * Query: ?status=, ?vendor_id=
 */
const listOrders = (req, res, next) => {
    try {
        const { status, vendor_id } = req.query;
        let query = `
            SELECT po.*,
                   v.name as vendor_name,
                   d.name as drug_name, d.category,
                   u.full_name as created_by_name,
                   a.full_name as approved_by_name
            FROM purchase_orders po
            LEFT JOIN vendors v ON po.vendor_id = v.id
            LEFT JOIN drugs d ON po.drug_id = d.id
            LEFT JOIN users u ON po.created_by = u.id
            LEFT JOIN users a ON po.approved_by = a.id
            WHERE 1=1
        `;
        const params = [];

        if (status) { query += ' AND po.status = ?'; params.push(status); }
        if (vendor_id) { query += ' AND po.vendor_id = ?'; params.push(vendor_id); }
        query += ' ORDER BY po.created_at DESC';

        const orders = db.prepare(query).all(...params);
        res.json({ status: 'success', data: orders, total: orders.length });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/purchase-orders/:id
 */
const getOrder = (req, res, next) => {
    try {
        const po = db.prepare(`
            SELECT po.*,
                   v.name as vendor_name, v.contact as vendor_contact,
                   d.name as drug_name, d.generic_name, d.unit_price,
                   u.full_name as created_by_name,
                   a.full_name as approved_by_name
            FROM purchase_orders po
            LEFT JOIN vendors v ON po.vendor_id = v.id
            LEFT JOIN drugs d ON po.drug_id = d.id
            LEFT JOIN users u ON po.created_by = u.id
            LEFT JOIN users a ON po.approved_by = a.id
            WHERE po.id = ?
        `).get(req.params.id);

        if (!po) return res.status(404).json({ status: 'error', message: 'Purchase order not found.' });

        // Fetch associated GRNs
        const grns = db.prepare('SELECT * FROM goods_receipts WHERE po_id = ?').all(req.params.id);

        res.json({ status: 'success', data: { ...po, grns } });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/purchase-orders/public/:identifier (No auth required for public receipt scanning)
 */
const getPublicOrder = (req, res, next) => {
    try {
        const { identifier } = req.params;
        const po = db.prepare(`
            SELECT po.*,
                   v.name as vendor_name, v.contact as vendor_contact,
                   d.name as drug_name, d.generic_name, d.unit_price,
                   u.full_name as created_by_name,
                   a.full_name as approved_by_name
            FROM purchase_orders po
            LEFT JOIN vendors v ON po.vendor_id = v.id
            LEFT JOIN drugs d ON po.drug_id = d.id
            LEFT JOIN users u ON po.created_by = u.id
            LEFT JOIN users a ON po.approved_by = a.id
            WHERE po.id = ? OR po.po_number = ?
        `).get(identifier, identifier);

        if (!po) return res.status(404).json({ status: 'error', message: 'Waybill order not found.' });

        res.json({ status: 'success', data: po });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/purchase-orders
 * Body: { vendor_id, drug_id, quantity, unit_price, promised_delivery_date, notes }
 */
const createOrder = (req, res, next) => {
    try {
        const { vendor_id, drug_id, quantity, unit_price, promised_delivery_date, notes } = req.body;
        if (!vendor_id || !drug_id || !quantity || !unit_price) {
            return res.status(400).json({ status: 'error', message: 'vendor_id, drug_id, quantity, unit_price are required.' });
        }

        const id = uuidv4();
        const po_number = `PO-${Date.now()}`;
        const total_cost = quantity * unit_price;

        db.prepare(
            `INSERT INTO purchase_orders (id, po_number, vendor_id, drug_id, quantity, unit_price, total_cost, promised_delivery_date, notes, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(id, po_number, vendor_id, drug_id, quantity, unit_price, total_cost,
            promised_delivery_date || null, notes || null, req.user?.id || null);

        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values)
             VALUES (?, 'po', ?, 'CREATE', ?, ?)`
        ).run(uuidv4(), id, req.user?.id || null, JSON.stringify({ po_number, vendor_id, drug_id, quantity }));

        const created = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(id);
        res.status(201).json({ status: 'success', data: created });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/purchase-orders/:id/approve
 */
const approveOrder = (req, res, next) => {
    try {
        const po = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(req.params.id);
        if (!po) return res.status(404).json({ status: 'error', message: 'Purchase order not found.' });
        if (po.status !== 'draft') {
            return res.status(400).json({ status: 'error', message: `Cannot approve a PO with status: ${po.status}` });
        }

        db.prepare(
            "UPDATE purchase_orders SET status = 'approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).run(req.user?.id || null, req.params.id);

        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, old_values, new_values)
             VALUES (?, 'po', ?, 'UPDATE', ?, ?, ?)`
        ).run(uuidv4(), req.params.id, req.user?.id || null,
            JSON.stringify({ status: 'draft' }), JSON.stringify({ status: 'approved' }));

        const updated = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(req.params.id);
        res.json({ status: 'success', message: 'Purchase order approved.', data: updated });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/purchase-orders/:id/reject
 * Body: { reason }
 */
const rejectOrder = (req, res, next) => {
    try {
        const { reason } = req.body;
        const po = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(req.params.id);
        if (!po) return res.status(404).json({ status: 'error', message: 'Purchase order not found.' });

        db.prepare(
            "UPDATE purchase_orders SET status = 'rejected', notes = ? WHERE id = ?"
        ).run(reason || 'Rejected', req.params.id);

        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, old_values, new_values, reason)
             VALUES (?, 'po', ?, 'UPDATE', ?, ?, ?, ?)`
        ).run(uuidv4(), req.params.id, req.user?.id || null,
            JSON.stringify({ status: po.status }), JSON.stringify({ status: 'rejected' }), reason || '');

        res.json({ status: 'success', message: 'Purchase order rejected.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { listOrders, getOrder, getPublicOrder, createOrder, approveOrder, rejectOrder };
