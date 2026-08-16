const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is up and running!'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drugs', drugRoutes);
app.use('/api/purchase-orders', procurementRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
