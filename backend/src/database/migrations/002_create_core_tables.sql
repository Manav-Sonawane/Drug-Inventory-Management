-- Drop existing tables from 001 if they exist to apply the simplified MVP schema
DROP TABLE IF EXISTS shipment_items;
DROP TABLE IF EXISTS shipment_events;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS goods_receipts;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS consumption;
DROP TABLE IF EXISTS batches;
DROP TABLE IF EXISTS drugs;
DROP TABLE IF EXISTS vendors;

-- Drugs
CREATE TABLE IF NOT EXISTS drugs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    manufacturer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    vendor_id TEXT REFERENCES vendors(id),
    status TEXT DEFAULT 'DRAFT', -- DRAFT, PENDING, APPROVED, REJECTED, COMPLETED
    total_amount REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id),
    drug_id TEXT REFERENCES drugs(id),
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id),
    status TEXT DEFAULT 'PENDING', -- PENDING, IN_TRANSIT, DELIVERED
    tracking_number TEXT,
    dispatched_at DATETIME,
    delivered_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
