# Role-Wise Implementation Plan (Parallel Work Streams)
## Drug Inventory and Supply Chain Tracking System (PSS04)

**Overview**: 12-week project with 6 roles working in parallel (2-week sprints = 6 sprints total)

**Synchronization**:
- Daily standup (15 min, 10 AM)
- Sprint planning (Fri 4 PM, 1 hour)
- Integration testing (Fri after standup)

---

## Sprint Structure

```
Sprint 1 (Weeks 1–2):   Foundation & Setup
Sprint 2 (Weeks 3–4):   Core Modules (Procurement + Warehouse)
Sprint 3 (Weeks 5–6):   Distribution & Mobile POD
Sprint 4 (Weeks 7–8):   Consumption & Analytics
Sprint 5 (Weeks 9–10):  Mobile Polish & Testing
Sprint 6 (Weeks 11–12): Deployment & Release
```

---

# SPRINT 1: Foundation & Setup (Weeks 1–2)

## Backend Lead (Manav) — 32 hours

**Goal**: Database ready, Express skeleton running, API contracts finalized

**Week 1**
- [ ] **Database Design** (8h)
  - Design schema (users, drugs, batches, vendors, POs, GRN, shipments, consumption, audit)
  - Create ERD (entity relationship diagram)
  - Identify indexes & relationships
  - Document schema decisions (why JSONB for adjustments, why append-only audit logs)
  
- [ ] **PostgreSQL Setup** (4h)
  - Local PostgreSQL + pgAdmin
  - AWS RDS Postgres (staging environment)
  - Create development database
  - Setup connection pooling (PgBouncer or node-postgres pool config)
  - Document connection strings, credentials (in .env)

- [ ] **Express Skeleton** (6h)
  - Initialize Node.js project (npm init, package.json)
  - Setup Express app structure
  - Configure middleware (CORS, body-parser, helmet)
  - Setup dotenv for environment variables
  - Create basic error handling middleware
  - Setup logging (Winston or Pino)
  - Git repo initialization + .gitignore

- [ ] **Documentation** (2h)
  - Write BACKEND_SETUP.md (how to run locally)
  - Document API contract (Swagger/OpenAPI template)
  - Document database schema (human-readable)

**Deliverable**: Express app running on localhost:3000, database schema in PostgreSQL, backend setup doc

---

**Week 2**
- [ ] **Authentication System** (8h)
  - Implement JWT token generation (HS256)
  - Implement password hashing (bcrypt)
  - Create /api/auth/login endpoint
  - Create /api/auth/logout endpoint
  - Create /api/auth/refresh-token endpoint
  - Create middleware to validate JWT on protected routes
  - Document JWT flow & token expiry

- [ ] **Database Migrations** (4h)
  - Setup migration tool (Flyway or node-migrate)
  - Write initial migration (create all tables)
  - Write rollback migration
  - Document how to run migrations
  - Test migration up/down

- [ ] **User & Role Management** (6h)
  - Create User model + CRUD operations
  - Implement 6 roles (ADMIN, PROCUREMENT, VENDOR, WAREHOUSE, HOSPITAL, DELIVERY)
  - Create roleMiddleware (check user role for endpoints)
  - Create /api/admin/users endpoints (GET, POST, PUT, DELETE)
  - Seed initial admin user
  - Write tests for auth & user endpoints

- [ ] **Database Seed Scripts** (2h)
  - Create seed scripts directory
  - Write script to insert 500 drugs (CSV → database)
  - Write script to insert 50 vendors
  - Write script to insert test hospitals & warehouses
  - Document how to run seeds

- [ ] **Finalize API Contract** (4h)
  - Swagger/OpenAPI spec for all endpoints (from architecture doc)
  - Review with Frontend & Mobile leads
  - Freeze API contract (changes need team approval)

**Deliverable**: JWT auth working, user CRUD working, database seeded with master data, API contract frozen in Swagger

---

## Frontend Lead — 28 hours

**Goal**: React project setup, design system ready, component patterns established

**Week 1**
- [ ] **React Project Setup** (6h)
  - Create Vite project
  - Configure build (vite.config.js)
  - Setup .env files (dev, staging, prod)
  - Install core dependencies (React Router, Redux, Axios, Tailwind)
  - Configure Tailwind (tailwind.config.js)
  - Setup ESLint + Prettier
  - Git setup (.gitignore for node_modules, etc.)

- [ ] **Design System & Tokens** (8h)
  - Create colors.css (primary, secondary, success, error, warning, info)
  - Create typography.css (font families, sizes, weights)
  - Create spacing scale (4px, 8px, 16px, 24px, 32px...)
  - Create elevation/shadow system
  - Document in DESIGN_TOKENS.md
  - Create Tailwind config for custom tokens
  - Test tokens across components

- [ ] **Redux Setup** (6h)
  - Setup Redux store structure
  - Create auth slice (user, token, loading, error)
  - Create UI slice (theme, notifications, modals)
  - Create API slice (for caching API responses)
  - Setup Redux DevTools
  - Document Redux structure in REDUX.md

- [ ] **Project Structure** (4h)
  - Create folder structure (components/, services/, hooks/, utils/, store/, styles/)
  - Create base component templates
  - Document file naming conventions
  - Create component storybook template (for later)

- [ ] **Documentation** (4h)
  - Write FRONTEND_SETUP.md
  - Write COMPONENT_PATTERNS.md (how to structure components)
  - Write STATE_MANAGEMENT.md (Redux patterns)
  - Create example component (Button, Card)

**Deliverable**: React app running on localhost:3001, design system documented, Redux setup, example components

---

**Week 2**
- [ ] **Authentication Pages** (6h)
  - Create LoginPage component
    - Email + password form
    - Form validation (email format, password required)
    - Submit handler (POST to /api/auth/login)
    - Error display (invalid credentials, network error)
    - Loading state
  - Create ProtectedRoute component (redirect to login if no token)
  - Setup token refresh interceptor (Axios)
  - Create logout functionality
  - Add CSS transitions

- [ ] **Navigation & Layout** (6h)
  - Create Navbar component
    - Logo, user profile dropdown
    - Logout button
    - Responsive hamburger menu
  - Create Sidebar component
    - Role-based menu items (show different menus for different roles)
    - Collapsible sections
    - Active link highlighting
  - Create LayoutWrapper component (combines Navbar + Sidebar + page content)
  - Test responsive design (mobile, tablet, desktop)

- [ ] **Common Components** (8h)
  - Create Button component (variants: primary, secondary, danger)
  - Create Card component (header, body, footer)
  - Create Modal component (open/close, overlay)
  - Create Alert component (success, error, warning, info)
  - Create Spinner/LoadingIndicator
  - Create SearchBar component
  - Create Pagination component (prev, next, page numbers)
  - Document all components in COMPONENT_LIBRARY.md

- [ ] **Form Infrastructure** (4h)
  - Setup React Hook Form
  - Setup Zod for validation
  - Create FormField component (label, input, error message)
  - Create FormSelect component
  - Create FormCheckbox component
  - Create useForm hook wrapper
  - Document form patterns

- [ ] **HTTP Client Setup** (2h)
  - Create Axios instance (api.js)
  - Setup JWT interceptor (add token to headers)
  - Setup refresh token interceptor (auto-refresh on 401)
  - Setup error handler (log 5xx errors, redirect on 401)
  - Create fetchWrapper function (async handler)

- [ ] **Utilities & Helpers** (2h)
  - Create formatters.js (date, currency, phone, address)
  - Create validators.js (email, phone, drug batch format)
  - Create constants.js (drug categories, statuses, roles)
  - Create helpers.js (array operations, object manipulation)
  - Document utilities

**Deliverable**: LoginPage working, ProtectedRoute protecting pages, Navbar/Sidebar routing, 10+ base components, form infrastructure ready

---

## Mobile Developer — 24 hours

**Goal**: React Native project setup, offline database ready, screen skeletons

**Week 1**
- [ ] **Expo Project Setup** (6h)
  - Create Expo project (npx create-expo-app)
  - Install core dependencies (React Navigation, Redux, Axios, SQLite)
  - Setup folder structure (screens/, components/, services/, database/, store/, utils/)
  - Configure .env files
  - Setup ESLint
  - Git setup

- [ ] **React Navigation Setup** (6h)
  - Create RootNavigator (auth stack vs. app stack)
  - Create AuthNavigator (LoginScreen)
  - Create AppNavigator (drawer nav with role-based menu)
  - Create role-specific navigators:
    - DeliveryNavigator (shipments, POD)
    - HospitalNavigator (stock, consumption)
    - WarehouseNavigator (GRN, inventory)
  - Setup navigation params/props passing
  - Document navigation flow

- [ ] **SQLite Offline Database** (8h)
  - Setup react-native-sqlite-storage
  - Design local database schema (mimic server schema, but lightweight)
  - Create database.js (connection, initialization)
  - Create schema.js (CREATE TABLE statements)
  - Create migrations.js (version tracking)
  - Create CRUD helper functions (insert, select, update, delete)
  - Test database operations
  - Document offline schema

- [ ] **Documentation** (4h)
  - Write MOBILE_SETUP.md
  - Write OFFLINE_DATABASE.md
  - Write SCREEN_PATTERNS.md

**Deliverable**: Expo app running, navigation stacks defined, SQLite initialized, example CRUD operations

---

**Week 2**
- [ ] **Authentication Screens** (4h)
  - Create LoginScreen component
  - Create OTP screen (optional, for field workers)
  - Implement AsyncStorage for token/user storage
  - Implement auto-login (if token exists)
  - Setup auth error handling

- [ ] **Async Storage & Local Cache** (4h)
  - Setup AsyncStorage for key-value data
  - Create storageService.js (get, set, remove, clear)
  - Store user profile, token, last_sync_timestamp
  - Implement cache invalidation (re-sync if >1h old)

- [ ] **Sync Service Infrastructure** (6h)
  - Create syncService.js (outline of offline queue)
  - Create OfflineQueue data structure (SQLite table for pending actions)
  - Implement queueAction(endpoint, payload) function
  - Implement retry logic (exponential backoff)
  - Implement conflict resolution (server wins)
  - Setup sync listener (on app foreground, trigger sync)
  - Document sync architecture

- [ ] **Screen Skeletons** (6h)
  - Create ShipmentListScreen skeleton
  - Create HospitalDashboardScreen skeleton
  - Create WarehouseDashboardScreen skeleton
  - Create ConsumptionLogScreen skeleton
  - Create ProfileScreen skeleton
  - Document expected data structures per screen

- [ ] **Redux Mobile Store** (2h)
  - Create authSlice (user, token, loading, error)
  - Create uiSlice (theme, notifications)
  - Create offlineSlice (queue of pending actions)
  - Create shipmentSlice (loaded shipments)

- [ ] **HTTP Client & Interceptors** (2h)
  - Create Axios instance for React Native
  - Setup JWT interceptor (add token to headers)
  - Setup auto-refresh (on 401)
  - Setup offline detection (NetInfo to detect connectivity)
  - Queue requests when offline

**Deliverable**: Expo app with auth screens, SQLite database, navigation, offline queue architecture defined

---

## QA & DevOps — 16 hours

**Goal**: CI/CD pipeline ready, test infrastructure setup

**Week 1**
- [ ] **GitHub Actions Setup** (6h)
  - Create .github/workflows/ci.yml
  - Setup lint job (ESLint for backend, frontend, mobile)
  - Setup format check (Prettier)
  - Setup dependency audit (npm audit)
  - Trigger on: push to main, PRs
  - Document CI/CD pipeline

- [ ] **Docker Setup** (6h)
  - Create Dockerfile (Node.js backend)
  - Create docker-compose.yml (PostgreSQL + backend)
  - Setup volume mounts (for development)
  - Document docker-compose usage (docker-compose up)
  - Test local environment with Docker

- [ ] **Testing Infrastructure** (2h)
  - Setup Jest for backend
  - Setup Vitest for frontend
  - Setup React Testing Library
  - Document testing commands (npm test)

- [ ] **Environment Setup** (2h)
  - Create .env.example (all three repos)
  - Document environment variables
  - Document secrets management (GitHub Secrets for CI/CD)

**Deliverable**: GitHub Actions CI running, Docker setup working, test framework ready

---

**Week 2**
- [ ] **Database Backups & Monitoring** (4h)
  - Setup AWS RDS automated backups
  - Configure backup retention (7 days development)
  - Document backup/restore procedures
  - Setup CloudWatch basic monitoring

- [ ] **Staging Environment** (6h)
  - Create staging branch + AWS RDS instance
  - Setup CD pipeline (auto-deploy to staging on push to staging branch)
  - Document staging deployment process
  - Document how to reset staging database

- [ ] **Logging Infrastructure** (4h)
  - Setup Winston/Pino on backend
  - Setup request logging (method, path, status, duration)
  - Setup error logging (stack trace, user ID)
  - Configure log rotation (daily, 7-day retention)
  - Identify what to log (transactions, logins, errors)

- [ ] **Monitoring Dashboard** (2h)
  - Create Grafana dashboard template
  - Setup metrics to track (request count, error rate, response time)
  - Document monitoring setup

**Deliverable**: CI/CD pipeline automated, staging environment, logging/monitoring basics

---

## Synchronization Points (Week 2 End)

**Sprint 1 Integration Test (Fri Week 2, 2 PM)**
1. Backend: Run migrations, seed data
2. Frontend: Connect to backend /api/auth/login
3. Mobile: Connect to backend /api/auth/login
4. Test: Login → JWT token received → stored locally → redirected to dashboard

**Go/No-Go Decision**: All 3 can authenticate? → Proceed to Sprint 2

---

# SPRINT 2: Core Modules (Weeks 3–4)

## Backend Lead (Manav) — 32 hours

**Goal**: Procurement + Warehouse endpoints ready

**Week 3**
- [ ] **Drug Management Endpoints** (6h)
  - GET /api/drugs (list, paginate, filter by category)
  - GET /api/drugs/:id (detail)
  - POST /api/drugs (admin only)
  - PUT /api/drugs/:id (admin only)
  - Add caching (Redis) for drug list
  - Write tests

- [ ] **Vendor Management Endpoints** (6h)
  - GET /api/vendors (list, paginate)
  - GET /api/vendors/:id (detail with performance metrics)
  - POST /api/vendors (admin only)
  - PUT /api/vendors/:id (admin only)
  - Calculate performance metrics (on-time %, quality score)
  - Write tests

- [ ] **Purchase Order Schema & Endpoints** (8h)
  - Create PurchaseOrder model
  - GET /api/purchase-orders (list, filter by status, vendor)
  - POST /api/purchase-orders (procurement officer creates)
  - GET /api/purchase-orders/:id (detail with line items)
  - PUT /api/purchase-orders/:id (update draft)
  - Write tests

- [ ] **Stock Model Prep** (6h)
  - Create Batch model (for warehouse module)
  - Create migrations for batches
  - Seed empty batch table
  - Document batch structure

- [ ] **Email Service Setup** (6h)
  - Integrate SendGrid
  - Create emailService.js (send email helper)
  - Create email templates (PO notification, status change)
  - Document email sending
  - Setup email logging (what was sent, to whom, when)

**Deliverable**: Drug, Vendor, PO endpoints ready; email service integrated

---

**Week 4**
- [ ] **Purchase Order Approval Workflow** (8h)
  - PUT /api/purchase-orders/:id/approve (procurement manager)
  - PUT /api/purchase-orders/:id/reject (with reason)
  - PUT /api/purchase-orders/:id/timeline (get status history)
  - Implement status validation (can't approve approved PO)
  - Send email on approval/rejection
  - Log audit trail
  - Write tests

- [ ] **Goods Receipt (GRN) Schema & Endpoints** (8h)
  - Create GoodsReceipt model
  - POST /api/warehouse/grn (warehouse staff creates GRN from PO)
  - GET /api/warehouse/grn/:id (detail)
  - Implement validation (qty matches PO? quality OK?)
  - Create batch records on GRN submission
  - Write tests

- [ ] **Inventory Endpoints** (8h)
  - GET /api/warehouse/inventory (current stock by drug, batch, warehouse)
  - GET /api/warehouse/batches/:batchId/traceability (batch history)
  - GET /api/warehouse/inventory/:hospitalId (hospital's allocated stock)
  - Implement stock calculation (sum quantities by batch)
  - Add caching
  - Write tests

- [ ] **Audit Logging** (4h)
  - Implement audit middleware (log all POST, PUT, DELETE)
  - Store in audit_logs table (entity_id, action, user_id, timestamp, old_values, new_values)
  - Create /api/audit/logs endpoint (admin only)
  - Implement audit query (filter by entity, user, date)

- [ ] **Performance Optimization** (4h)
  - Add database indexes (drug_id, vendor_id, status)
  - Optimize N+1 queries (use joins)
  - Setup query caching (Redis)
  - Test query performance

**Deliverable**: PO approval workflow, GRN creation, inventory tracking, audit logs

---

## Full-Stack Dev 1 — 32 hours

**Goal**: Procurement module (frontend) complete

**Week 3**
- [ ] **Vendor List & Detail Pages** (8h)
  - Create VendorListPage component
    - Table: vendor name, contact, on-time %, quality score
    - Filters: active/inactive, sort by rating
    - Pagination
  - Create VendorDetailPage component
    - Vendor info (name, contact, bank details)
    - Performance metrics (on-time %, price rank)
    - Recent POs (from this vendor)
    - Ability to edit vendor (admin only)
  - Connect to backend /api/vendors

- [ ] **Drug List & Detail Pages** (8h)
  - Create DrugListPage component
    - Table: drug name, category, manufacturer, unit price
    - Filters: category, manufacturer
    - Pagination, search
  - Create DrugDetailPage component
    - Drug info (name, category, manufacturer, expiry threshold)
    - Current stock across all warehouses
    - Consumption trends (from last 30 days)
  - Connect to backend /api/drugs

- [ ] **Bulk Import Dialog** (6h)
  - Create CSV upload form (drugs, vendors)
  - Validate CSV format
  - Show preview (first 5 rows)
  - Submit & show result (X rows imported, Y errors)
  - Document CSV format

- [ ] **Purchase Order Form** (6h)
  - Create PurchaseOrderForm component
    - Step 1: Select vendor (searchable dropdown)
    - Step 2: Select drug (searchable dropdown)
    - Step 3: Enter quantity, unit price (auto-calc total)
    - Step 4: Review & submit
  - Form validation (qty > 0, price > 0)
  - Error handling (show error messages)
  - Success message (PO created, show PO ID)

- [ ] **Setup & Documentation** (4h)
  - Write PROCUREMENT_MODULE.md
  - Document form patterns used
  - Document component hierarchy

**Deliverable**: VendorList, VendorDetail, DrugList, DrugDetail, PurchaseOrderForm

---

**Week 4**
- [ ] **Purchase Order List & Detail Pages** (8h)
  - Create PurchaseOrderListPage component
    - Table: PO ID, vendor, drug, qty, status, order date
    - Filters: status (draft, approved, dispatched, received, invoiced)
    - Sort: by date, vendor, status
    - Pagination
  - Create PurchaseOrderDetailPage component
    - PO header (ID, vendor, drug, qty, unit price, total cost)
    - Status timeline (created → approved → dispatched → received → invoiced)
    - Line items (if multi-item POs)
    - Actions: Edit (if draft), Approve (if pending), Reject
  - Connect to backend /api/purchase-orders

- [ ] **Approval Workflow UI** (8h)
  - Create ApprovalDialog component
    - Show PO details
    - Approve button → confirm → submit
    - Reject button → reason field → confirm → submit
    - Add approval comment field (optional)
  - Implement role check (show "Approve" button only for PROCUREMENT_MANAGER)
  - Show approval status (pending your approval, already approved by X)
  - Implement loading state (submitting approval)
  - Success message (PO approved, email sent to vendor)

- [ ] **PurchaseOrder Redux & API Integration** (6h)
  - Create procurementSlice (Redux)
    - purchaseOrders (list)
    - selectedPO (detail)
    - loading, error
  - Create procurementService.js (API calls)
    - createPO, getPOs, getPODetail, approvePO, rejectPO
  - Implement async thunks (createAsyncThunk)
  - Test Redux integration

- [ ] **Tables & Filtering** (6h)
  - Implement TanStack Table (React Table) for PO list
  - Add filtering (by status, vendor, date range)
  - Add sorting (by date, vendor, amount)
  - Add column resizing
  - Test table performance (1000+ rows)

- [ ] **Testing & Refinement** (4h)
  - Write component tests (PurchaseOrderForm, PurchaseOrderList)
  - Test form validation
  - Test approval workflow
  - Test error handling

**Deliverable**: Complete procurement module (form, list, approval, detail)

---

## Full-Stack Dev 2 — 32 hours

**Goal**: Warehouse module (frontend) complete

**Week 3**
- [ ] **Inventory View** (8h)
  - Create InventoryViewPage component
    - Table: drug name, batch number, qty, location (bin), expiry date, warehouse
    - Filters: drug, warehouse, status (in stock, reserved, expired)
    - Search by drug name or batch number
    - Pagination
    - Show color-coded status (green=OK, yellow=7 days to expiry, red=expired)
  - Implement stock calculation (sum qty by batch)
  - Add "ABC analysis" badge (high-value, medium, low)
  - Connect to backend /api/warehouse/inventory

- [ ] **Expiry Alerts** (8h)
  - Create ExpiryAlertsPage component
    - Table: drug name, batch number, expiry date, days remaining, quantity, warehouse
    - Filter by days until expiry (30, 15, 7 days)
    - Color-coded urgency (green < 7 days, red < 3 days)
    - Actions: Mark as disposed, move to disposal queue
  - Real-time alert (refresh every 5 min)
  - Show total value of at-risk inventory
  - Allow bulk disposal action

- [ ] **Stock Adjustment Form** (6h)
  - Create StockAdjustmentForm component
    - Select reason (damage, loss, expiry, count discrepancy)
    - Select batch (dropdown)
    - Enter adjustment qty & reason details
    - Submit & show confirmation
    - Require approval from warehouse manager
  - Form validation (qty <= current qty)
  - Show pending adjustments (awaiting approval)

- [ ] **Batch Traceability** (6h)
  - Create BatchTraceabilityPage component
    - Show batch journey: GRN received → location → shipments → consumption
    - Timeline: received date, location assignments, shipment dates
    - Link to GRN, shipments, hospital consumption
    - Show all movements of this batch
  - Connect to backend /api/warehouse/batches/:batchId/traceability

- [ ] **Setup & Documentation** (4h)
  - Write WAREHOUSE_MODULE.md
  - Document component patterns

**Deliverable**: InventoryView, ExpiryAlerts, StockAdjustmentForm, BatchTraceability

---

**Week 4**
- [ ] **GRN Creation & Submission Form** (10h)
  - Create GRNForm component
    - Step 1: Select PO (searchable, shows vendor/drug/qty)
    - Step 2: Select warehouse (dropdown)
    - Step 3: Enter received qty, batch number, inspection checklist
    - Step 4: Optional barcode scan (add multiple batches)
    - Step 5: Quality inspection (seal OK, no damage, docs complete)
    - Step 6: Review & submit
  - Form validation (batch number format, received qty)
  - Show discrepancies (received qty != PO qty)
  - Success message (GRN created, batches added to inventory)
  - Connect to backend /api/warehouse/grn

- [ ] **GRN List & Detail Pages** (6h)
  - Create GRNListPage component
    - Table: GRN ID, PO ID, warehouse, drug, received qty, date, status
    - Filters: status (pending, completed), date range
    - Pagination
  - Create GRNDetailPage component
    - GRN header (ID, PO, drug, received qty)
    - Inspection checklist (show results)
    - Discrepancies (if any)
    - Action: Reject (if quality issues)

- [ ] **Bin Assignment** (6h)
  - Create BinAssignmentPage component
    - Manual bin assignment (drag-drop or form)
    - FIFO enforcement (warn if assigning newer batch to location with older batch)
    - Bin capacity tracking (don't overload)
    - Show current bin utilization
  - Connect to backend (update batch location)

- [ ] **Warehouse Dashboard** (6h)
  - Create WarehouseDashboardPage component
    - KPIs: total stock value, utilization %, at-risk inventory (expiring soon)
    - Recent GRNs (last 10)
    - Expiry alerts (next 30 days)
    - Stock by category (pie chart)
    - Warehouse health score (space used, expiry rate)

- [ ] **Testing & Refinement** (4h)
  - Write component tests (GRNForm, InventoryView)
  - Test form validation
  - Test stock calculation accuracy
  - Test filtering & pagination

**Deliverable**: GRN creation, GRN list/detail, bin assignment, warehouse dashboard

---

## Mobile Developer — 24 hours

**Goal**: Warehouse scanning screens & hospital stock view ready

**Week 3**
- [ ] **Barcode Scanner Component** (8h)
  - Create BarcodeScannerComponent (react-native-camera or expo-barcode-scanner)
  - Configure camera permissions
  - Handle scanned barcode (parse, validate format)
  - Show scanned data (drug name, batch, expected qty)
  - Add manual fallback (type batch number)
  - Test barcode format (QR codes, barcodes)
  - Document barcode format expected

- [ ] **Warehouse Receipt Screen** (8h)
  - Create ReceiptScanScreen component
    - Link to PO (select PO or scan barcode)
    - Scan batches (camera or manual)
    - For each scan: show drug name, expected qty, confirm received qty
    - Add to receipt (cumulative list)
    - Quality checklist (seal OK, no damage, docs)
    - Submit → GRN created

- [ ] **Hospital Stock View** (6h)
  - Create StockLevelScreen component
    - Show current allocated stock (pull from SQLite cache)
    - Filter by: drug name, category, status
    - Display: drug, qty, batch, expiry date
    - Color-code by status (OK, low, expired)
    - Pull-to-refresh (sync from server)
  - Implement local SQLite caching
  - Test offline display (no network)

- [ ] **Documentation** (2h)
  - Write MOBILE_WAREHOUSE.md
  - Document barcode format

**Deliverable**: BarcodeScannerComponent, ReceiptScanScreen, StockLevelScreen

---

**Week 4**
- [ ] **Warehouse Dashboard Screen** (6h)
  - Create WarehouseDashboardScreen (mobile version)
    - KPIs: stock value, utilization, at-risk inventory
    - Recent GRNs (last 5)
    - Expiry alerts widget
    - Quick actions (Scan receipt, Create shipment)
    - Refresh on pull-to-refresh

- [ ] **Hospital Dashboard Screen** (8h)
  - Create HospitalDashboardScreen component
    - Current stock value
    - Upcoming expirations (next 7 days)
    - Low-stock alerts
    - Recent shipments (inbound)
    - Quick actions (Log consumption, Request stock)

- [ ] **Stock Adjustment Screen (Mobile)** (6h)
  - Create StockAdjustmentScreen component
    - Select reason (damage, loss, expiry)
    - Select batch
    - Enter adjustment qty
    - Add reason details
    - Submit → uploaded to server (or queued if offline)

- [ ] **SQLite Sync Optimization** (4h)
  - Implement lazy-load (cache on-demand)
  - Implement background sync (every 5 min)
  - Implement partial updates (only changed data)
  - Test battery drain

**Deliverable**: Warehouse dashboard, hospital dashboard, offline sync optimized

---

## QA & DevOps — 16 hours

**Week 3**
- [ ] **Integration Tests** (8h)
  - E2E test: Create PO → GRN received → Stock updated
  - Test vendor performance calculation
  - Test inventory calculations (sum qty by batch)
  - Test audit logging (verify all changes logged)
  - Setup test database (clean before each test)

- [ ] **API Contract Testing** (4h)
  - Validate all endpoints match Swagger spec
  - Test pagination (limit, offset)
  - Test filtering (various filter combinations)
  - Test error responses (400, 401, 403, 404, 500)

- [ ] **Performance Testing** (2h)
  - Test inventory query (1M+ records)
  - Test PO list with filters (1000+ POs)
  - Verify indexes working

- [ ] **Documentation** (2h)
  - Write TEST_PLAN.md
  - Document test data setup

**Deliverable**: Integration tests passing, test infrastructure ready

---

**Week 4**
- [ ] **Mobile Testing** (6h)
  - Test ReceiptScanScreen (barcode scanning)
  - Test offline queueing (submit offline, sync when online)
  - Test form validation
  - Test on real devices (iOS/Android)

- [ ] **Load Testing** (4h)
  - Simulate 50 concurrent users (inventory queries)
  - Simulate 20 PO submissions
  - Measure response times (p50, p95, p99)
  - Identify bottlenecks

- [ ] **Staging Deployment** (4h)
  - Deploy backend to staging
  - Deploy frontend to staging
  - Deploy mobile to TestFlight/Play Store beta
  - Smoke test all endpoints

- [ ] **Regression Testing** (2h)
  - Test auth flow (login, logout, refresh)
  - Test RBAC (different roles see different menus)
  - Test audit logging

**Deliverable**: All integration tests passing, load test results, staging live

---

## Synchronization Points (Week 4 End)

**Sprint 2 Integration Test (Fri Week 4, 2 PM)**
1. Backend: All endpoints ready for procurement + warehouse
2. Frontend: Procurement module complete (form, list, approval)
3. Frontend: Warehouse module complete (GRN, inventory, expiry alerts)
4. Mobile: Barcode scanning, receipt screen, dashboard screens ready
5. QA: E2E tests passing (PO → GRN → stock updated)

**Test Scenario**: 
- Create PO (vendor A, drug X, qty 100)
- Warehouse receives shipment (scan barcode)
- Create GRN (received 100, quality OK)
- Verify stock updated in inventory view
- Hospital sees stock available
- Hospital logs consumption (qty 10)
- Verify stock reduced to 90

**Go/No-Go Decision**: All core module tests passing? → Proceed to Sprint 3

---

# SPRINT 3: Distribution & Mobile POD (Weeks 5–6)

## Backend Lead (Manav) — 28 hours

**Goal**: Shipment endpoints, allocation rules, POD submission ready

**Week 5**
- [ ] **Shipment Creation Endpoints** (8h)
  - POST /api/shipments (warehouse creates shipment)
  - PUT /api/shipments/:id (update shipment status)
  - GET /api/shipments (list, filter by status, to_hospital)
  - GET /api/shipments/:id (detail with line items)
  - Implement stock reservation (reduce available qty)
  - Implement allocation rules (apply custom rules)
  - Write tests

- [ ] **Allocation Rules Engine** (8h)
  - Create allocation rules (JSON format: if-then rules)
  - Implement rule evaluation (apply to shipment batches)
  - Create /api/shipments/allocation-rules (admin manages rules)
  - Example rules:
    - Prioritize pediatric drugs to rural hospitals
    - Don't allocate more than 30% of stock to one hospital
    - FIFO (ship oldest batches first)
  - Document rule syntax

- [ ] **Shipment Events Tracking** (8h)
  - Create ShipmentEvent model (log status changes)
  - Implement event logging (packed, in_transit, out_for_delivery, delivered, exception)
  - GET /api/shipments/:id/tracking (show event timeline)
  - Implement event timestamps
  - Write tests

- [ ] **POD (Proof of Delivery) Endpoints** (4h)
  - PUT /api/shipments/:id/pod (submit POD data)
  - Accept: signature_image, photos, recipient_name, timestamp
  - Store images in S3
  - Mark shipment as delivered
  - Update hospital stock (add to inventory)

**Deliverable**: Shipment CRUD, allocation rules, event tracking, POD submission

---

**Week 6**
- [ ] **Return Management** (6h)
  - POST /api/shipments/:id/return (initiate return)
  - Reasons: damaged, refused, wrong item, quality issue
  - Create return shipment (back to warehouse)
  - Implement RMA (Return Merchandise Authorization) workflow
  - Write tests

- [ ] **Shipment Exceptions** (6h)
  - POST /api/shipments/:id/exception (report issue)
  - Reasons: shortfall, damage, delay, other
  - Allow photo upload (evidence)
  - Notify warehouse manager
  - Log in shipment events
  - Write tests

- [ ] **Delivery Personnel Assignment** (4h)
  - Associate user (delivery personnel) with shipments
  - GET /api/users/:userId/shipments (assigned shipments)
  - Implement delivery location tracking (optional lat/long)
  - Write tests

- [ ] **Analytics for Distribution** (6h)
  - Calculate delivery performance metrics
    - Avg delivery time
    - On-time delivery %
    - Exception rate
  - Create /api/analytics/delivery-performance endpoint
  - Implement caching
  - Write tests

- [ ] **Performance Optimization** (6h)
  - Add indexes on shipment queries (to_hospital_id, status, created_at)
  - Optimize allocation rule evaluation (cache rules)
  - Test shipment list with 10k+ shipments

**Deliverable**: Return management, exceptions handling, delivery analytics, performance optimizations

---

## Full-Stack Dev 2 — 32 hours

**Goal**: Shipment UI (web) complete

**Week 5**
- [ ] **Shipment Creation Form** (10h)
  - Create ShipmentCreatePage component
    - Step 1: Select from_warehouse
    - Step 2: Select to_hospital
    - Step 3: Select batches to ship (multi-select with qty)
    - Step 4: Apply allocation rules (show suggestions)
    - Step 5: Review & submit
  - Form validation (hospital has existing stock, batch qty available)
  - Auto-calculate allocation rules
  - Show allocation rule reason ("prioritized to rural hospitals")
  - Success message (shipment created, show tracking number)

- [ ] **Shipment List & Detail Pages** (8h)
  - Create ShipmentListPage component
    - Table: shipment ID, to_hospital, items (drug names), status, created date, delivery date
    - Filters: status, hospital, date range
    - Pagination
  - Create ShipmentDetailPage component
    - Shipment header (ID, warehouse, hospital, tracking number)
    - Line items (batch, drug, qty)
    - Status timeline (packed → in_transit → out_for_delivery → delivered)
    - POD info (signature image, photos, timestamp)
    - Exception details (if any)

- [ ] **Shipment Tracking UI** (6h)
  - Create ShipmentTrackingPage component
    - Map view (show expected delivery location)
    - Event timeline (show all events)
    - Live updates (auto-refresh every 5 min)
    - Show current status + ETA
  - Optional: Integrate Google Maps API

- [ ] **Allocation Rules UI** (4h)
  - Create AllocationRuleEngine component (admin only)
    - List current rules
    - Add/edit rule (JSON form or visual builder)
    - Test rule (apply to sample shipment, show results)
    - Delete rule
  - Document rule syntax with examples

- [ ] **Setup & Documentation** (4h)
  - Write DISTRIBUTION_MODULE.md

**Deliverable**: Shipment creation, list, detail, tracking, allocation rules UI

---

**Week 6**
- [ ] **Return & Exception UI** (8h)
  - Create ReturnShipmentPage component
    - List returns (filter by status: pending, approved, received)
    - Detail page (show original shipment, reason, RMA number)
    - Approve return (warehouse manager)
    - Edit return reason
  - Create ExceptionReportingPage component
    - Report exception (select reason)
    - Upload photos (damage evidence)
    - Submit details
    - Track exception status

- [ ] **Delivery Personnel Assignment** (4h)
  - Create DeliveryPersonnelAssignmentPage component (warehouse only)
    - Shipment list (not yet assigned)
    - Assign to delivery person (dropdown)
    - Show assigned shipments per person
    - Unassign (if needed)

- [ ] **Delivery Dashboard** (6h)
  - Create DeliveryDashboardPage component
    - Role-specific: Show only for delivery personnel
    - My assigned shipments (status, location, recipient)
    - Quick action: Start delivery
    - Completed deliveries (today, this week)
    - Performance stats (deliveries/day, on-time %)

- [ ] **Distribution Analytics** (6h)
  - Create DistributionAnalyticsPage component
    - Avg delivery time (trend chart)
    - On-time delivery % (by period)
    - Exception rate (chart)
    - Hospital-wise delivery performance (sortable table)
  - Connect to backend /api/analytics/delivery-performance

- [ ] **Testing & Refinement** (2h)
  - Write component tests (ShipmentCreateForm, ShipmentList)
  - Test allocation rule application
  - Test exception reporting

**Deliverable**: Return management UI, delivery dashboard, distribution analytics

---

## Mobile Developer — 32 hours

**Goal**: Complete POD workflow, delivery tracking screens

**Week 5**
- [ ] **Shipment List Screen** (6h)
  - Create ShipmentListScreen component
    - Show assigned shipments (pull from server or local cache)
    - Filter by: status, date, location
    - Show: shipment ID, to_hospital, item count, status
    - Tap to view detail
    - Pull-to-refresh (sync)
    - Offline-capable (cache last sync'd data)

- [ ] **Shipment Detail Screen** (6h)
  - Create ShipmentDetailScreen component
    - Show shipment header (ID, from/to, items)
    - Show items (drug name, batch, qty, expected)
    - Show recipient contact (address, phone)
    - Show status timeline
    - Action button: "Start Delivery"

- [ ] **Delivery Confirmation Screen (Multi-Step POD)** (12h)
  - Create DeliveryConfirmationScreen component
    - Step 1: Barcode scan (verify shipment)
      - Scan shipment tracking number
      - Show shipment details
    - Step 2: Item confirmation
      - Scan each item barcode (or confirm manually)
      - Check off items as scanned
    - Step 3: Recipient signature
      - Show SignaturePadComponent
      - Recipient signs on device
      - Save signature image
    - Step 4: Photos (optional, for damage)
      - Allow camera/gallery photo upload
      - Show preview
    - Step 5: Recipient details
      - Name field
      - Phone field (optional)
    - Step 6: Review & submit
      - Show summary
      - Button: "Submit POD"
  - Form validation (all items scanned, signature captured)
  - Offline queueing (if offline, queue for sync when online)
  - Show success message (delivery confirmed)

- [ ] **Exception Reporting** (8h)
  - Create ExceptionReportingScreen component
    - Select exception reason (shortfall, damage, refused, other)
    - Enter qty short/damaged
    - Add notes
    - Upload photos
    - Submit
  - Allow exceptions without full POD

**Deliverable**: Shipment list, detail, complete POD workflow (barcode + signature + photos), exception reporting

---

**Week 6**
- [ ] **POD Image Management** (6h)
  - Implement image compression (reduce size before upload)
  - Implement local storage (save POD images locally)
  - Implement S3 upload (on sync, post images to S3)
  - Handle failed uploads (retry)
  - Show upload progress

- [ ] **Signature Capture Refinement** (4h)
  - Improve SignaturePadComponent (size, pressure sensitivity)
  - Add "Clear" button (redo signature)
  - Test on various screen sizes
  - Test touch sensitivity

- [ ] **Offline POD Queue** (6h)
  - Store POD data locally (SQLite)
  - Queue image uploads
  - Sync when online (retry failed uploads)
  - Show sync status (X pending PODs)
  - Notify user on successful sync

- [ ] **Delivery Performance Screen** (6h)
  - Create DeliveryPerformanceScreen component
    - Show deliveries today (count, on-time %)
    - Show pending deliveries (in priority order)
    - Show completed deliveries (this week)
    - Earnings/incentive info (if applicable)

- [ ] **Testing & Refinement** (4h)
  - Test POD capture (all steps)
  - Test offline queue (submit offline, sync when online)
  - Test on real devices (iOS/Android)
  - Test with slow network

- [ ] **Documentation** (2h)
  - Write MOBILE_POD_WORKFLOW.md

**Deliverable**: Complete POD workflow, offline queue, image management, delivery performance tracking

---

## QA & DevOps — 16 hours

**Week 5**
- [ ] **E2E Test: Full Delivery Flow** (8h)
  - Test: Create shipment → Assign to delivery person → Delivery person captures POD → Hospital receives stock → Stock updated
  - Test offline scenarios (POD submitted offline, synced when online)
  - Test exception reporting
  - Test image uploads

- [ ] **Mobile Testing on Real Devices** (4h)
  - Test POD capture on iOS (iPhone 12+)
  - Test POD capture on Android (Pixel 4+)
  - Test barcode scanning
  - Test signature capture
  - Test photo upload

- [ ] **Performance Testing** (2h)
  - Test shipment list (1000+ shipments)
  - Test image compression (reduce from 5MB to 500KB)
  - Test offline queue sync (100+ pending PODs)

- [ ] **Documentation** (2h)
  - Update TEST_PLAN.md with delivery flow tests

**Deliverable**: E2E delivery flow tests passing, mobile device testing complete

---

**Week 6**
- [ ] **Load Testing (Distribution)** (4h)
  - Simulate 20 concurrent deliveries (POD submissions)
  - Simulate shipment list queries (100+ users)
  - Measure response times

- [ ] **Staging Verification** (4h)
  - Deploy backend, frontend, mobile changes to staging
  - Run full E2E test suite
  - Verify images upload to S3
  - Verify POD data saved correctly

- [ ] **Browser & Device Compatibility** (4h)
  - Test web on Chrome, Firefox, Safari, Edge
  - Test mobile on iOS 14+ and Android 10+
  - Test responsive design (mobile, tablet, desktop)

- [ ] **Regression Testing** (2h)
  - Re-test procurement module (wasn't changed)
  - Re-test warehouse module (wasn't changed)
  - Verify all existing tests still pass

- [ ] **Documentation** (2h)
  - Update deployment runbook with S3 image upload steps

**Deliverable**: All tests passing, staging live with full distribution flow

---

## Synchronization Points (Week 6 End)

**Sprint 3 Integration Test (Fri Week 6, 2 PM)**
1. Backend: Shipment endpoints, allocation rules, POD submission ready
2. Frontend: Shipment CRUD, allocation rules UI, delivery dashboard complete
3. Mobile: POD capture (barcode + signature + photos) working, offline queue ready
4. QA: E2E tests passing (create shipment → POD → stock updated)

**Test Scenario**: 
- Warehouse creates shipment (10 batches to hospital A)
- Allocation rules applied (prioritize pediatric drugs)
- Delivery person assigned
- Delivery person captures POD (barcode scan, signature, photo)
- POD syncs to server (or queued if offline)
- Shipment marked delivered
- Hospital stock updated (inventory +10 batches)
- Distribution analytics updated (on-time delivery %)

**Go/No-Go Decision**: Distribution flow tests passing? → Proceed to Sprint 4

---

# SPRINT 4: Consumption & Analytics (Weeks 7–8)

## Backend Lead (Manav) — 24 hours

**Goal**: Consumption endpoints, analytics endpoints, expiry management

**Week 7**
- [ ] **Consumption Logging Endpoints** (8h)
  - POST /api/consumption/log (hospital logs consumption)
  - GET /api/consumption/hospital/:hospitalId (consumption history)
  - GET /api/consumption/batch/:batchId (all hospitals using this batch)
  - Implement stock reduction (reduce batch qty on consumption)
  - Implement batch traceability (log which hospital consumed which batch)
  - Write tests

- [ ] **Stock Adjustment Approval** (6h)
  - PUT /api/warehouse/stock-adjustment/:id/approve (approve adjustment)
  - PUT /api/warehouse/stock-adjustment/:id/reject (reject with reason)
  - Implement status validation
  - Log audit trail
  - Send notifications

- [ ] **Expiry Management Job** (6h)
  - Create cron job (runs daily at 2 AM)
  - Find batches expiring today
  - Mark as expired
  - Create disposal log entry
  - Send alert email (to warehouse manager)
  - Calculate expiry waste metrics

- [ ] **Hospital Alerts** (4h)
  - POST /api/alerts (create alert subscription)
  - Get current alerts (low stock, upcoming expiry, new shipments)
  - Implement push notification triggers
  - Document alert types

**Deliverable**: Consumption logging, stock adjustments, expiry automation, alerts

---

**Week 8**
- [ ] **Analytics Endpoints** (12h)
  - GET /api/analytics/dashboard (role-specific KPIs)
    - Procurement: Budget vs. actual, vendor performance
    - Warehouse: Stock health, expiry timeline, utilization
    - Hospital: Current stock value, consumption trends
    - System: Overall metrics (stockout %, waste %)
  - GET /api/analytics/stockout-frequency (by drug, hospital, time period)
  - GET /api/analytics/vendor-performance (on-time %, quality score, price rank)
  - GET /api/analytics/expiry-waste (total value, % of purchases)
  - GET /api/analytics/procurement-efficiency (budget vs. actual, cycle time)
  - GET /api/analytics/consumption-trends (by drug, hospital, time)
  - Optimize queries (use materialized views or Redis caching)
  - Write tests

- [ ] **Report Generation** (6h)
  - Implement PDF report generation (backend)
  - Create report templates (procurement summary, warehouse health, vendor scorecards)
  - Implement CSV export
  - Create /api/reports/generate endpoint
  - Write tests

- [ ] **Demand Forecasting (Basic)** (4h)
  - Simple moving average (MA) of last 30 days consumption
  - Create /api/analytics/forecast (basic 7-day forecast)
  - Show reorder point (based on consumption trend)
  - Document forecasting method

- [ ] **Batch-Level Analytics** (2h)
  - Track batch cost (per unit)
  - Track batch consumption (# hospitals using it)
  - Identify slow-moving batches

**Deliverable**: Comprehensive analytics endpoints, report generation, basic demand forecasting

---

## Full-Stack Dev 2 — 28 hours

**Goal**: Consumption UI, analytics dashboards

**Week 7**
- [ ] **Consumption Logging Page** (8h)
  - Create ConsumptionLogPage component
    - Mode 1: Barcode scan (scan batch → show details → confirm qty consumed)
    - Mode 2: Manual entry (drug dropdown → batch dropdown → qty → confirm)
    - Show current stock before consumption
    - Show reduced stock after consumption
    - Log ward, department, notes
    - Submit & show confirmation
  - Implement batch validation (can't consume more than available)
  - Implement stock update (optimistic UI update)
  - Connect to backend /api/consumption/log

- [ ] **Consumption History Page** (6h)
  - Create ConsumptionHistoryPage component
    - Table: date, drug, batch, qty, ward, department, logged_by
    - Filters: date range, drug, ward, batch
    - Pagination
  - Create drill-down (click row → see batch history across all hospitals)
  - Export option (CSV)

- [ ] **Stock Adjustment Approval Page** (6h)
  - Create StockAdjustmentApprovalPage component (warehouse manager only)
    - List pending adjustments
    - Detail view (reason, damage description, photos, qty adjusted)
    - Actions: Approve or Reject (with reason)
    - Show history (approved/rejected adjustments)

- [ ] **Hospital Consumption Dashboard** (4h)
  - Create HospitalConsumptionDashboardPage component
    - KPIs: avg consumption/day, stock value, days of inventory on hand
    - Top consumed drugs (bar chart)
    - Consumption trend (line chart, last 30 days)
    - Reorder recommendations

- [ ] **Setup & Documentation** (4h)
  - Write CONSUMPTION_MODULE.md

**Deliverable**: Consumption logging, history, adjustment approval, hospital dashboard

---

**Week 8**
- [ ] **Dashboard Component** (10h)
  - Create DashboardPage component (main landing page)
    - Role-based layout (different for each role)
    - Procurement Officer dashboard:
      - KPI cards: budget spent, # vendors, procurement efficiency, avg cycle time
      - Charts: budget vs. actual (line chart), vendor on-time % (bar chart)
      - Alerts: pending POs for approval, budget overruns
    - Warehouse Manager dashboard:
      - KPI cards: stock value, utilization %, at-risk inventory, expiry waste
      - Charts: stock by category (pie), inventory turnover (line), expiry timeline (bar)
      - Alerts: upcoming expirations, low stock drugs, GRN discrepancies
    - Hospital Manager dashboard:
      - KPI cards: stock value, days of inventory, consumption rate, stockout incidents
      - Charts: top consumed drugs (bar), consumption trend (line), reorder recommendations
      - Alerts: upcoming expirations, low stock, new shipments
    - System Admin dashboard:
      - KPI cards: total system stock, expiry waste %, stockout %, active users
      - Charts: procurement timeline, hospital demand heatmap, vendor performance

- [ ] **Analytics Pages** (10h)
  - Create StockoutAnalyticsPage component
    - Stockout frequency (line chart over time)
    - Drugs with highest stockout rate (bar chart)
    - Hospitals with highest stockout incidents (bar chart)
    - Filter by date range
  - Create VendorPerformancePage component
    - Vendor scorecards (table: on-time %, quality score, price rank)
    - Sort by metric
    - Drill down (click vendor → recent POs, delivery history)
  - Create ExpiryWastePage component
    - Expiry waste % (metric card)
    - Waste trend (line chart)
    - Waste by category (pie chart)
    - Worst-performing drugs (table)

- [ ] **Report Export UI** (6h)
  - Create ReportGeneratorPage component
    - Select report type (procurement summary, warehouse health, vendor scorecard)
    - Select date range
    - Select format (PDF, CSV)
    - Generate & download
    - Show generation status (loading, success, error)

- [ ] **Charts & Visualization** (2h)
  - Implement Recharts integration (line charts, bar charts, pie charts)
  - Style charts (colors, fonts, tooltips)
  - Responsive design (charts resize on mobile)

- [ ] **Testing & Refinement** (0h - time built in above)

**Deliverable**: Dashboard (role-based), stockout/vendor/expiry analytics pages, report export, comprehensive charts

---

## Mobile Developer — 24 hours

**Goal**: Consumption logging (mobile), hospital dashboard screens, push notifications

**Week 7**
- [ ] **Consumption Logging Screen (Mobile)** (8h)
  - Create ConsumptionLogScreen component
    - Mode 1: Barcode scan (scan batch number)
    - Mode 2: Manual (drug dropdown → batch dropdown)
    - Show current stock (from local cache)
    - Qty input field (with +/- buttons)
    - Ward/department selection (dropdown)
    - Notes field (optional)
    - Submit button
  - Implement offline queueing (POST when online)
  - Update local SQLite on consumption
  - Show success message
  - Document input patterns

- [ ] **Hospital Dashboard Screen** (8h)
  - Create HospitalDashboardScreen component
    - KPIs: stock value, days of inventory, consumption rate
    - Upcoming expirations widget (next 7 days)
    - Low-stock alerts (red banner)
    - Recent shipments inbound (countdown)
    - Quick actions: Log consumption, View inventory, Request stock
    - Pull-to-refresh (sync)
    - Offline-capable (show cached data)

- [ ] **Alerts & Notifications** (6h)
  - Implement push notifications (Expo Notifications)
  - Alert types: Critical stockout, Upcoming expiry, New shipment
  - Local notifications (when alert created)
  - Background notification handler (app closed)
  - Settings: Toggle notifications by type
  - Test push notification delivery

- [ ] **Warehouse Dashboard Screen (Mobile)** (2h)
  - Create WarehouseDashboardScreen (mobile version)
    - Similar to web, but mobile-optimized
    - KPIs: stock value, utilization %, at-risk inventory
    - Quick action: Scan receipt

**Deliverable**: Consumption logging, hospital dashboard, warehouse dashboard, push notifications

---

**Week 8**
- [ ] **Analytics Screens (Mobile)** (8h)
  - Create ConsumptionTrendScreen component
    - Top consumed drugs (bar chart)
    - Consumption trend (line chart, last 30 days)
    - Filter by ward, department
    - Swipe between charts
  - Create StockoutAnalyticsScreen component (basic version)
    - Stockout frequency (this month)
    - Low-stock alerts (current)
  - Create InventoryHealthScreen component
    - Stock value (metric)
    - Days of inventory (metric)
    - Expiry timeline (simple list)

- [ ] **Report Download** (4h)
  - Implement PDF download to mobile (documents folder)
  - Implement CSV download
  - Show download progress
  - Open/share downloaded files

- [ ] **Offline Mode Enhancements** (6h)
  - Implement consumption caching (local SQLite)
    - Log consumption offline
    - Queue POST for sync
  - Implement demand forecast sync (sync forecast data for reorder points)
  - Implement background sync (every 15 min if online)
  - Show sync status indicator

- [ ] **Testing & Refinement** (6h)
  - Test consumption logging offline → sync
  - Test push notifications
  - Test PDF/CSV download
  - Test on real devices

**Deliverable**: Analytics screens, report downloads, enhanced offline mode with background sync

---

## QA & DevOps — 16 hours

**Week 7**
- [ ] **Consumption Flow Tests** (6h)
  - E2E test: Hospital logs consumption → stock reduced → analytics updated
  - Test offline consumption (logged offline, synced when online)
  - Test consumption validation (can't exceed available qty)
  - Test batch traceability (query which hospitals consumed which batch)

- [ ] **Analytics Validation** (6h)
  - Test KPI calculations (stockout %, waste %, turnover rate)
  - Validate numbers match raw data
  - Test filtering (by date range, hospital, drug)
  - Load test analytics queries (1M+ consumption records)

- [ ] **Push Notifications** (2h)
  - Test push notification delivery
  - Test on real devices (iOS/Android)
  - Verify notification content

- [ ] **Documentation** (2h)
  - Update TEST_PLAN.md with consumption tests

**Deliverable**: Consumption flow tests passing, analytics validation, push notification testing

---

**Week 8**
- [ ] **Dashboard Load Testing** (4h)
  - Simulate dashboard loading (100 concurrent users)
  - Measure KPI calculation time
  - Identify slow queries

- [ ] **Report Generation Testing** (4h)
  - Test PDF report generation (accuracy, formatting)
  - Test CSV export (data integrity, column order)
  - Test with large datasets (10k+ records)

- [ ] **Staging Deployment** (4h)
  - Deploy all changes to staging
  - Smoke test (all endpoints, dashboards, reports)
  - Verify analytics calculations
  - Verify push notification setup

- [ ] **Regression Testing** (2h)
  - Re-test procurement module
  - Re-test warehouse module
  - Re-test distribution module
  - All existing tests passing

- [ ] **Documentation** (2h)
  - Update deployment runbook
  - Document analytics calculation formulas

**Deliverable**: All analytics & consumption tests passing, staging live with full analytics

---

## Synchronization Points (Week 8 End)

**Sprint 4 Integration Test (Fri Week 8, 2 PM)**
1. Backend: Consumption endpoints, analytics endpoints, expiry automation ready
2. Frontend: Consumption logging, hospital dashboard, analytics dashboards complete
3. Mobile: Consumption logging (offline-capable), hospital dashboard, push notifications
4. QA: E2E tests (consumption flow, analytics accuracy)

**Test Scenario**: 
- Hospital logs consumption (10 units of drug X from batch Y)
- Stock updated (inventory -10)
- Consumption recorded in analytics
- Demand forecast updated
- Reorder point calculated
- Stockout alert triggered (if below threshold)
- Batch traceability shows consumption
- Dashboard KPIs updated (consumption rate, turnover)
- Push notification sent (if low stock)

**Go/No-Go Decision**: All analytics & consumption tests passing? → Proceed to Sprint 5

---

# SPRINT 5: Mobile Polish & Testing (Weeks 9–10)

## Mobile Developer — 32 hours

**Goal**: Offline sync robustness, barcode scanning, battery optimization

**Week 9**
- [ ] **Robust Offline Sync** (12h)
  - Implement exponential backoff (retry with delay)
  - Implement queue persistence (survive app restart)
  - Implement conflict resolution (server wins)
  - Implement sync timeout (fail after 30s, retry later)
  - Test: Submit POD offline → 5 min offline → reconnect → POD synced
  - Test: Server updated shipment status → mobile stale → reconnect → refresh
  - Implement sync resume (resume interrupted syncs)
  - Document sync protocol

- [ ] **Barcode Scanner Optimization** (6h)
  - Improve scanner accuracy (test various barcode types)
  - Add vibration feedback (haptic on successful scan)
  - Add sound feedback (optional, user toggle)
  - Implement multi-scan (scan multiple items in sequence)
  - Test on slow devices (older phones)
  - Optimize performance (don't block UI during scan)

- [ ] **App Icon & Splash Screen** (4h)
  - Design app icon (use brand colors)
  - Create splash screen (logo + app name)
  - Configure icon for iOS (multiple sizes)
  - Configure icon for Android (multiple densities)
  - Test icon display (correct size, colors)

- [ ] **Notifications Refinement** (6h)
  - Implement notification channels (iOS, Android)
  - Implement notification actions (tap → open relevant screen)
  - Implement deep linking (notification → POD screen)
  - Test notification delivery
  - Handle notification permissions (request on first use)

- [ ] **Battery & Network Optimization** (4h)
  - Reduce background sync frequency (every 15 min → every 30 min)
  - Implement adaptive sync (more frequent on WiFi, less on cellular)
  - Optimize SQLite queries (use indexes)
  - Profile app with DevTools (measure memory, CPU)

**Deliverable**: Robust offline sync, barcode scanner optimized, app icon, splash screen, notifications refined

---

**Week 10**
- [ ] **Performance Optimization** (10h)
  - Profile app (React Native DevTools)
  - Optimize slow screens (reduce re-renders)
  - Implement code splitting (lazy-load screens)
  - Optimize images (compress, lazy-load)
  - Test on low-end device (Android Go, iPhone SE)
  - Measure: App startup time, screen load time, battery drain
  - Document optimizations made

- [ ] **Accessibility (Mobile)** (6h)
  - Test with screen reader (TalkBack, VoiceOver)
  - Add accessibility labels to all components
  - Test keyboard navigation (if applicable)
  - Test color contrast (text readable)
  - Test touch targets (buttons 44x44 px minimum)

- [ ] **Multiple Language Support (Mobile)** (4h)
  - Extract all UI strings to translation files
  - Support English + Hindi
  - Implement language switching
  - Test Hindi RTL layout (if needed)

- [ ] **Testing on Real Devices** (8h)
  - Test on iPhone 12 (iOS)
  - Test on Samsung Galaxy A10 (Android)
  - Test on low-end device (Android Go)
  - Test all screens manually
  - Test all workflows end-to-end
  - Document any device-specific issues

- [ ] **Build & Deployment Prep** (4h)
  - Configure Expo EAS Build
  - Create build for TestFlight (iOS)
  - Create build for Google Play (Android)
  - Document build process
  - Test TestFlight installation

**Deliverable**: Performance-optimized app, accessibility tested, multi-language support, app ready for build

---

## QA & DevOps — 32 hours

**Goal**: Comprehensive testing, E2E coverage, load testing

**Week 9**
- [ ] **E2E Test Suite (Playwright/Cypress)** (16h)
  - Write E2E tests for all major workflows:
    1. Procurement: Create PO → Approve → Receive GRN → Inventory updated
    2. Warehouse: Receive GRN → Assign bins → Stock allocated
    3. Distribution: Create shipment → Deliver → POD captured → Stock transferred
    4. Consumption: Log consumption → Stock reduced → Analytics updated
    5. Analytics: Dashboard loads → KPIs calculated → Filters work
  - Setup test data (pre-populate drugs, vendors, hospitals)
  - Configure test environment (staging database)
  - Parallel test runs (reduce execution time)
  - Generate test report (HTML)

- [ ] **Unit Test Coverage** (8h)
  - Write unit tests for critical services
    - Backend: allocation rules, stock calculations, KPI formulas
    - Frontend: Redux slices, utilities, formatters
    - Mobile: offline queue, sync logic
  - Aim for >80% coverage
  - Setup coverage reporting (Codecov)

- [ ] **Integration Tests** (6h)
  - Test API + database integration
  - Test offline queue (SQLite + API)
  - Test image upload (frontend + backend + S3)
  - Test email notifications (SendGrid)

- [ ] **Documentation** (2h)
  - Update TEST_PLAN.md (comprehensive)
  - Document test data setup
  - Document test execution instructions

**Deliverable**: E2E test suite covering all major workflows, >80% unit test coverage, integration tests

---

**Week 10**
- [ ] **Load & Stress Testing** (10h)
  - Simulate 100 concurrent users
    - Login/logout
    - View dashboards
    - Submit PODs
    - Log consumption
  - Measure: Response time (p50, p95, p99), error rate, resource utilization
  - Identify bottlenecks
  - Optimize if needed
  - Document load test results

- [ ] **Penetration & Security Testing** (8h)
  - Test OWASP top 10
    - SQL injection (test API input validation)
    - XSS (test frontend input handling)
    - CSRF (verify CSRF token)
    - Authentication bypass (test JWT expiry, refresh)
    - Authorization (test RBAC enforcement)
  - Test data encryption (passwords hashed, PII encrypted)
  - Test audit logging (all changes logged)
  - Document security test results

- [ ] **Browser & Device Compatibility** (6h)
  - Test web on Chrome, Firefox, Safari, Edge (latest versions)
  - Test mobile on iOS 14+ (iPad, iPhone)
  - Test mobile on Android 10+ (various devices)
  - Document compatibility matrix

- [ ] **Regression Testing** (6h)
  - Run full test suite (unit, integration, E2E)
  - Verify no regressions
  - Test all modules (procurement, warehouse, distribution, consumption, analytics)
  - Generate test report

- [ ] **Performance Profiling** (2h)
  - Measure database query times
  - Identify N+1 queries
  - Measure API response times
  - Measure frontend rendering times

**Deliverable**: All load/security/compatibility tests passing, comprehensive test report, performance profiling

---

## Full-Stack Dev 1 & 2 — (Support Only, Testing Focus)

**Week 9–10**
- [ ] Help QA with test data setup
- [ ] Assist with debugging test failures
- [ ] Performance profiling & optimization
- [ ] Documentation updates

---

## Backend Lead (Manav) — (Support Only, Bug Fixes)

**Week 9–10**
- [ ] Fix bugs found in testing
- [ ] Optimize slow queries
- [ ] Review security findings
- [ ] Deploy fixes to staging

---

## Synchronization Points (Week 10 End)

**Sprint 5 Integration Test (Fri Week 10, 2 PM)**
1. All E2E tests passing
2. Load test (100 concurrent users) successful
3. Security audit complete (no critical issues)
4. Mobile app optimized (startup <2s, memory <150MB)
5. All browsers/devices tested
6. Test coverage >80%

**Go/No-Go Decision**: All tests passing, load test successful, security OK? → Proceed to Sprint 6 (Deployment)

---

# SPRINT 6: Deployment & Release (Weeks 11–12)

## QA & DevOps — 40 hours

**Goal**: Production deployment, go-live support

**Week 11**
- [ ] **Production Environment Setup** (12h)
  - Setup AWS RDS production database (multi-AZ)
  - Setup ECS production cluster
  - Configure CloudFront CDN
  - Setup S3 for images (production bucket)
  - Setup CloudWatch alarms (API error rate, database latency)
  - Setup Datadog or New Relic (APM)
  - Configure SSL/TLS certificates
  - Setup DNS records
  - Document production infrastructure

- [ ] **Database Migration Planning** (6h)
  - Test migration scripts on staging
  - Backup production database (daily)
  - Create rollback plan
  - Document migration steps
  - Schedule maintenance window (off-peak: 2–4 AM)

- [ ] **Deployment Pipeline (Production)** (8h)
  - Setup GitHub Actions for production CD
  - Configure blue-green deployment (zero-downtime)
  - Implement automated rollback (if errors)
  - Test deployment on staging
  - Document deployment procedure

- [ ] **Monitoring & Alerting** (6h)
  - Setup Grafana dashboards (production)
  - Configure alerts:
    - API error rate > 5%
    - Database latency > 1s
    - Memory usage > 80%
    - Disk space > 80%
  - Setup on-call rotation (PagerDuty)
  - Document runbook for common issues

- [ ] **Documentation & Training** (6h)
  - Write deployment runbook (step-by-step)
  - Write troubleshooting guide
  - Write incident response plan
  - Create training slides for support team

- [ ] **Pre-Launch Checklist** (2h)
  - Verify all systems working
  - Backup production database
  - Brief on-call team
  - Prepare rollback procedure

**Deliverable**: Production infrastructure ready, deployment pipeline configured, monitoring live, training complete

---

**Week 12**
- [ ] **Launch Day (Week 12 Monday, Scheduled at 2 AM)** (8h)
  - Execute database migration
  - Deploy backend to production
  - Deploy frontend to production
  - Deploy mobile app to TestFlight/Play Store
  - Smoke test all endpoints
  - Verify monitoring (no alerts)
  - Brief go-live team
  - Monitor system health (24/7 for 48h)

- [ ] **Go-Live Support** (24h)
  - Respond to critical bugs (SLA: 1h fix)
  - Monitor production logs
  - Monitor user feedback (emails, support tickets)
  - Prepare hotfixes if needed
  - Stand by for emergency rollback

- [ ] **Documentation** (4h)
  - Update runbooks with actual production details
  - Document any issues encountered
  - Create post-mortem (if needed)

- [ ] **Handoff & Transition** (2h)
  - Handoff to production support team
  - Brief on monitoring/alerting
  - Provide contact info for emergencies

**Deliverable**: Successfully deployed to production, zero critical bugs, system stable

---

## All Developers — (Support Only, On-Call)

**Week 11–12**
- [ ] Monitor production logs
- [ ] Respond to critical issues
- [ ] Support go-live team
- [ ] Answer technical questions

---

## Synchronization Points (Week 12 End)

**Launch Verification (Fri Week 12, 5 PM)**
1. Production deployment successful
2. Zero critical issues in 48h of go-live
3. Monitoring live & alerting working
4. Support team trained & ready
5. Hospital teams trained & using system

**Project Success Criteria Met**:
✓ Procurement → Warehouse → Distribution → Consumption workflow complete  
✓ 99.5% uptime  
✓ All tests passing  
✓ 3 hospitals live and trained  
✓ Documentation complete  
✓ Production deployment successful  

---

# Role-Wise Time Summary

| Role | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 | **Total** |
|------|----------|----------|----------|----------|----------|----------|----------|
| **Backend Lead** | 32h | 32h | 28h | 24h | 8h | 8h | **132h** |
| **Frontend Lead** | 28h | 32h | 20h | 20h | 8h | 4h | **112h** |
| **Mobile Dev** | 24h | 24h | 32h | 24h | 32h | 4h | **140h** |
| **Full-Stack Dev 1** | — | 32h | 24h | 28h | 4h | 4h | **92h** |
| **Full-Stack Dev 2** | — | 32h | 24h | 28h | 4h | 4h | **92h** |
| **QA & DevOps** | 16h | 16h | 16h | 16h | 32h | 40h | **136h** |
| **TOTAL PER SPRINT** | **100h** | **168h** | **144h** | **140h** | **88h** | **64h** | **704h** |

---

# Key Milestones & Gates

```
Sprint 1 End (Week 2 Fri):
  ✓ Login working (web + mobile)
  ✓ Database schema finalized
  → Go/No-Go: Can authenticate? → Proceed

Sprint 2 End (Week 4 Fri):
  ✓ Procurement module complete
  ✓ Warehouse module complete
  → Go/No-Go: PO → GRN → stock updated? → Proceed

Sprint 3 End (Week 6 Fri):
  ✓ Shipment creation complete
  ✓ POD capture working (mobile)
  → Go/No-Go: Create shipment → POD → stock transferred? → Proceed

Sprint 4 End (Week 8 Fri):
  ✓ Consumption logging complete
  ✓ Analytics dashboards complete
  → Go/No-Go: All workflows & analytics working? → Proceed

Sprint 5 End (Week 10 Fri):
  ✓ All tests passing
  ✓ Load test successful
  ✓ Security audit passed
  → Go/No-Go: Ready for production deployment? → Proceed

Sprint 6 End (Week 12 Fri):
  ✓ Production deployment successful
  ✓ Go-live support complete
  → Project Complete
```

---

# Daily Standups & Weekly Syncs

**Daily Standup (10 AM, 15 min)**
- Each person: What I did yesterday, what I'm doing today, blockers?
- Backend Lead: Coordinates overall progress, unblocks issues

**Sprint Planning (Every Fri 4 PM, 1 hour)**
- Retrospective (what went well, what didn't)
- Review completed tasks
- Plan next sprint (assign tasks)
- Identify blockers early

**Integration Testing (Every Fri 2 PM, 1 hour)**
- Test cross-module workflows
- Verify no regressions
- Document test results

---

# Decision Rights & Escalation

| Decision | Owner | Timeline |
|----------|-------|----------|
| **Architecture changes** | Backend Lead + Team Review | Must align with all (1 day) |
| **API contract changes** | Backend Lead + Frontend/Mobile approval | Freeze spec by Week 1 (urgent only) |
| **Feature scope changes** | Backend Lead (project lead) | Only if <4h impact, else defer to next sprint |
| **Priority disputes** | Backend Lead (project lead) | Final decision maker |
| **Bug vs. Feature** | QA Lead input, Backend Lead decision | Decide in daily standup |

---

**Document Version**: 2.0 (Role-Wise)  
**Last Updated**: August 16, 2026  
**Next Review**: Post-Sprint 1 (Week 2 Friday)
