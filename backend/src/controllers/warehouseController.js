const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * GET /api/warehouse/inventory
 * Returns all batches joined with drug and warehouse info
 * Query: ?warehouse_id=, ?status=, ?search=
 */
const getInventory = (req, res, next) => {
    try {
        const { warehouse_id, status, search } = req.query;
        let query = `
            SELECT
                b.id, b.batch_number, b.manufacture_date, b.expiry_date,
                b.location_bin, b.current_qty, b.status,
                d.id as drug_id, d.name as drug_name, d.generic_name,
                d.category, d.unit_price, d.temperature_sensitive,
                d.expiry_threshold_days,
                w.id as warehouse_id, w.name as warehouse_name, w.location as warehouse_location,
                CAST((julianday(b.expiry_date) - julianday('now')) AS INTEGER) as days_to_expiry
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN warehouses w ON b.warehouse_id = w.id
            WHERE 1=1
        `;
        const params = [];

        if (warehouse_id) { query += ' AND b.warehouse_id = ?'; params.push(warehouse_id); }
        if (status) { query += ' AND b.status = ?'; params.push(status); }
        if (search) {
            query += ' AND (d.name LIKE ? OR b.batch_number LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        query += ' ORDER BY b.expiry_date ASC';

        const inventory = db.prepare(query).all(...params);
        res.json({ status: 'success', data: inventory, total: inventory.length });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/warehouse/expiry-alerts
 * Returns batches expiring within their threshold or within 30 days
 */
const getExpiryAlerts = (req, res, next) => {
    try {
        const alerts = db.prepare(`
            SELECT
                b.id, b.batch_number, b.expiry_date, b.current_qty, b.location_bin, b.status,
                d.name as drug_name, d.expiry_threshold_days,
                w.name as warehouse_name,
                CAST((julianday(b.expiry_date) - julianday('now')) AS INTEGER) as days_to_expiry,
                CASE
                    WHEN julianday(b.expiry_date) - julianday('now') <= 7 THEN 'critical'
                    WHEN julianday(b.expiry_date) - julianday('now') <= 30 THEN 'warning'
                    ELSE 'normal'
                END as severity
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN warehouses w ON b.warehouse_id = w.id
            WHERE b.status = 'in_stock'
              AND julianday(b.expiry_date) - julianday('now') <= d.expiry_threshold_days
            ORDER BY days_to_expiry ASC
        `).all();
        res.json({ status: 'success', data: alerts, total: alerts.length });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/warehouse/batches/:batchId/traceability
 * Full supply chain trace for a batch
 */
const getBatchTraceability = (req, res, next) => {
    try {
        const batch = db.prepare(`
            SELECT b.*, d.name as drug_name, d.generic_name, d.manufacturer, d.category,
                   w.name as warehouse_name
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN warehouses w ON b.warehouse_id = w.id
            WHERE b.id = ?
        `).get(req.params.batchId);

        if (!batch) return res.status(404).json({ status: 'error', message: 'Batch not found.' });

        // Find associated GRN (goods receipt)
        const grn = db.prepare(`
            SELECT gr.*, po.po_number, v.name as vendor_name, u.full_name as received_by_name
            FROM goods_receipts gr
            LEFT JOIN purchase_orders po ON gr.po_id = po.id
            LEFT JOIN vendors v ON po.vendor_id = v.id
            LEFT JOIN users u ON gr.received_by = u.id
            WHERE gr.batch_number = ?
        `).get(batch.batch_number);

        // Find shipment items containing this batch
        const shipments = db.prepare(`
            SELECT s.*, si.quantity_shipped,
                   w.name as from_warehouse_name,
                   h.name as to_hospital_name
            FROM shipment_items si
            JOIN shipments s ON si.shipment_id = s.id
            LEFT JOIN warehouses w ON s.from_warehouse_id = w.id
            LEFT JOIN hospitals h ON s.to_hospital_id = h.id
            WHERE si.batch_id = ?
        `).all(batch.id);

        // Find consumption records
        const consumption = db.prepare(`
            SELECT c.*, h.name as hospital_name, u.full_name as logged_by_name
            FROM consumption c
            LEFT JOIN hospitals h ON c.hospital_id = h.id
            LEFT JOIN users u ON c.logged_by = u.id
            WHERE c.batch_id = ?
            ORDER BY c.created_at DESC
        `).all(batch.id);

        // Audit trail
        const auditLogs = db.prepare(`
            SELECT al.*, u.full_name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.entity_id = ?
            ORDER BY al.timestamp DESC
        `).all(batch.id);

        res.json({
            status: 'success',
            data: { batch, grn, shipments, consumption, auditLogs }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/warehouse/grn
 * Receive goods from a purchase order
 * Body: { po_id, warehouse_id, batch_number, received_qty, expiry_date, manufacture_date, location_bin, inspection_status, quality_notes }
 */
const createGRN = (req, res, next) => {
    try {
        const {
            po_id, warehouse_id, batch_number, received_qty,
            expiry_date, manufacture_date, location_bin,
            inspection_status, quality_notes, discrepancies
        } = req.body;

        if (!po_id || !warehouse_id || !batch_number || !received_qty || !expiry_date) {
            return res.status(400).json({ status: 'error', message: 'po_id, warehouse_id, batch_number, received_qty, expiry_date are required.' });
        }

        const po = db.prepare('SELECT * FROM purchase_orders WHERE id = ?').get(po_id);
        if (!po) return res.status(404).json({ status: 'error', message: 'Purchase Order not found.' });

        const createGRNAndBatch = db.transaction(() => {
            const grnId = uuidv4();
            db.prepare(
                `INSERT INTO goods_receipts (id, po_id, warehouse_id, batch_number, received_qty, inspection_status, quality_notes, discrepancies, received_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).run(grnId, po_id, warehouse_id, batch_number, received_qty,
                inspection_status || 'OK', quality_notes || null, discrepancies || null, req.user?.id || null);

            // Upsert batch
            const existingBatch = db.prepare(
                'SELECT * FROM batches WHERE drug_id = ? AND batch_number = ? AND warehouse_id = ?'
            ).get(po.drug_id, batch_number, warehouse_id);

            let batchId;
            if (existingBatch) {
                batchId = existingBatch.id;
                db.prepare('UPDATE batches SET current_qty = current_qty + ? WHERE id = ?')
                    .run(received_qty, batchId);
            } else {
                batchId = uuidv4();
                db.prepare(
                    `INSERT INTO batches (id, drug_id, batch_number, manufacture_date, expiry_date, warehouse_id, location_bin, current_qty)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                ).run(batchId, po.drug_id, batch_number, manufacture_date || null, expiry_date, warehouse_id, location_bin || null, received_qty);
            }

            // Update PO status to received
            db.prepare("UPDATE purchase_orders SET status = 'received', actual_delivery_date = DATE('now') WHERE id = ?").run(po_id);

            // Audit
            db.prepare(
                `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values)
                 VALUES (?, 'batch', ?, 'CREATE', ?, ?)`
            ).run(uuidv4(), batchId, req.user?.id || null, JSON.stringify({ grnId, received_qty, batch_number }));

            return { grnId, batchId };
        });

        const result = createGRNAndBatch();
        res.status(201).json({ status: 'success', message: 'GRN created and stock updated.', data: result });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/warehouse/stock-adjustment
 * Body: { batch_id, adjustment_qty (can be negative), reason }
 */
const stockAdjustment = (req, res, next) => {
    try {
        const { batch_id, adjustment_qty, reason } = req.body;
        if (!batch_id || adjustment_qty === undefined || !reason) {
            return res.status(400).json({ status: 'error', message: 'batch_id, adjustment_qty, and reason are required.' });
        }

        const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batch_id);
        if (!batch) return res.status(404).json({ status: 'error', message: 'Batch not found.' });

        const newQty = batch.current_qty + adjustment_qty;
        if (newQty < 0) return res.status(400).json({ status: 'error', message: 'Adjustment would result in negative stock.' });

        db.prepare('UPDATE batches SET current_qty = ? WHERE id = ?').run(newQty, batch_id);

        db.prepare(
            `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, old_values, new_values, reason)
             VALUES (?, 'batch', ?, 'UPDATE', ?, ?, ?, ?)`
        ).run(uuidv4(), batch_id, req.user?.id || null,
            JSON.stringify({ current_qty: batch.current_qty }),
            JSON.stringify({ current_qty: newQty }),
            reason);

        res.json({ status: 'success', message: 'Stock adjusted.', data: { batch_id, old_qty: batch.current_qty, new_qty: newQty } });
    } catch (err) {
        next(err);
    }
};

module.exports = { getInventory, getExpiryAlerts, getBatchTraceability, createGRN, stockAdjustment };
