-- Users & Authorization
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL, -- ADMIN, PROCUREMENT, VENDOR, WAREHOUSE, HOSPITAL, DELIVERY
  hospital_id TEXT, -- null if not hospital-scoped
  warehouse_id TEXT, -- null if not warehouse-scoped
  vendor_id TEXT, -- null if not vendor-scoped
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Drug Master
CREATE TABLE IF NOT EXISTS drugs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  manufacturer TEXT,
  category TEXT, -- Antibiotic, Painkiller, etc.
  unit_price REAL,
  expiry_threshold_days INTEGER DEFAULT 30,
  temperature_sensitive INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT REFERENCES users(id)
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Batches
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  drug_id TEXT REFERENCES drugs(id),
  batch_number TEXT NOT NULL,
  manufacture_date DATE,
  expiry_date DATE NOT NULL,
  warehouse_id TEXT REFERENCES warehouses(id),
  location_bin TEXT, -- e.g., "A-5-3"
  current_qty INTEGER,
  status TEXT DEFAULT 'in_stock', -- in_stock, reserved, expired, disposed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(drug_id, batch_number, warehouse_id)
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE,
  vendor_id TEXT REFERENCES vendors(id),
  drug_id TEXT REFERENCES drugs(id),
  quantity INTEGER,
  unit_price REAL,
  total_cost REAL,
  status TEXT DEFAULT 'draft', -- draft, approved, dispatched, received, invoiced
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  promised_delivery_date DATE,
  actual_delivery_date DATE,
  approved_by TEXT REFERENCES users(id),
  approved_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT REFERENCES users(id)
);

-- Goods Receipt Notes (GRN)
CREATE TABLE IF NOT EXISTS goods_receipts (
  id TEXT PRIMARY KEY,
  po_id TEXT REFERENCES purchase_orders(id),
  warehouse_id TEXT REFERENCES warehouses(id),
  batch_number TEXT,
  received_qty INTEGER,
  received_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  inspection_status TEXT, -- OK, DAMAGED, INCOMPLETE
  quality_notes TEXT,
  discrepancies TEXT,
  received_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  tracking_number TEXT UNIQUE,
  from_warehouse_id TEXT REFERENCES warehouses(id),
  to_hospital_id TEXT REFERENCES hospitals(id),
  status TEXT DEFAULT 'packed', -- packed, in_transit, out_for_delivery, delivered, returned
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_by TEXT REFERENCES users(id)
);

-- Shipment Line Items
CREATE TABLE IF NOT EXISTS shipment_items (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES shipments(id),
  batch_id TEXT REFERENCES batches(id),
  quantity_shipped INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shipment Events (audit trail)
CREATE TABLE IF NOT EXISTS shipment_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT REFERENCES shipments(id),
  event_type TEXT, -- pickup, in_transit, out_for_delivery, delivered, exception
  event_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  location TEXT, -- lat, long (optional)
  notes TEXT,
  reported_by TEXT REFERENCES users(id),
  pod_image_url TEXT,
  pod_signature_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Consumption
CREATE TABLE IF NOT EXISTS consumption (
  id TEXT PRIMARY KEY,
  hospital_id TEXT REFERENCES hospitals(id),
  batch_id TEXT REFERENCES batches(id),
  quantity INTEGER,
  consumed_date DATE,
  ward TEXT,
  department TEXT,
  logged_by TEXT REFERENCES users(id),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT, -- 'drug', 'batch', 'po', 'shipment', etc.
  entity_id TEXT,
  action TEXT, -- 'CREATE', 'UPDATE', 'DELETE'
  user_id TEXT REFERENCES users(id),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  old_values TEXT, -- Stored as JSON string
  new_values TEXT, -- Stored as JSON string
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batches_drug_id ON batches(drug_id);
CREATE INDEX IF NOT EXISTS idx_batches_warehouse_id ON batches(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_shipments_hospital_id ON shipments(to_hospital_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_consumption_hospital_id ON consumption(hospital_id);
CREATE INDEX IF NOT EXISTS idx_consumption_consumed_date ON consumption(consumed_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
