const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'drug_inventory_secret_key_change_in_prod';

/**
 * Verifies JWT token from Authorization header.
 * Attaches decoded user to req.user.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
    }
};

/**
 * Role-based access control middleware.
 * Usage: authorize('ADMIN', 'WAREHOUSE')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize, JWT_SECRET };
