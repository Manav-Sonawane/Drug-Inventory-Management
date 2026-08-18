const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const drugRoutes = require('./routes/drugRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const consumptionRoutes = require('./routes/consumptionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 200,                  // 200 requests/min globally
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests, please slow down.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                  // 100 login attempts
    message: { status: 'error', message: 'Too many login attempts. Try again in 15 minutes.' },
});

app.use(globalLimiter);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://alessandro-necessitous-leandro.ngrok-free.dev',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(cors({
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.ngrok-free.dev') ||
            origin.endsWith('.ngrok-free.app') ||
            origin.endsWith('.ngrok.io')
        ) {
            callback(null, true);
        } else {
            // Allow all origins in production/testing with origin reflection
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.options('*', cors());


// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is up and running!',
        timestamp: new Date().toISOString(),
    });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/purchase-orders', procurementRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.path} not found.` });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
