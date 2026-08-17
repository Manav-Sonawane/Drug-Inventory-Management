const db = require('../database/database');

/**
 * GET /api/audit?entity_type=&entity_id=&user_id=&from=&to=&limit=&offset=
 */
const getAuditLogs = (req, res, next) => {
    try {
        const { entity_type, entity_id, user_id, from, to, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT al.*, u.full_name as user_name, u.email as user_email
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (entity_type) { query += ' AND al.entity_type = ?'; params.push(entity_type); }
        if (entity_id)   { query += ' AND al.entity_id = ?'; params.push(entity_id); }
        if (user_id)     { query += ' AND al.user_id = ?'; params.push(user_id); }
        if (from)        { query += ' AND al.timestamp >= ?'; params.push(from); }
        if (to)          { query += ' AND al.timestamp <= ?'; params.push(to); }

        query += ' ORDER BY al.timestamp DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const logs = db.prepare(query).all(...params);

        const totalQuery = query.replace(/SELECT al\.\*.*FROM/, 'SELECT COUNT(*) as count FROM').replace(/ORDER BY.*$/, '');
        const total = db.prepare(totalQuery.split('LIMIT')[0]).get(...params.slice(0, -2)).count;

        res.json({ status: 'success', data: logs, total, limit: Number(limit), offset: Number(offset) });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAuditLogs };
