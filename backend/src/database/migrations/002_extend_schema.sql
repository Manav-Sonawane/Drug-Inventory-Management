-- Migration 002: Extend vendors and hospitals tables with missing PRD fields

-- Extend vendors table
ALTER TABLE vendors ADD COLUMN payment_terms TEXT;
ALTER TABLE vendors ADD COLUMN approval_status TEXT DEFAULT 'active';
ALTER TABLE vendors ADD COLUMN quality_score REAL;
ALTER TABLE vendors ADD COLUMN on_time_delivery_pct REAL;

-- Extend hospitals table
ALTER TABLE hospitals ADD COLUMN priority_tier TEXT;
ALTER TABLE hospitals ADD COLUMN allocated_budget REAL;
ALTER TABLE hospitals ADD COLUMN storage_capacity INTEGER;
ALTER TABLE hospitals ADD COLUMN contact TEXT;

-- Extend warehouses table
ALTER TABLE warehouses ADD COLUMN storage_capacity INTEGER;
ALTER TABLE warehouses ADD COLUMN manager_name TEXT;
