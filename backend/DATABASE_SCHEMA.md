# Database Schema Reference

This document provides a human-readable reference for the SQLite database schema used in the Drug Inventory Management backend.

## Core Entities

### `users`
Manages system users and RBAC.
- `id` (TEXT, PK): Unique identifier
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT): One of ADMIN, PROCUREMENT, VENDOR, WAREHOUSE, HOSPITAL, DELIVERY
- `is_active` (INTEGER)

### `drugs`
Master catalog of drugs.
- `id` (TEXT, PK)
- `name` (TEXT)
- `category` (TEXT)
- `unit_price` (REAL)
- `expiry_threshold_days` (INTEGER)

### `batches`
Tracks specific batches of drugs and their expiry dates in warehouses.
- `id` (TEXT, PK)
- `drug_id` (TEXT, FK)
- `batch_number` (TEXT)
- `expiry_date` (DATE)
- `warehouse_id` (TEXT, FK)
- `current_qty` (INTEGER)
- `status` (TEXT): in_stock, reserved, expired, disposed

### `purchase_orders`
Tracks orders placed with vendors.
- `id` (TEXT, PK)
- `vendor_id` (TEXT, FK)
- `drug_id` (TEXT, FK)
- `quantity` (INTEGER)
- `status` (TEXT): draft, approved, dispatched, received, invoiced

### `goods_receipts`
Goods Receipt Notes created upon receiving items at a warehouse.
- `id` (TEXT, PK)
- `po_id` (TEXT, FK)
- `received_qty` (INTEGER)
- `inspection_status` (TEXT)

### `shipments` & `shipment_items`
Tracks distribution from central warehouses to hospitals.
- **Shipments**: `from_warehouse_id`, `to_hospital_id`, `status`, `tracking_number`
- **Shipment Items**: Links a shipment to specific `batch_id`s and quantities.

### `shipment_events`
Audit trail of delivery steps (pickup, transit, delivery) and POD capture.

### `consumption`
Tracks drug usage at the hospital level.
- `hospital_id` (TEXT, FK)
- `batch_id` (TEXT, FK)
- `quantity` (INTEGER)
- `consumed_date` (DATE)

### `audit_logs`
Records all entity changes for compliance.
- `entity_type` (TEXT)
- `entity_id` (TEXT)
- `action` (TEXT): CREATE, UPDATE, DELETE
- `user_id` (TEXT, FK)
- `old_values` (TEXT)
- `new_values` (TEXT)
