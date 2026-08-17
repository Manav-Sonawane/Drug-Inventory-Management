const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');

/**
 * POST /api/shipments
 * Body: { from_warehouse_id, to_hospital_id, estimated_delivery_date, items: [{batch_id, quantity_shipped}] }
 */
const createShipment = (req, res, next) => {
    try {
        const { from_warehouse_id, to_hospital_id, estimated_delivery_date, items } = req.body;
        if (!from_warehouse_id || !to_hospital_id || !items?.length) {
            return res.status(400).json({ status: 'error', message: 'from_warehouse_id, to_hospital_id, and items are required.' });
        }

        const doCreate = db.transaction(() => {
            const shipmentId = uuidv4();
            const tracking_number = `TRK-${Date.now()}`;

            db.prepare(
                `INSERT INTO shipments (id, tracking_number, from_warehouse_id, to_hospital_id, estimated_delivery_date, created_by)
                 VALUES (?, ?, ?, ?, ?, ?)`
            ).run(shipmentId, tracking_number, from_warehouse_id, to_hospital_id,
                estimated_delivery_date || null, req.user?.id || null);

            for (const item of items) {
                const { batch_id, quantity_shipped } = item;
                const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batch_id);
                if (!batch) throw new Error(`Batch ${batch_id} not found`);
                if (batch.current_qty < quantity_shipped) {
                    throw new Error(`Insufficient stock for batch ${batch.batch_number}. Available: ${batch.current_qty}`);
                }

                db.prepare(
                    `INSERT INTO shipment_items (id, shipment_id, batch_id, quantity_shipped)
                     VALUES (?, ?, ?, ?)`
                ).run(uuidv4(), shipmentId, batch_id, quantity_shipped);

                // Deduct from batch
                db.prepare('UPDATE batches SET current_qty = current_qty - ? WHERE id = ?')
                    .run(quantity_shipped, batch_id);
            }

            // Create initial shipment event
            db.prepare(
                `INSERT INTO shipment_events (id, shipment_id, event_type, notes, reported_by)
                 VALUES (?, ?, 'pickup', 'Shipment created and packed', ?)`
            ).run(uuidv4(), shipmentId, req.user?.id || null);

            db.prepare(
                `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values)
                 VALUES (?, 'shipment', ?, 'CREATE', ?, ?)`
            ).run(uuidv4(), shipmentId, req.user?.id || null, JSON.stringify({ tracking_number, to_hospital_id }));

            return { shipmentId, tracking_number };
        });

        const result = doCreate();
        const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(result.shipmentId);
        res.status(201).json({ status: 'success', data: shipment });
    } catch (err) {
        if (err.message.includes('Insufficient stock') || err.message.includes('not found')) {
            return res.status(400).json({ status: 'error', message: err.message });
        }
        next(err);
    }
};

/**
 * GET /api/shipments
 * Query: ?status=, ?hospital_id=, ?warehouse_id=
 */
const listShipments = (req, res, next) => {
    try {
        const { status, hospital_id, warehouse_id } = req.query;
        let query = `
            SELECT s.*,
                   w.name as from_warehouse_name,
                   h.name as to_hospital_name
            FROM shipments s
            LEFT JOIN warehouses w ON s.from_warehouse_id = w.id
            LEFT JOIN hospitals h ON s.to_hospital_id = h.id
            WHERE 1=1
        `;
        const params = [];
        if (status) { query += ' AND s.status = ?'; params.push(status); }
        if (hospital_id) { query += ' AND s.to_hospital_id = ?'; params.push(hospital_id); }
        if (warehouse_id) { query += ' AND s.from_warehouse_id = ?'; params.push(warehouse_id); }
        query += ' ORDER BY s.created_date DESC';

        const shipments = db.prepare(query).all(...params);
        res.json({ status: 'success', data: shipments, total: shipments.length });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/shipments/:id
 */
const getShipment = (req, res, next) => {
    try {
        const shipment = db.prepare(`
            SELECT s.*, w.name as from_warehouse_name, h.name as to_hospital_name
            FROM shipments s
            LEFT JOIN warehouses w ON s.from_warehouse_id = w.id
            LEFT JOIN hospitals h ON s.to_hospital_id = h.id
            WHERE s.id = ?
        `).get(req.params.id);

        if (!shipment) return res.status(404).json({ status: 'error', message: 'Shipment not found.' });

        const items = db.prepare(`
            SELECT si.*, b.batch_number, b.expiry_date, d.name as drug_name
            FROM shipment_items si
            JOIN batches b ON si.batch_id = b.id
            JOIN drugs d ON b.drug_id = d.id
            WHERE si.shipment_id = ?
        `).all(req.params.id);

        const events = db.prepare(
            'SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY event_timestamp ASC'
        ).all(req.params.id);

        res.json({ status: 'success', data: { ...shipment, items, events } });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/shipments/:id/tracking
 */
const getTracking = (req, res, next) => {
    try {
        const shipment = db.prepare('SELECT id, tracking_number, status FROM shipments WHERE id = ?').get(req.params.id);
        if (!shipment) return res.status(404).json({ status: 'error', message: 'Shipment not found.' });

        const events = db.prepare(
            'SELECT * FROM shipment_events WHERE shipment_id = ? ORDER BY event_timestamp ASC'
        ).all(req.params.id);

        res.json({ status: 'success', data: { ...shipment, events } });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/shipments/:id/pod
 * Body: { notes, location }
 * Marks shipment as delivered
 */
const submitPOD = (req, res, next) => {
    try {
        const { notes, location } = req.body;
        const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(req.params.id);
        if (!shipment) return res.status(404).json({ status: 'error', message: 'Shipment not found.' });

        const doDeliver = db.transaction(() => {
            db.prepare(
                "UPDATE shipments SET status = 'delivered', actual_delivery_date = DATE('now') WHERE id = ?"
            ).run(req.params.id);

            db.prepare(
                `INSERT INTO shipment_events (id, shipment_id, event_type, notes, location, reported_by)
                 VALUES (?, ?, 'delivered', ?, ?, ?)`
            ).run(uuidv4(), req.params.id, notes || 'Delivered successfully', location || null, req.user?.id || null);

            db.prepare(
                `INSERT INTO audit_logs (id, entity_type, entity_id, action, user_id, new_values)
                 VALUES (?, 'shipment', ?, 'UPDATE', ?, ?)`
            ).run(uuidv4(), req.params.id, req.user?.id || null, JSON.stringify({ status: 'delivered' }));
        });

        doDeliver();
        res.json({ status: 'success', message: 'Proof of delivery recorded. Shipment marked as delivered.' });
    } catch (err) {
        next(err);
    }
};

module.exports = { createShipment, listShipments, getShipment, getTracking, submitPOD };
