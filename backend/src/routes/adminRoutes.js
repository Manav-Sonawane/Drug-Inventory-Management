const express = require('express');
const router = express.Router();
const {
    listUsers, createUser, updateUser, deleteUser,
    listVendors, createVendor,
    listWarehouses, createWarehouse,
    listHospitals, createHospital,
    getSystemSettings
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// User management (Admin only)
router.get('/users', authenticate, authorize('ADMIN'), listUsers);
router.post('/users', authenticate, authorize('ADMIN'), createUser);
router.put('/users/:id', authenticate, authorize('ADMIN'), updateUser);
router.delete('/users/:id', authenticate, authorize('ADMIN'), deleteUser);

// Vendors (Admin + Procurement can read)
router.get('/vendors', authenticate, listVendors);
router.post('/vendors', authenticate, authorize('ADMIN'), createVendor);

// Warehouses
router.get('/warehouses', authenticate, listWarehouses);
router.post('/warehouses', authenticate, authorize('ADMIN'), createWarehouse);

// Hospitals
router.get('/hospitals', authenticate, listHospitals);
router.post('/hospitals', authenticate, authorize('ADMIN'), createHospital);

// System Settings
router.get('/system-settings', authenticate, authorize('ADMIN'), getSystemSettings);

module.exports = router;
