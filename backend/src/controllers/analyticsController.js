const db = require('../database/database');

/**
 * GET /api/analytics/dashboard
 * Returns overall KPIs for the statewide dashboard
 */
const getDashboardKPIs = (req, res, next) => {
    try {
        const totalDrugs = db.prepare('SELECT COUNT(*) as count FROM drugs').get().count;
        const totalBatches = db.prepare("SELECT COUNT(*) as count FROM batches WHERE status = 'in_stock'").get().count;
        const totalStock = db.prepare("SELECT SUM(current_qty) as total FROM batches WHERE status = 'in_stock'").get().total || 0;

        const expiryAlerts = db.prepare(`
            SELECT COUNT(*) as count FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            WHERE b.status = 'in_stock'
              AND julianday(b.expiry_date) - julianday('now') <= d.expiry_threshold_days
        `).get().count;

        const criticalExpiry = db.prepare(`
            SELECT COUNT(*) as count FROM batches
            WHERE status = 'in_stock'
              AND julianday(expiry_date) - julianday('now') <= 7
        `).get().count;

        const activeShipments = db.prepare(
            "SELECT COUNT(*) as count FROM shipments WHERE status IN ('packed','in_transit','out_for_delivery')"
        ).get().count;

        const deliveredShipments = db.prepare(
            "SELECT COUNT(*) as count FROM shipments WHERE status = 'delivered'"
        ).get().count;

        const pendingOrders = db.prepare(
            "SELECT COUNT(*) as count FROM purchase_orders WHERE status IN ('draft','approved')"
        ).get().count;

        const totalConsumption30d = db.prepare(
            "SELECT SUM(quantity) as total FROM consumption WHERE consumed_date >= DATE('now', '-30 days')"
        ).get().total || 0;

        const lowStockBatches = db.prepare(`
            SELECT b.id, b.batch_number, b.current_qty, d.name as drug_name,
                   CAST((julianday(b.expiry_date) - julianday('now')) AS INTEGER) as days_to_expiry,
                   w.name as warehouse_name
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN warehouses w ON b.warehouse_id = w.id
            WHERE b.status = 'in_stock' AND b.current_qty < 50
            ORDER BY b.current_qty ASC
            LIMIT 10
        `).all();

        const recentShipments = db.prepare(`
            SELECT s.id, s.tracking_number, s.status, s.created_date,
                   w.name as from_warehouse, h.name as to_hospital
            FROM shipments s
            LEFT JOIN warehouses w ON s.from_warehouse_id = w.id
            LEFT JOIN hospitals h ON s.to_hospital_id = h.id
            ORDER BY s.created_date DESC
            LIMIT 5
        `).all();

        res.json({
            status: 'success',
            data: {
                totalDrugs,
                totalBatches,
                totalStock,
                expiryAlerts,
                criticalExpiry,
                activeShipments,
                deliveredShipments,
                pendingOrders,
                totalConsumption30d,
                lowStockBatches,
                recentShipments
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/stockout-frequency
 * Returns drugs with most stockout/low stock events
 */
const getStockoutFrequency = (req, res, next) => {
    try {
        const data = db.prepare(`
            SELECT d.name as drug_name, d.category,
                   COUNT(c.id) as consumption_count,
                   SUM(c.quantity) as total_consumed,
                   MIN(b.current_qty) as min_stock,
                   AVG(b.current_qty) as avg_stock
            FROM consumption c
            JOIN batches b ON c.batch_id = b.id
            JOIN drugs d ON b.drug_id = d.id
            WHERE c.consumed_date >= DATE('now', '-90 days')
            GROUP BY d.id
            ORDER BY total_consumed DESC
            LIMIT 20
        `).all();
        res.json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/vendor-performance
 */
const getVendorPerformance = (req, res, next) => {
    try {
        const data = db.prepare(`
            SELECT v.id, v.name as vendor_name,
                   COUNT(po.id) as total_orders,
                   SUM(CASE WHEN po.status = 'received' THEN 1 ELSE 0 END) as fulfilled,
                   SUM(CASE WHEN po.status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                   AVG(CASE
                       WHEN po.actual_delivery_date IS NOT NULL AND po.promised_delivery_date IS NOT NULL
                       THEN julianday(po.actual_delivery_date) - julianday(po.promised_delivery_date)
                       ELSE NULL
                   END) as avg_delay_days,
                   SUM(po.total_cost) as total_value
            FROM vendors v
            LEFT JOIN purchase_orders po ON po.vendor_id = v.id
            GROUP BY v.id
            ORDER BY total_orders DESC
        `).all();
        res.json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/expiry-waste
 */
const getExpiryWaste = (req, res, next) => {
    try {
        const expired = db.prepare(`
            SELECT b.*, d.name as drug_name, d.unit_price,
                   (b.current_qty * d.unit_price) as estimated_loss,
                   w.name as warehouse_name
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            LEFT JOIN warehouses w ON b.warehouse_id = w.id
            WHERE b.expiry_date < DATE('now') AND b.current_qty > 0
            ORDER BY estimated_loss DESC
        `).all();

        const nearExpiry = db.prepare(`
            SELECT b.batch_number, d.name as drug_name, b.expiry_date, b.current_qty,
                   d.unit_price, (b.current_qty * d.unit_price) as at_risk_value,
                   CAST((julianday(b.expiry_date) - julianday('now')) AS INTEGER) as days_to_expiry
            FROM batches b
            JOIN drugs d ON b.drug_id = d.id
            WHERE b.status = 'in_stock'
              AND julianday(b.expiry_date) - julianday('now') BETWEEN 0 AND 30
            ORDER BY days_to_expiry ASC
        `).all();

        const totalLoss = expired.reduce((sum, r) => sum + (r.estimated_loss || 0), 0);
        const atRiskValue = nearExpiry.reduce((sum, r) => sum + (r.at_risk_value || 0), 0);

        res.json({ status: 'success', data: { expired, nearExpiry, totalLoss, atRiskValue } });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/analytics/procurement-efficiency
 */
const getProcurementEfficiency = (req, res, next) => {
    try {
        const data = db.prepare(`
            SELECT
                strftime('%Y-%m', po.order_date) as month,
                COUNT(*) as total_orders,
                SUM(CASE WHEN po.status = 'received' THEN 1 ELSE 0 END) as received,
                SUM(CASE WHEN po.status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(po.total_cost) as total_spend,
                AVG(CASE
                    WHEN po.actual_delivery_date IS NOT NULL AND po.promised_delivery_date IS NOT NULL
                    THEN julianday(po.actual_delivery_date) - julianday(po.promised_delivery_date)
                    ELSE NULL END) as avg_delay_days
            FROM purchase_orders po
            WHERE po.order_date >= DATE('now', '-12 months')
            GROUP BY month
            ORDER BY month ASC
        `).all();
        res.json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboardKPIs, getStockoutFrequency, getVendorPerformance, getExpiryWaste, getProcurementEfficiency };
