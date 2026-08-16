# Technical Architecture Document
## Drug Inventory and Supply Chain Tracking System (PSS04)

**Version**: 1.0  
**Date**: August 2026  
**Target Stack**: Node.js/Express (backend), React (web), React Native (mobile), PostgreSQL (data)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT TIER                           │
├──────────────────────┬──────────────────────────────────┤
│   Web Dashboard      │   Mobile App (iOS/Android)       │
│   (React)            │   (React Native)                 │
│   - Procurement      │   - Delivery tracking (POD)      │
│   - Analytics        │   - Hospital consumption         │
│   - Reporting        │   - Stock visibility             │
└──────────────────────┴──────────────────────────────────┘
                            ↑
                    REST API (HTTPS)
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   API TIER (Node.js)                    │
├──────────────────────────────────────────────────────────┤
│ Express Server (port 3000)                              │
│ ├─ Auth Service (JWT + Role validation)                │
│ ├─ Drug & Inventory Service                            │
│ ├─ Procurement Service                                 │
│ ├─ Warehouse Service                                   │
│ ├─ Shipment & Logistics Service                        │
│ ├─ Consumption Service                                 │
│ ├─ Analytics Service                                   │
│ └─ Audit Service (all entity changes)                  │
│                                                         │
│ Middleware:                                            │
│ ├─ Rate limiting (100 req/min per user)               │
│ ├─ CORS (allow web + mobile origins)                  │
│ ├─ Error handling & logging (Winston/Pino)            │
│ └─ Request validation (Joi/Zod)                       │
└──────────────────────────────────────────────────────────┘
                            ↑
                   Database Layer
                            ↓
┌─────────────────────────────────────────────────────────┐
│              DATA TIER (PostgreSQL 15+)                │
├──────────────────────────────────────────────────────────┤
│ Primary DB (prod data)                                  │
│ ├─ Replica (read-only, for analytics queries)         │
│ └─ Backups (daily, 30-day retention)                   │
│                                                         │
│ Indexes:                                               │
│ ├─ PK on all entities                                  │
│ ├─ FK relationships for referential integrity         │
│ ├─ BTREE on frequently-filtered columns                │
│ │  (drug_id, batch_id, hospital_id, status)          │
│ └─ BRIN on timestamp columns (created_at, expiry_date)│
│                                                         │
│ Partitioning (if >100M records):                       │
│ ├─ Shipments by month (for old shipment archive)      │
│ ├─ Consumption by quarter (for historical analysis)   │
│ └─ Audit logs by month (7-year retention)             │
└──────────────────────────────────────────────────────────┘

External Services (Optional):
├─ AWS S3 (store POD images, quality inspection photos)
├─ Twilio/SNS (SMS alerts for critical stockouts)
├─ SendGrid (email notifications)
└─ Sentry (error tracking & monitoring)
```

---

## 2. Web Application Architecture (React)

### 2.1 Project Structure

```
drug-inventory-web/
├─ public/
│  ├─ index.html
│  └─ favicon.ico
│
├─ src/
│  ├─ components/
│  │  ├─ Auth/
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ ProtectedRoute.jsx
│  │  │  └─ PermissionGuard.jsx
│  │  │
│  │  ├─ Procurement/
│  │  │  ├─ VendorList.jsx
│  │  │  ├─ VendorDetail.jsx
│  │  │  ├─ PurchaseOrderForm.jsx
│  │  │  ├─ PurchaseOrderList.jsx
│  │  │  └─ PurchaseOrderApproval.jsx
│  │  │
│  │  ├─ Warehouse/
│  │  │  ├─ GRNForm.jsx
│  │  │  ├─ InventoryView.jsx
│  │  │  ├─ ExpiryAlerts.jsx
│  │  │  ├─ StockAdjustmentForm.jsx
│  │  │  └─ BatchTraceability.jsx
│  │  │
│  │  ├─ Distribution/
│  │  │  ├─ ShipmentCreate.jsx
│  │  │  ├─ ShipmentTracker.jsx
│  │  │  ├─ AllocationRuleEngine.jsx
│  │  │  └─ ReturnManagement.jsx
│  │  │
│  │  ├─ Analytics/
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ KPICards.jsx
│  │  │  ├─ StockoutTrendChart.jsx
│  │  │  ├─ VendorScorecard.jsx
│  │  │  ├─ ConsumptionTrends.jsx
│  │  │  ├─ ExpiryWasteReport.jsx
│  │  │  └─ ProcurementAnalysis.jsx
│  │  │
│  │  ├─ Hospital/
│  │  │  ├─ ConsumptionLog.jsx
│  │  │  ├─ StockAlerts.jsx
│  │  │  └─ HospitalDashboard.jsx
│  │  │
│  │  ├─ Admin/
│  │  │  ├─ UserManagement.jsx
│  │  │  ├─ DrugCatalog.jsx
│  │  │  ├─ AuditLog.jsx
│  │  │  └─ SystemSettings.jsx
│  │  │
│  │  └─ Common/
│  │     ├─ Navbar.jsx
│  │     ├─ Sidebar.jsx
│  │     ├─ SearchBar.jsx
│  │     ├─ BulkImportDialog.jsx
│  │     └─ NotificationCenter.jsx
│  │
│  ├─ services/
│  │  ├─ api.js (Axios instance with interceptors)
│  │  ├─ authService.js
│  │  ├─ drugService.js
│  │  ├─ procurementService.js
│  │  ├─ warehouseService.js
│  │  ├─ shipmentService.js
│  │  ├─ consumptionService.js
│  │  ├─ analyticsService.js
│  │  └─ auditService.js
│  │
│  ├─ store/ (Redux)
│  │  ├─ slices/
│  │  │  ├─ authSlice.js
│  │  │  ├─ drugSlice.js
│  │  │  ├─ procurementSlice.js
│  │  │  ├─ warehouseSlice.js
│  │  │  ├─ shipmentSlice.js
│  │  │  └─ uiSlice.js
│  │  └─ store.js
│  │
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useFetch.js
│  │  ├─ usePagination.js
│  │  └─ useLocalStorage.js
│  │
│  ├─ utils/
│  │  ├─ constants.js (roles, statuses, drug categories)
│  │  ├─ formatters.js (date, currency, quantity)
│  │  ├─ validators.js (email, phone, drug batch format)
│  │  ├─ helpers.js (array operations, calculations)
│  │  └─ errorHandler.js
│  │
│  ├─ styles/
│  │  ├─ index.css (global)
│  │  ├─ colors.css (design tokens)
│  │  └─ typography.css
│  │
│  └─ App.jsx (routing, theme provider)
│
├─ .env.example
├─ package.json
└─ vite.config.js (or create-react-app if using CRA)
```

### 2.2 Tech Stack - Web

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 19 (Vite) | Fast refresh, modern hooks |
| **State Mgmt** | Redux Toolkit | Centralized store for multi-user auth, role-based views |
| **HTTP Client** | Axios | Interceptors for JWT refresh, error handling |
| **UI Library** | TailwindCSS + Headless UI | No bloat, accessible components |
| **Charts** | Recharts | Lightweight, React-native charts |
| **Tables** | TanStack Table (React Table) | Headless, unstyled, highly customizable |
| **Forms** | React Hook Form + Zod | Minimal re-renders, type-safe validation |
| **Routing** | React Router v6 | Standard, role-based route guards |
| **Icons** | Phosphor Icons | Consistent, open-source |
| **Date Handling** | date-fns | Lightweight, tree-shakeable |
| **PDF Export** | jsPDF + html2canvas | Generate reports client-side |
| **Testing** | Vitest + React Testing Library | Fast, unit + integration tests |

### 2.3 Key Components (Web-Specific)

**PurchaseOrderApproval.jsx**
```jsx
// Multi-step approval workflow
// Shows: Vendor details, line items, cost breakdown
// Actions: Approve, Reject (with reason), Request modification
// Audit: Logged who approved, when, any comments
```

**AnalyticsDashboard.jsx**
```jsx
// Role-based display:
// - Procurement Officer: Budget vs. actual, vendor performance
// - Warehouse Manager: Stock levels, expiry timeline, utilization %
// - Hospital Admin: Current stock value, consumption trends
// - System Admin: System health KPIs

// Charts:
// - Stockout frequency (time series)
// - Procurement cycle time (by vendor)
// - Expiry waste (pie chart by drug category)
// - Inventory turnover (bar chart by hospital)
// - Vendor on-time delivery % (scatter plot)
```

**AuditLog.jsx**
```jsx
// Show all entity changes: who, what, when, why
// Filterable by entity type, user, date range
// Export to CSV/PDF
// Compliance-ready: 7-year retention, tamper-proof
```

---

## 3. Mobile Application Architecture (React Native)

### 3.1 Project Structure

```
drug-inventory-mobile/
├─ android/
├─ ios/
│
├─ src/
│  ├─ screens/
│  │  ├─ auth/
│  │  │  ├─ LoginScreen.js
│  │  │  └─ OTPScreen.js (optional, for field workers)
│  │  │
│  │  ├─ delivery/ (for Logistics/Delivery Personnel)
│  │  │  ├─ ShipmentListScreen.js
│  │  │  ├─ ShipmentDetailScreen.js
│  │  │  ├─ BarcodeScannerScreen.js
│  │  │  ├─ DeliveryConfirmationScreen.js (POD capture)
│  │  │  ├─ PhotoCaptureScreen.js (damage docs)
│  │  │  ├─ SignatureCaptureScreen.js
│  │  │  └─ DeliveryHistoryScreen.js
│  │  │
│  │  ├─ hospital/ (for Hospital Pharmacists)
│  │  │  ├─ HospitalDashboardScreen.js
│  │  │  ├─ StockLevelScreen.js
│  │  │  ├─ ExpiryAlertsScreen.js
│  │  │  ├─ ConsumptionLogScreen.js
│  │  │  │  └─ (barcode scan + manual qty entry)
│  │  │  ├─ StockAdjustmentScreen.js
│  │  │  │  └─ (request or log discrepancy)
│  │  │  ├─ ShipmentInboundScreen.js
│  │  │  │  └─ (GRN creation at hospital side)
│  │  │  └─ HospitalSettingsScreen.js
│  │  │
│  │  ├─ warehouse/ (for Warehouse Staff)
│  │  │  ├─ WarehouseDashboardScreen.js
│  │  │  ├─ ReceiptScanScreen.js (GRN inbound)
│  │  │  ├─ BinAssignmentScreen.js
│  │  │  ├─ CycleCountScreen.js (physical count)
│  │  │  ├─ ExpiryManagementScreen.js
│  │  │  ├─ ShipmentPackingScreen.js
│  │  │  └─ StockSearchScreen.js
│  │  │
│  │  └─ common/
│  │     ├─ SplashScreen.js
│  │     ├─ ProfileScreen.js
│  │     ├─ NotificationsScreen.js
│  │     └─ OfflineIndicatorScreen.js
│  │
│  ├─ components/
│  │  ├─ BarcodeScannerComponent.js
│  │  │  └─ Uses react-native-camera or expo-barcode-scanner
│  │  ├─ SignaturePadComponent.js
│  │  │  └─ Uses react-native-signature-canvas
│  │  ├─ PhotoPickerComponent.js
│  │  ├─ ListItemCard.js
│  │  ├─ AlertCard.js
│  │  ├─ FloatingActionButton.js
│  │  ├─ OfflineDataSyncComponent.js
│  │  └─ LoadingIndicator.js
│  │
│  ├─ services/
│  │  ├─ api.js (Axios with offline queue)
│  │  ├─ authService.js
│  │  ├─ storageService.js (AsyncStorage for local data)
│  │  ├─ syncService.js (offline ↔ online sync)
│  │  ├─ notificationService.js (push notifications)
│  │  ├─ locationService.js (optional GPS)
│  │  └─ fileService.js (photo/PDF management)
│  │
│  ├─ database/
│  │  ├─ schema.js (SQLite schema for offline storage)
│  │  ├─ db.js (SQLite connection)
│  │  └─ migrations.js
│  │
│  ├─ store/ (Redux)
│  │  ├─ slices/
│  │  │  ├─ authSlice.js
│  │  │  ├─ shipmentSlice.js
│  │  │  ├─ hospitalSlice.js
│  │  │  ├─ warehouseSlice.js
│  │  │  ├─ offlineSlice.js (queue of unsync'd actions)
│  │  │  └─ uiSlice.js
│  │  └─ store.js
│  │
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useOfflineSync.js
│  │  ├─ useBarcodeScanner.js
│  │  ├─ useLocation.js (optional)
│  │  └─ useNotifications.js
│  │
│  ├─ utils/
│  │  ├─ constants.js
│  │  ├─ formatters.js
│  │  ├─ validators.js
│  │  └─ errorHandler.js
│  │
│  ├─ styles/
│  │  ├─ theme.js (colors, fonts, spacing)
│  │  └─ globalStyles.js
│  │
│  ├─ navigation/
│  │  ├─ RootNavigator.js
│  │  ├─ AuthNavigator.js
│  │  ├─ DeliveryNavigator.js
│  │  ├─ HospitalNavigator.js
│  │  ├─ WarehouseNavigator.js
│  │  └─ DrawerNavigator.js (main nav)
│  │
│  └─ App.js (entry point)
│
├─ .env.example
├─ app.json
├─ package.json
└─ babel.config.js
```

### 3.2 Tech Stack - Mobile

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React Native + Expo | Faster dev, OTA updates, cross-platform |
| **State Mgmt** | Redux Toolkit | Same as web, shared logic |
| **HTTP Client** | Axios | Same as web, with offline queue |
| **Local Storage** | AsyncStorage | Simple key-value for small data |
| **Offline DB** | SQLite (react-native-sqlite-storage) | For large datasets (inventory), sync on reconnect |
| **Navigation** | React Navigation | Standard, nested stacks per role |
| **Barcode Scanner** | expo-barcode-scanner | Built-in, no extra lib needed |
| **Camera** | expo-camera | For POD photos, damage docs |
| **Signature** | react-native-signature-canvas | Delivery signature capture |
| **Push Notifications** | Expo Notifications | Critical alerts (stockouts, expirations) |
| **Maps** | react-native-maps (optional round 2) | Shipment tracking, geolocation |
| **Testing** | Jest + @react-native-testing-library | Unit + integration tests |
| **Build** | Expo EAS | Managed CI/CD for iOS/Android |

### 3.3 Key Screens (Mobile-Specific)

**BarcodeScannerScreen.js** (Warehouse & Delivery)
```javascript
// Real-time barcode scanning for GRN inbound, POD delivery
// Shows: Drug name, batch, expiry, expected qty
// Actions: 
//   - Confirm (qty matches)
//   - Exception (qty mismatch, damage, wrong item)
// Offline: Queue scans, sync when online

// Flow:
// 1. User opens screen
// 2. Camera starts, awaiting barcode
// 3. Scan barcode → fetch drug details from local SQLite (pre-synced)
// 4. Display: Drug, batch, expiry, expected qty
// 5. User taps "Confirm" or reports exception
// 6. If online: POST to server immediately
// 7. If offline: Store in offline queue, sync later
```

**DeliveryConfirmationScreen.js** (Delivery Personnel)
```javascript
// Multi-step POD:
// Step 1: Barcode scan (verify shipment)
// Step 2: Recipient signature or OTP
// Step 3: Photo upload (if damage)
// Step 4: Review & submit
// 
// Stores locally first (offline), syncs when connected
// Real-time UI feedback: "✓ Scanned", "✓ Signed", "✓ Photos"
```

**ConsumptionLogScreen.js** (Hospital Pharmacist)
```javascript
// Two modes:
// A. Barcode mode: Scan batch → qty → confirm
// B. Manual mode: Drug dropdown → batch dropdown → qty → confirm
//
// Shows: Current stock (from local cache)
// After consume: Updates local stock display immediately
// Syncs to server: Posts consumption record when online
```

**StockLevelScreen.js** (Hospital Dashboard - Mobile)
```javascript
// Cached view of current inventory
// Filterable by: Drug name, category, status
// Shows:
//   - Drug name, current qty, unit
//   - Batch(es) with expiry dates
//   - Status: OK / Low / Expired
//
// Pull-to-refresh: Re-sync from server if online
// Background sync: Updates every 5 min when idle
```

---

## 4. Backend Architecture (Node.js/Express)

### 4.1 Project Structure

```
drug-inventory-api/
├─ src/
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ drugController.js
│  │  ├─ procurementController.js
│  │  ├─ warehouseController.js
│  │  ├─ shipmentController.js
│  │  ├─ consumptionController.js
│  │  ├─ analyticsController.js
│  │  ├─ auditController.js
│  │  └─ adminController.js
│  │
│  ├─ services/
│  │  ├─ authService.js (JWT generation, user validation)
│  │  ├─ drugService.js (drug CRUD, master data)
│  │  ├─ procurementService.js (PO logic, vendor selection)
│  │  ├─ warehouseService.js (GRN, stock ops, expiry)
│  │  ├─ shipmentService.js (allocation, packing, tracking)
│  │  ├─ consumptionService.js (logging, aggregation)
│  │  ├─ analyticsService.js (KPI calc, forecasting)
│  │  ├─ auditService.js (log entity changes)
│  │  ├─ notificationService.js (SMS, email, push alerts)
│  │  └─ reportService.js (PDF/CSV export)
│  │
│  ├─ models/ (database schemas using Drizzle or Prisma)
│  │  ├─ drug.js
│  │  ├─ batch.js
│  │  ├─ vendor.js
│  │  ├─ purchaseOrder.js
│  │  ├─ goodsReceipt.js
│  │  ├─ shipment.js
│  │  ├─ shipmentEvent.js
│  │  ├─ consumption.js
│  │  ├─ hospital.js
│  │  ├─ warehouse.js
│  │  ├─ user.js
│  │  ├─ audit.js
│  │  └─ stockAdjustment.js
│  │
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ drugRoutes.js
│  │  ├─ procurementRoutes.js
│  │  ├─ warehouseRoutes.js
│  │  ├─ shipmentRoutes.js
│  │  ├─ consumptionRoutes.js
│  │  ├─ analyticsRoutes.js
│  │  ├─ auditRoutes.js
│  │  └─ adminRoutes.js
│  │
│  ├─ middleware/
│  │  ├─ authMiddleware.js (verify JWT)
│  │  ├─ roleMiddleware.js (check user role/permissions)
│  │  ├─ validationMiddleware.js (schema validation)
│  │  ├─ errorHandler.js
│  │  ├─ logger.js (Winston/Pino)
│  │  ├─ rateLimiter.js
│  │  └─ corsMiddleware.js
│  │
│  ├─ utils/
│  │  ├─ constants.js (roles, statuses, error codes)
│  │  ├─ helpers.js (calculations, date ops)
│  │  ├─ validators.js (input validation)
│  │  ├─ jwt.js (token generation/verification)
│  │  ├─ encryption.js (hash passwords, PII)
│  │  └─ s3Upload.js (photo uploads to AWS)
│  │
│  ├─ database/
│  │  ├─ connection.js (PostgreSQL pool)
│  │  ├─ migrations/ (Flyway or node-migrate)
│  │  │  ├─ 001_initial_schema.sql
│  │  │  ├─ 002_add_audit_table.sql
│  │  │  └─ ...
│  │  └─ seeds/ (initial data for testing)
│  │
│  ├─ jobs/ (background tasks)
│  │  ├─ expiryCheckJob.js (runs daily at 2 AM)
│  │  ├─ stockoutAlertJob.js (runs every hour)
│  │  ├─ vendorPerformanceJob.js (runs weekly)
│  │  └─ archiveAuditLogsJob.js (runs monthly)
│  │
│  ├─ config/
│  │  ├─ env.js (environment variables)
│  │  ├─ database.js (connection config)
│  │  ├─ auth.js (JWT secrets, token expiry)
│  │  └─ email.js (SMTP config)
│  │
│  └─ app.js (Express app setup)
│
├─ .env.example
├─ .env.local (local dev config, git-ignored)
├─ package.json
├─ server.js (entry point)
├─ docker-compose.yml (local dev: PostgreSQL, Redis)
└─ .eslintrc.json
```

### 4.2 Database Schema (Abbreviated)

```sql
-- Users & Authorization
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR,
  role VARCHAR NOT NULL, -- ADMIN, PROCUREMENT, VENDOR, WAREHOUSE, HOSPITAL, DELIVERY
  hospital_id UUID, -- null if not hospital-scoped
  warehouse_id UUID, -- null if not warehouse-scoped
  vendor_id UUID, -- null if not vendor-scoped
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);

-- Drug Master
CREATE TABLE drugs (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  generic_name VARCHAR,
  manufacturer VARCHAR,
  category VARCHAR, -- Antibiotic, Painkiller, etc.
  unit_price DECIMAL,
  expiry_threshold_days INT DEFAULT 30,
  temperature_sensitive BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Batches
CREATE TABLE batches (
  id UUID PRIMARY KEY,
  drug_id UUID REFERENCES drugs(id),
  batch_number VARCHAR NOT NULL,
  manufacture_date DATE,
  expiry_date DATE NOT NULL,
  warehouse_id UUID REFERENCES warehouses(id),
  location_bin VARCHAR, -- e.g., "A-5-3"
  current_qty INT,
  status VARCHAR DEFAULT 'in_stock', -- in_stock, reserved, expired, disposed
  created_at TIMESTAMP,
  UNIQUE(drug_id, batch_number, warehouse_id)
);

-- Purchase Orders
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY,
  po_number VARCHAR UNIQUE,
  vendor_id UUID REFERENCES vendors(id),
  drug_id UUID REFERENCES drugs(id),
  quantity INT,
  unit_price DECIMAL,
  total_cost DECIMAL,
  status VARCHAR DEFAULT 'draft', -- draft, approved, dispatched, received, invoiced
  order_date TIMESTAMP,
  promised_delivery_date DATE,
  actual_delivery_date DATE,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Goods Receipt Notes (GRN)
CREATE TABLE goods_receipts (
  id UUID PRIMARY KEY,
  po_id UUID REFERENCES purchase_orders(id),
  warehouse_id UUID REFERENCES warehouses(id),
  batch_number VARCHAR,
  received_qty INT,
  received_date TIMESTAMP,
  inspection_status VARCHAR, -- OK, DAMAGED, INCOMPLETE
  quality_notes TEXT,
  discrepancies TEXT,
  received_by UUID REFERENCES users(id),
  created_at TIMESTAMP
);

-- Shipments
CREATE TABLE shipments (
  id UUID PRIMARY KEY,
  tracking_number VARCHAR UNIQUE,
  from_warehouse_id UUID REFERENCES warehouses(id),
  to_hospital_id UUID REFERENCES hospitals(id),
  status VARCHAR DEFAULT 'packed', -- packed, in_transit, out_for_delivery, delivered, returned
  created_date TIMESTAMP,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_by UUID REFERENCES users(id)
);

-- Shipment Line Items
CREATE TABLE shipment_items (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  batch_id UUID REFERENCES batches(id),
  quantity_shipped INT,
  created_at TIMESTAMP
);

-- Shipment Events (audit trail)
CREATE TABLE shipment_events (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  event_type VARCHAR, -- pickup, in_transit, out_for_delivery, delivered, exception
  event_timestamp TIMESTAMP,
  location VARCHAR, -- lat, long (optional)
  notes TEXT,
  reported_by UUID REFERENCES users(id),
  pod_image_url VARCHAR,
  pod_signature_url VARCHAR,
  created_at TIMESTAMP
);

-- Consumption
CREATE TABLE consumption (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  batch_id UUID REFERENCES batches(id),
  quantity INT,
  consumed_date DATE,
  ward VARCHAR,
  department VARCHAR,
  logged_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  entity_type VARCHAR, -- 'drug', 'batch', 'po', 'shipment', etc.
  entity_id UUID,
  action VARCHAR, -- 'CREATE', 'UPDATE', 'DELETE'
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMP,
  old_values JSONB,
  new_values JSONB,
  reason VARCHAR,
  created_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_batches_drug_id ON batches(drug_id);
CREATE INDEX idx_batches_warehouse_id ON batches(warehouse_id);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_shipments_hospital_id ON shipments(to_hospital_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_consumption_hospital_id ON consumption(hospital_id);
CREATE INDEX idx_consumption_consumed_date ON consumption(consumed_date);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

### 4.3 API Endpoints (Key Examples)

```
AUTH
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me

DRUGS
GET    /api/drugs (paginated, filterable)
GET    /api/drugs/:id
POST   /api/drugs (admin only)
PUT    /api/drugs/:id (admin only)

PURCHASE ORDERS
GET    /api/purchase-orders
POST   /api/purchase-orders (procurement officer)
GET    /api/purchase-orders/:id
PUT    /api/purchase-orders/:id/approve (procurement manager)
PUT    /api/purchase-orders/:id/reject
GET    /api/purchase-orders/:id/timeline (status history)

WAREHOUSE
POST   /api/warehouse/grn (create GRN)
GET    /api/warehouse/inventory (current stock by drug, batch)
GET    /api/warehouse/batches/:batchId/traceability
PUT    /api/warehouse/stock-adjustment
GET    /api/warehouse/expiry-alerts?days=30

SHIPMENTS
POST   /api/shipments (create shipment)
GET    /api/shipments/:id
GET    /api/shipments/:id/tracking (events + current status)
PUT    /api/shipments/:id/pod (proof of delivery)
POST   /api/shipments/:id/pod-photo (upload POD image)

CONSUMPTION
POST   /api/consumption/log
GET    /api/consumption/hospital/:hospitalId (consumption history)
GET    /api/consumption/trends?period=month (aggregated by drug)

ANALYTICS
GET    /api/analytics/dashboard (KPIs for user role)
GET    /api/analytics/stockout-frequency
GET    /api/analytics/vendor-performance
GET    /api/analytics/expiry-waste
GET    /api/analytics/procurement-efficiency

AUDIT
GET    /api/audit/logs (filtered by entity, user, date range)
GET    /api/audit/logs/:entityType/:entityId (history for one entity)

ADMIN
GET    /api/admin/users
POST   /api/admin/users (create user)
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/system-settings
```

---

## 5. Authentication & Authorization

### 5.1 JWT Flow

```
User Login:
1. POST /api/auth/login { email, password }
2. Server validates password, generates JWT tokens
3. Response: { access_token, refresh_token, user { id, name, role } }

Client stores: 
- access_token (memory or secure localStorage)
- refresh_token (httpOnly cookie, secure)

Authenticated Request:
1. Client adds: Authorization: Bearer <access_token>
2. Server validates token signature, checks expiry
3. If expired: Client auto-refreshes using refresh_token
4. Resume request with new access_token

Logout:
1. Client discards tokens
2. Server optionally blacklists refresh_token
```

### 5.2 Role-Based Access Control (RBAC)

```
Roles & Permissions:

ADMIN
  ├─ Read/write: All entities
  ├─ User management (create, delete, role assignment)
  └─ System settings, audit logs

PROCUREMENT_OFFICER
  ├─ Create, view POs
  ├─ View vendor performance
  ├─ Approve/reject POs
  ├─ View procurement analytics
  └─ Cannot: Delete POs, access hospital data

VENDOR
  ├─ View own POs
  ├─ Upload shipping documents
  ├─ Track own shipments
  ├─ View payment status
  └─ Cannot: View other vendors' data

WAREHOUSE_MANAGER
  ├─ Create GRN (inbound)
  ├─ View/manage inventory
  ├─ Log stock adjustments
  ├─ Create shipments (allocation)
  ├─ View expiry alerts
  └─ Cannot: Approve POs, delete drugs

HOSPITAL_MANAGER
  ├─ View allocated stock
  ├─ Log consumption
  ├─ Request stock adjustments (damage)
  ├─ Request replenishment
  ├─ View hospital-scoped analytics
  └─ Cannot: Create POs, manage other hospitals

DELIVERY_PERSONNEL
  ├─ View assigned shipments
  ├─ Scan barcodes (pickup/delivery)
  ├─ Capture POD (signature, photos)
  ├─ Report exceptions
  └─ Cannot: View POs, consumption, analytics

// Middleware example:
router.post('/approval', 
  authMiddleware,
  roleMiddleware(['ADMIN', 'PROCUREMENT_MANAGER']),
  controller.approve
);
```

---

## 6. Data Flow Diagrams

### 6.1 Procurement Flow

```
Hospital/Warehouse requests stock
           ↓
Procurement officer reviews
           ↓
System suggests vendors (by price/rating)
           ↓
Officer creates PO
           ↓
PO sent to vendor (email + system notification)
           ↓
Vendor receives PO, prepares shipment
           ↓
Vendor uploads shipping docs
           ↓
Warehouse receives shipment
           ↓
Warehouse staff scan GRN barcodes (quality check)
           ↓
Stock added to inventory
           ↓
Warehouse allocates to hospitals
           ↓
Hospitals receive & log consumption
           ↓
Analytics: feedback loop to next procurement cycle
```

### 6.2 Delivery POD Flow

```
Warehouse packs shipment
           ↓
Delivery personnel scans barcode (mobile, offline-capable)
           ↓
Delivery personnel in transit (GPS optional)
           ↓
Out for delivery: scan again
           ↓
Hospital receives: delivery personnel scans barcode
           ↓
Recipient signature or OTP (captures via mobile)
           ↓
Photos of undamaged goods (optional, if damage suspected)
           ↓
Delivery app posts POD (online sync)
           ↓
Shipment marked "Delivered"
           ↓
Hospital stock updated
```

---

## 7. Offline Capability (Mobile)

### 7.1 Offline Storage Strategy

```
Mobile App:
├─ Sync at login: Download
│  ├─ Hospitals (all)
│  ├─ Current shipments (assigned to user)
│  ├─ Current stock (for hospital staff)
│  └─ Drug master (indexed in SQLite)
│
└─ Local SQLite DB stores:
   ├─ Cached sync'd data
   ├─ Offline action queue (POST actions waiting for online)
   └─ Metadata: last_sync_timestamp

Offline Actions (queued locally):
├─ POD submission (barcode + signature)
├─ Consumption logs
├─ Stock adjustments
└─ Photos (stored locally, uploaded on reconnect)

When online:
├─ Sync: DELETE old offline queue items
├─ Push: All queued actions to server
├─ Pull: Latest data (shipments, stock)
├─ Conflict resolution: Server wins (last-write-wins)
```

### 7.2 Sync Service (Pseudo-code)

```javascript
// syncService.js
class SyncService {
  async syncFromServer(userId) {
    const lastSync = await storage.get('lastSyncTimestamp');
    
    // Pull: Fetch updated data
    const shipments = await api.get(`/shipments?userId=${userId}&since=${lastSync}`);
    const stock = await api.get(`/inventory/hospital/${hospitalId}?since=${lastSync}`);
    
    // Store locally
    await db.shipments.insertMany(shipments);
    await db.stock.insertMany(stock);
    await storage.set('lastSyncTimestamp', Date.now());
  }
  
  async syncToServer() {
    const offlineQueue = await db.offlineQueue.getAll();
    
    for (const action of offlineQueue) {
      try {
        await api.post(action.endpoint, action.payload);
        await db.offlineQueue.delete(action.id);
      } catch (err) {
        if (err.status === 409) {
          // Conflict: server data is newer, skip
          await db.offlineQueue.delete(action.id);
        } else {
          // Retry later
          console.error('Sync failed:', err);
        }
      }
    }
  }
  
  async queueAction(endpoint, payload) {
    // When offline, queue for later
    if (!isOnline()) {
      await db.offlineQueue.insert({ endpoint, payload, createdAt: Date.now() });
      return { offline: true };
    } else {
      return await api.post(endpoint, payload);
    }
  }
}
```

---

## 8. Security Architecture

### 8.1 Data Protection

| Data | Protection | Method |
|------|-----------|--------|
| **Passwords** | Hashed + salt | bcrypt (cost 12) |
| **Auth tokens** | Signed | HS256 (JWT) |
| **Sensitive data** (SSN, bank) | Encrypted | AES-256-GCM |
| **PII at rest** | Encrypted | Column-level encryption |
| **Data in transit** | Encrypted | TLS 1.3 (HTTPS only) |
| **Audit logs** | Tamper-proof | Append-only table, digital signatures |

### 8.2 Compliance

- **HIPAA** (if healthcare data): Encryption, access logs, data retention
- **Pharma Regulations**: 7-year audit trail, batch traceability, expiry tracking
- **GDPR** (if EU users): Right to erasure (anonymization), consent logs
- **India Data Privacy**: Localized data storage (no cross-border transfer)

---

## 9. Deployment Architecture

```
Production Environment:

AWS / GCP / DigitalOcean
├─ VPC (isolated network)
├─ RDS PostgreSQL (primary + read replica)
├─ ElastiCache Redis (session store, rate limit counter)
├─ S3 (POD images, documents)
├─ CloudFront (CDN for static assets)
│
├─ ECS/App Engine (Node.js API)
│  ├─ Horizontal auto-scaling (2–10 instances based on load)
│  ├─ Health checks (readiness + liveness probes)
│  ├─ Container logging (CloudWatch / Stackdriver)
│  └─ Environment secrets (AWS Secrets Manager)
│
├─ CloudFlare (DDoS protection, WAF)
└─ Monitoring
   ├─ Prometheus (metrics)
   ├─ Grafana (dashboards)
   ├─ Datadog or New Relic (APM)
   └─ PagerDuty (on-call alerts)

CI/CD Pipeline:
├─ GitHub Actions / GitLab CI
├─ Stages: Build → Test → Deploy Staging → Deploy Prod
├─ Automated tests: Unit, Integration, E2E
└─ Rollback: Blue-green deployment (instant revert if issues)
```

---

## 10. Performance Optimization

### 10.1 Database

- **Indexing**: BTREE on filtered columns, BRIN on timestamps
- **Partitioning**: Shipments by month, Consumption by quarter
- **Caching**: Redis for frequently-accessed drug master, vendor list
- **Query optimization**: N+1 prevention via joins, batch loading

### 10.2 API

- **Pagination**: Limit 50 items/page default
- **Lazy loading**: Charts load data on demand
- **Rate limiting**: 100 req/min per user (via Redis)
- **Compression**: gzip on all responses

### 10.3 Frontend

- **Code splitting**: Lazy-load route components
- **Image optimization**: WebP, lazy-load for charts/photos
- **State memoization**: Redux selectors, React.memo on large lists
- **Virtual scrolling**: TanStack Table for 10k+ row tables

---

## 11. Monitoring & Logging

```
Logs:
├─ Application logs: Winston/Pino → S3
├─ API request/response: Structured logging
├─ Database slow queries: PostgreSQL logs
├─ Error tracking: Sentry (catches exceptions)
└─ User actions: Audit logs (immutable)

Metrics:
├─ API latency (p50, p95, p99)
├─ Error rate (5xx, validation errors)
├─ Database connection pool utilization
├─ Cache hit ratio
├─ Upstream vendor API availability
└─ Active users (concurrent connections)

Alerts (PagerDuty):
├─ API error rate > 5%
├─ Database replication lag > 10s
├─ Response time p95 > 2s
├─ Disk utilization > 80%
└─ Critical shipment delivery failed
```

---

## 12. Migration Path (Phased Rollout)

```
Phase 1 (MVP): Pilot with 1 warehouse, 5 hospitals
Phase 2: Expand to 3 warehouses, 20 hospitals
Phase 3: National rollout (all hospitals)
Phase 4: Vendor ecosystem integration (RFQ automation)

Data Migration:
├─ Week 1: Export legacy data (Excel → CSV)
├─ Week 2: Transform & validate (Python scripts)
├─ Week 3: Load to PostgreSQL (bulk insert with constraints)
├─ Week 4: Parallel run (new system + legacy, reconcile)
├─ Week 5: Full cutover
```

---

**Document Version**: 1.0  
**Last Updated**: August 16, 2026  
**Next Review**: Post-MVP deployment (Week 6)
