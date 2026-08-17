const Joi = require('joi');

// Returns a middleware that validates req.body against the given Joi schema
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const messages = error.details.map((d) => d.message).join('; ');
        return res.status(400).json({ status: 'error', message: messages });
    }
    next();
};

// ─── Schemas ──────────────────────────────────────────────────────────────────

const schemas = {
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        full_name: Joi.string().max(100).optional(),
        role: Joi.string().valid('ADMIN', 'PROCUREMENT', 'VENDOR', 'WAREHOUSE', 'HOSPITAL', 'DELIVERY').required(),
        hospital_id: Joi.string().uuid().optional().allow(null),
        warehouse_id: Joi.string().uuid().optional().allow(null),
        vendor_id: Joi.string().uuid().optional().allow(null),
    }),

    createDrug: Joi.object({
        name: Joi.string().max(200).required(),
        generic_name: Joi.string().max(200).optional().allow(null, ''),
        manufacturer: Joi.string().max(200).optional().allow(null, ''),
        category: Joi.string().max(100).optional().allow(null, ''),
        unit_price: Joi.number().min(0).optional().allow(null),
        expiry_threshold_days: Joi.number().integer().min(1).optional(),
        temperature_sensitive: Joi.boolean().optional(),
        notes: Joi.string().max(1000).optional().allow(null, ''),
    }),

    updateDrug: Joi.object({
        name: Joi.string().max(200).optional(),
        generic_name: Joi.string().max(200).optional().allow(null, ''),
        manufacturer: Joi.string().max(200).optional().allow(null, ''),
        category: Joi.string().max(100).optional().allow(null, ''),
        unit_price: Joi.number().min(0).optional().allow(null),
        expiry_threshold_days: Joi.number().integer().min(1).optional(),
        temperature_sensitive: Joi.boolean().optional(),
        notes: Joi.string().max(1000).optional().allow(null, ''),
    }),

    createOrder: Joi.object({
        vendor_id: Joi.string().uuid().required(),
        drug_id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().min(0).required(),
        promised_delivery_date: Joi.string().isoDate().optional().allow(null),
        notes: Joi.string().max(500).optional().allow(null, ''),
    }),

    rejectOrder: Joi.object({
        reason: Joi.string().min(5).max(500).required(),
    }),

    createGRN: Joi.object({
        po_id: Joi.string().uuid().required(),
        warehouse_id: Joi.string().uuid().required(),
        batch_number: Joi.string().max(100).required(),
        received_qty: Joi.number().integer().min(1).required(),
        expiry_date: Joi.string().isoDate().required(),
        manufacture_date: Joi.string().isoDate().optional().allow(null),
        location_bin: Joi.string().max(50).optional().allow(null, ''),
        inspection_status: Joi.string().valid('OK', 'DAMAGED', 'INCOMPLETE').optional(),
        quality_notes: Joi.string().max(500).optional().allow(null, ''),
        discrepancies: Joi.string().max(500).optional().allow(null, ''),
    }),

    stockAdjustment: Joi.object({
        batch_id: Joi.string().uuid().required(),
        adjustment_qty: Joi.number().integer().required(),
        reason: Joi.string().min(5).max(500).required(),
    }),

    createShipment: Joi.object({
        from_warehouse_id: Joi.string().uuid().required(),
        to_hospital_id: Joi.string().uuid().required(),
        estimated_delivery_date: Joi.string().isoDate().optional().allow(null),
        items: Joi.array().items(
            Joi.object({
                batch_id: Joi.string().uuid().required(),
                quantity_shipped: Joi.number().integer().min(1).required(),
            })
        ).min(1).required(),
    }),

    logConsumption: Joi.object({
        hospital_id: Joi.string().uuid().required(),
        batch_id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        ward: Joi.string().max(100).optional().allow(null, ''),
        department: Joi.string().max(100).optional().allow(null, ''),
        notes: Joi.string().max(500).optional().allow(null, ''),
        consumed_date: Joi.string().isoDate().optional(),
    }),

    createUser: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        full_name: Joi.string().max(100).optional().allow(''),
        role: Joi.string().valid('ADMIN', 'PROCUREMENT', 'VENDOR', 'WAREHOUSE', 'HOSPITAL', 'DELIVERY').required(),
        hospital_id: Joi.string().uuid().optional().allow(null),
        warehouse_id: Joi.string().uuid().optional().allow(null),
        vendor_id: Joi.string().uuid().optional().allow(null),
    }),

    createVendor: Joi.object({
        name: Joi.string().max(200).required(),
        contact: Joi.string().max(200).optional().allow(null, ''),
        payment_terms: Joi.string().max(200).optional().allow(null, ''),
        approval_status: Joi.string().valid('active', 'under_review', 'blacklisted').optional(),
    }),

    createWarehouse: Joi.object({
        name: Joi.string().max(200).required(),
        location: Joi.string().max(300).optional().allow(null, ''),
        storage_capacity: Joi.number().integer().min(0).optional().allow(null),
    }),

    createHospital: Joi.object({
        name: Joi.string().max(200).required(),
        location: Joi.string().max(300).optional().allow(null, ''),
        priority_tier: Joi.string().valid('rural', 'urban', 'referral').optional(),
        allocated_budget: Joi.number().min(0).optional().allow(null),
        storage_capacity: Joi.number().integer().min(0).optional().allow(null),
        contact: Joi.string().max(200).optional().allow(null, ''),
    }),

    submitPOD: Joi.object({
        notes: Joi.string().max(500).optional().allow(null, ''),
        location: Joi.string().max(300).optional().allow(null, ''),
    }),
};

module.exports = { validate, schemas };
