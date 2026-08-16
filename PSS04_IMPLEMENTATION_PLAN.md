# Implementation Plan
## Drug Inventory and Supply Chain Tracking System (PSS04)

**Version**: 1.0  
**Project Duration**: 12 weeks (MVP to production)  
**Team Size**: 6 people (2 seniors, 4 mid-level)  
**Target Release**: Week 12

---

## Executive Summary

This document details the week-by-week breakdown, task allocation, dependencies, and risk mitigation for PSS04. The MVP (Weeks 1–4) focuses on core procurement → warehouse → delivery flows. Subsequent phases add analytics, consumption tracking, and optimization.

---

## Team Structure & Roles

### Core Team (6 people)

**Backend Lead (Senior 1)** - Manav's expertise fits here
- Owns: Database schema, API architecture, auth, business logic
- Key decisions: Data modeling, performance optimization, security
- Availability: 40h/week

**Frontend Lead (Senior 2)**
- Owns: React architecture, component design, state management
- Key decisions: UI patterns, accessibility, performance
- Availability: 40h/week

**Mobile Developer (Mid 1)**
- Owns: React Native app, offline sync, mobile UX
- Works with: Frontend Lead (shared UI patterns), Backend Lead (API integration)
- Availability: 40h/week

**Full-Stack Developer 1 (Mid 2)**
- Owns: Procurement module (PO creation, approval workflow)
- Collaborates: Backend Lead (schema), Frontend Lead (forms)
- Availability: 40h/week

**Full-Stack Developer 2 (Mid 3)**
- Owns: Warehouse module (GRN, inventory, expiry)
- Collaborates: Backend Lead (schema), Frontend Lead (dashboards)
- Availability: 40h/week

**QA & DevOps (Mid 4)**
- Owns: Testing (unit, integration, E2E), CI/CD, deployment
- Works with: All developers (test specs, deployment pipeline)
- Availability: 40h/week

---

## Week-by-Week Breakdown

### **WEEK 1: Setup & Foundation** (Total: 40 hours)

**Objectives**
- Environment setup (dev, staging, prod)
- Database schema finalized
- API skeleton & authentication
- Project scaffolding (web + mobile)
- Team alignment on patterns

#### Tasks by Role

**Backend Lead (Manav)**
- [ ] PostgreSQL setup (local + AWS RDS staging)
- [ ] Design & write database schema (users, drugs, batches, vendors, POs, GRN, shipments, consumption)
- [ ] Create initial migrations (Flyway or node-migrate)
- [ ] Setup Express app scaffold with middleware (auth, logging, error handling)
- [ ] Implement JWT auth (login endpoint, token validation)
- [ ] Document API contract (Swagger/OpenAPI)
- **Time**: 16 hours

**Frontend Lead**
- [ ] Create React project (Vite)
- [ ] Setup Redux, Redux Toolkit
- [ ] Create folder structure (components, services, hooks, utils)
- [ ] Setup Tailwind CSS + Headless UI
- [ ] Create LoginPage component skeleton
- [ ] Setup Axios instance with interceptors (JWT refresh)
- [ ] Document component patterns & design tokens
- **Time**: 12 hours

**Mobile Developer**
- [ ] Create Expo project (React Native)
- [ ] Setup navigation (React Navigation stacks)
- [ ] Create folder structure (screens, components, services, database)
- [ ] Setup SQLite for offline storage
- [ ] Create LoginScreen skeleton
- [ ] Document screen patterns & navigation flow
- **Time**: 10 hours

**QA & DevOps**
- [ ] Setup GitHub Actions for CI/CD
- [ ] Create test environments (dev, staging)
- [ ] Setup Docker for local development
- [ ] Create deployment checklist
- [ ] Setup monitoring dashboards (Grafana placeholder)
- **Time**: 2 hours (mostly config)

**All**
- [ ] Kickoff meeting: Review architecture, data model, API contract
- [ ] Establish code standards (linting, formatting, commit message format)
- [ ] Setup shared documentation (Notion or Confluence page)

**Deliverables**
- ✓ Database schema (finalized, reviewed)
- ✓ Express app running on localhost:3000 with `/api/auth/login` endpoint
- ✓ React app running on localhost:3001 with LoginPage
- ✓ Mobile app running in Expo with LoginScreen
- ✓ CI/CD pipeline triggered on commits (placeholder tests)
- ✓ API documentation (Swagger)

**Dependencies**
- AWS account (RDS, S3)
- GitHub organization
- Team onboarded on dev tools (Git, Docker, PostGIS)

---

### **WEEK 2: Authentication & User Management** (Total: 40 hours)

**Objectives**
- Complete auth system (login, logout, token refresh)
- RBAC setup (roles, permissions)
- User management (admin can CRUD users)
- Protected routes on web + mobile

#### Tasks by Role

**Backend Lead**
- [ ] Implement password hashing (bcrypt)
- [ ] Implement JWT tokens (access + refresh)
- [ ] Create `/api/auth/login` endpoint
- [ ] Create `/api/auth/logout` endpoint
- [ ] Create `/api/auth/refresh-token` endpoint
- [ ] Create `/api/auth/me` endpoint (current user)
- [ ] Implement roleMiddleware (check user role for endpoints)
- [ ] Create user CRUD endpoints (`/api/admin/users`)
- [ ] Seed initial admin user + sample roles
- [ ] Write tests for auth flows
- **Time**: 14 hours

**Frontend Lead**
- [ ] Create LoginPage form (email, password validation)
- [ ] Create ProtectedRoute component (redirects to login if no token)
- [ ] Implement token storage (localStorage + httpOnly cookie handling)
- [ ] Implement auto-refresh logic (refresh token on 401)
- [ ] Create logout functionality
- [ ] Create role-based conditional rendering (e.g., show "Approve" button only for PROCUREMENT role)
- [ ] Setup Redux slices for auth (user, token, isLoading)
- [ ] Write tests for auth flows
- **Time**: 12 hours

**Mobile Developer**
- [ ] Create LoginScreen form (email, password)
- [ ] Implement AsyncStorage for token/user data
- [ ] Implement auto-refresh logic (retry on 401)
- [ ] Create ProtectedScreen wrapper
- [ ] Create logout functionality
- [ ] Setup Redux slices for mobile auth
- [ ] Write tests for mobile auth
- **Time**: 10 hours

**QA & DevOps**
- [ ] Write integration tests (login → get user → logout)
- [ ] Test auth flows on staging
- [ ] Document auth troubleshooting guide
- **Time**: 4 hours

**Deliverables**
- ✓ Login/logout working end-to-end (web + mobile)
- ✓ Token refresh working (401 → refresh → retry)
- ✓ Role-based access control working (admin user can create other users)
- ✓ Protected routes (redirect to login if not authenticated)
- ✓ Integration tests passing

**Dependencies**
- Week 1 foundation (database, Express, React, React Native)

---

### **WEEK 3: Drug Master & Vendor Management** (Total: 40 hours)

**Objectives**
- Drug CRUD (create, list, filter, detail)
- Vendor CRUD & profiles
- Basic master data seeding

#### Tasks by Role

**Backend Lead**
- [ ] Create `/api/drugs` endpoints (GET list, POST create, PUT update, GET detail)
- [ ] Create `/api/drugs/:id` endpoints
- [ ] Implement pagination & filtering (by category, manufacturer)
- [ ] Create `/api/vendors` endpoints (GET list, POST create, PUT update)
- [ ] Create vendor performance tracking (placeholder: queries for future analytics)
- [ ] Write database queries for drug list with filters
- [ ] Seed 500+ common drugs (CSV import script)
- [ ] Seed 50+ vendors
- [ ] Write tests for drug & vendor endpoints
- **Time**: 12 hours

**Frontend Lead**
- [ ] Create DrugListPage with pagination, search, filters
- [ ] Create DrugDetailPage
- [ ] Create DrugForm component (modal or separate page)
- [ ] Create VendorListPage with sorting, filters
- [ ] Create VendorDetailPage
- [ ] Create VendorForm component
- [ ] Implement bulk import dialog (CSV upload)
- [ ] Write tests for drug & vendor components
- **Time**: 14 hours

**Full-Stack Dev 1**
- [ ] Create data files (drug CSV, vendor CSV)
- [ ] Implement import scripts (validate, transform, load)
- [ ] Test data import pipeline
- **Time**: 8 hours

**QA & DevOps**
- [ ] Write tests for bulk import
- [ ] Test filtering & pagination performance
- **Time**: 6 hours

**Deliverables**
- ✓ Drug list page with search/filter working
- ✓ Vendor list page with search/filter working
- ✓ CRUD operations for drugs & vendors
- ✓ 500+ drugs + 50+ vendors in database
- ✓ Tests passing

---

### **WEEK 4: Procurement Module (PO Creation & Approval)** (Total: 40 hours)

**Objectives**
- Purchase Order creation (manual)
- Approval workflow (draft → approved → dispatched)
- Vendor communication (email notifications)

#### Tasks by Role

**Backend Lead**
- [ ] Create `/api/purchase-orders` endpoints (GET, POST, PUT)
- [ ] Create PO approval flow (PUT `/api/purchase-orders/:id/approve`)
- [ ] Create PO rejection flow (PUT `/api/purchase-orders/:id/reject`)
- [ ] Implement status validation (can't approve draft POs, etc.)
- [ ] Create email notifications (Sendgrid integration)
- [ ] Implement PO status history tracking
- [ ] Write tests for PO workflow
- **Time**: 14 hours

**Full-Stack Dev 1**
- [ ] Create PurchaseOrderForm component
- [ ] Create PurchaseOrderList component (filterable by status, vendor)
- [ ] Create PurchaseOrderApproval component (for procurement officer)
- [ ] Create PO detail page with timeline
- [ ] Implement email template for PO notification
- [ ] Write tests for PO components
- **Time**: 16 hours

**Frontend Lead** (Support)
- [ ] Review PO form design, ensure consistency
- **Time**: 2 hours

**QA & DevOps**
- [ ] Write E2E test: Create PO → Approve → Vendor receives email
- [ ] Test PO validation (can't create with invalid vendor, qty 0, etc.)
- **Time**: 8 hours

**Deliverables**
- ✓ Create PO form working (select vendor, drug, quantity, unit price)
- ✓ PO list page with filtering by status
- ✓ Approval workflow (procurement officer approves PO)
- ✓ Email notification to vendor on PO creation
- ✓ E2E tests passing

**Dependencies**
- Week 1–3 foundation

---

### **WEEK 5: Warehouse Module (GRN & Inventory)** (Total: 40 hours)

**Objectives**
- Goods Receipt Note (GRN) creation on inbound
- Inventory tracking by drug, batch, location
- Expiry alert system

#### Tasks by Role

**Backend Lead**
- [ ] Create `/api/warehouse/grn` endpoints (POST create GRN)
- [ ] Create batch creation logic (on GRN submission)
- [ ] Create `/api/warehouse/inventory` endpoints (GET current stock)
- [ ] Create `/api/warehouse/batches/:batchId/traceability` (batch history)
- [ ] Create expiry alert system (daily job to find 30/15/7 day expirations)
- [ ] Implement stock reservation (for shipments)
- [ ] Write tests for warehouse operations
- **Time**: 14 hours

**Full-Stack Dev 2**
- [ ] Create GRNForm component (link to PO, barcode scan field, inspection checklist)
- [ ] Create InventoryView component (table: drug, batch, qty, location, expiry)
- [ ] Create ExpiryAlerts component (badge, alert color coding)
- [ ] Create BatchTraceabilityPage (show GRN → batch history)
- [ ] Implement barcode scanning integration (placeholder for week 6)
- [ ] Write tests for warehouse components
- **Time**: 16 hours

**Mobile Developer**
- [ ] Create ReceiptScanScreen (barcode input field for GRN)
- [ ] Create local SQLite sync for inventory data (cache for offline)
- [ ] Write tests for mobile warehouse operations
- **Time**: 8 hours

**QA & DevOps**
- [ ] Write E2E test: Create PO → Vendor ships → GRN received → Stock updated
- [ ] Test expiry alert trigger
- **Time**: 2 hours

**Deliverables**
- ✓ GRN creation flow working (manual drug/qty entry, inspection checklist)
- ✓ Inventory view showing current stock by batch, location
- ✓ Expiry alerts showing (30/15/7 days before expiry)
- ✓ Batch traceability page (GRN → batch → location)
- ✓ E2E tests passing

**Dependencies**
- Week 4 (PO module)

---

### **WEEK 6: Distribution Module (Shipments & POD)** (Total: 40 hours)

**Objectives**
- Shipment creation (bundle batches for hospitals)
- Delivery tracking (status updates)
- Proof of Delivery (POD) via mobile

#### Tasks by Role

**Backend Lead**
- [ ] Create `/api/shipments` endpoints (GET, POST)
- [ ] Create `/api/shipments/:id/tracking` (shipment events)
- [ ] Create `/api/shipments/:id/pod` endpoint (POD submission)
- [ ] Create shipment event logging system (packed → in_transit → out_for_delivery → delivered)
- [ ] Create stock reservation logic (reduce available stock when shipment created)
- [ ] Write tests for shipment operations
- **Time**: 14 hours

**Full-Stack Dev 2**
- [ ] Create ShipmentCreate component (allocate drugs to hospitals, auto-allocation rules)
- [ ] Create ShipmentList component (filterable by status, to_hospital)
- [ ] Create ShipmentDetail page (show items, tracking, expected delivery date)
- [ ] Create manual allocation rules UI (e.g., "prioritize pediatric drugs to rural hospitals")
- [ ] Write tests for shipment components
- **Time**: 12 hours

**Mobile Developer**
- [ ] Create ShipmentListScreen (assigned shipments)
- [ ] Create DeliveryConfirmationScreen (multi-step: barcode scan, recipient signature, photos)
- [ ] Create BarcodeScannerComponent (barcode input field)
- [ ] Create SignaturePadComponent (signature capture via react-native-signature-canvas)
- [ ] Create PhotoCaptureComponent (upload POD photos from camera roll or capture)
- [ ] Create offline queue for POD (POST when online)
- [ ] Write tests for mobile delivery
- **Time**: 12 hours

**Frontend Lead** (Support)
- [ ] Review shipment forms & modal layouts
- **Time**: 2 hours

**QA & DevOps**
- [ ] Write E2E test: Warehouse packs shipment → Delivery person confirms POD → Hospital receives → Stock updated
- [ ] Test offline POD queue (submit offline, sync when online)
- **Time**: 0 hours (covered by mobile dev testing)

**Deliverables**
- ✓ Shipment creation from warehouse
- ✓ Shipment list & detail pages (web)
- ✓ POD capture via mobile (barcode + signature + photos)
- ✓ Shipment status tracking (packed → delivered)
- ✓ Offline POD queue (sync when online)
- ✓ E2E tests passing

**Dependencies**
- Week 5 (warehouse inventory)

---

### **WEEK 7: Consumption Tracking & Expiry Management** (Total: 40 hours)

**Objectives**
- Hospital-level consumption logging
- Stock adjustments (damage, loss)
- Automated expiry disposal tracking

#### Tasks by Role

**Backend Lead**
- [ ] Create `/api/consumption/log` endpoint (hospital logs consumption)
- [ ] Create `/api/consumption/hospital/:hospitalId` (consumption history)
- [ ] Create stock update logic (reduce batch qty on consumption)
- [ ] Create `/api/warehouse/stock-adjustment` endpoint (damage/loss adjustments)
- [ ] Create adjustment approval workflow (warehouse manager approves)
- [ ] Create expiry disposal job (automated, runs daily)
- [ ] Write tests for consumption & adjustments
- **Time**: 14 hours

**Full-Stack Dev 2**
- [ ] Create ConsumptionLogScreen (drug/batch dropdown + qty + confirm)
- [ ] Create StockAdjustmentForm (reason, discrepancy reason, approval notes)
- [ ] Create ConsumptionHistory view (filter by date, drug, ward)
- [ ] Create ExpiryDisposalLog (view of disposed drugs)
- [ ] Write tests for consumption components
- **Time**: 14 hours

**Mobile Developer**
- [ ] Create ConsumptionLogScreen (with barcode scanning option)
- [ ] Create StockAdjustmentScreen (mobile version)
- [ ] Implement local SQLite update on consumption (sync when online)
- [ ] Write tests for mobile consumption
- **Time**: 10 hours

**QA & DevOps**
- [ ] Write E2E test: Hospital logs consumption → Stock reduced → Inventory updated
- [ ] Test expiry disposal job (trigger manually, verify logs)
- **Time**: 2 hours

**Deliverables**
- ✓ Hospital consumption logging (web + mobile)
- ✓ Stock adjustments with approval workflow
- ✓ Expiry disposal tracking (auto-marked as disposed after date)
- ✓ Consumption history reports
- ✓ E2E tests passing

**Dependencies**
- Week 5 (inventory)

---

### **WEEK 8: Analytics & Dashboards** (Total: 40 hours)

**Objectives**
- Real-time KPI dashboard
- Trend charts (stockouts, procurement efficiency)
- Vendor performance scorecards
- Reports (PDF/CSV export)

#### Tasks by Role

**Backend Lead**
- [ ] Create analytics endpoints (KPI aggregations)
  - `/api/analytics/dashboard` (role-specific KPIs)
  - `/api/analytics/stockout-frequency` (by drug, hospital)
  - `/api/analytics/vendor-performance` (on-time %, price rank)
  - `/api/analytics/expiry-waste` (% of stock expired)
  - `/api/analytics/procurement-efficiency` (budget vs. actual)
- [ ] Optimize queries (use materialized views or caching)
- [ ] Create report generation endpoints (PDF/CSV)
- [ ] Write tests for analytics
- **Time**: 12 hours

**Frontend Lead**
- [ ] Create DashboardPage (role-based display)
  - Procurement Officer: Budget KPI, vendor performance
  - Warehouse Manager: Stock health, expiry timeline
  - Hospital: Current stock value, consumption trends
- [ ] Create KPICards component (large number + trend sparkline)
- [ ] Create StockoutTrendChart (line chart, time series)
- [ ] Create VendorScorecard (table, sortable by on-time %, price)
- [ ] Create ExpiryWasteReport (pie chart by category)
- [ ] Create report export buttons (PDF, CSV)
- [ ] Write tests for dashboard components
- **Time**: 16 hours

**Full-Stack Dev 1**
- [ ] Create report generator (using jsPDF + html2canvas for web)
- [ ] Create CSV exporter (React-CSV library or manual)
- [ ] Integrate with backend report endpoints
- [ ] Write tests for report generation
- **Time**: 10 hours

**QA & DevOps**
- [ ] Test dashboard performance (large datasets)
- [ ] Test report generation (PDF, CSV accuracy)
- **Time**: 2 hours

**Deliverables**
- ✓ Dashboard showing KPIs (role-specific)
- ✓ Stockout frequency chart (trend over time)
- ✓ Vendor performance scorecards
- ✓ Expiry waste report
- ✓ PDF/CSV export working
- ✓ Tests passing

**Dependencies**
- Week 7 (consumption data)

---

### **WEEK 9: Mobile Polish & Offline Sync** (Total: 40 hours)

**Objectives**
- Robust offline sync (re-attempt failed requests)
- Mobile UX refinement
- Barcode scanner integration (if not done)
- App icon & splash screen

#### Tasks by Role

**Mobile Developer**
- [ ] Implement robust offline sync service
  - Queue failed actions locally
  - Retry on reconnect (exponential backoff)
  - Conflict resolution (server wins)
- [ ] Integrate barcode scanner (expo-barcode-scanner)
- [ ] Implement background sync (every 5 min when app in background)
- [ ] Create offline indicator (show "Offline" banner when disconnected)
- [ ] Create app icon (use project brand colors)
- [ ] Create splash screen
- [ ] Test offline scenarios (disable network, force sync errors)
- [ ] Write tests for offline sync
- **Time**: 20 hours

**Frontend Lead** (Support)
- [ ] Help design offline sync error UI
- **Time**: 2 hours

**QA & DevOps**
- [ ] Test offline workflows (POD without network, re-sync on online)
- [ ] Test app performance on slow networks (3G simulation)
- [ ] Test battery drain (background sync optimization)
- **Time**: 6 hours

**Backend Lead** (Support)
- [ ] Ensure API is idempotent (safe to retry requests)
- **Time**: 2 hours

**Deliverables**
- ✓ Offline sync working (re-queue failed requests)
- ✓ Barcode scanner fully integrated
- ✓ Background sync (auto-retry every 5 min)
- ✓ Offline indicator UI
- ✓ App icon & splash screen
- ✓ Tests passing

**Dependencies**
- Week 1–8 foundation

---

### **WEEK 10: Testing & Bug Fixes** (Total: 40 hours)

**Objectives**
- Comprehensive test coverage (unit, integration, E2E)
- Bug fixes & edge cases
- Performance optimization
- Accessibility audit (WCAG)

#### Tasks by Role

**QA & DevOps**
- [ ] Write E2E tests (Playwright or Cypress)
  - Procurement flow: Create PO → Approve → Receive → Consume
  - Delivery flow: Pack → Deliver → POD → Stock updated
  - Offline flow: Actions offline, sync when online
- [ ] Write load tests (simulate 100 concurrent users)
- [ ] Accessibility audit (screen reader, keyboard navigation)
- [ ] Security audit (OWASP top 10)
- [ ] Write bug regression tests
- **Time**: 20 hours

**Backend Lead**
- [ ] Fix bugs found in testing
- [ ] Optimize slow queries
- [ ] Implement caching (Redis)
- [ ] Review code (security, performance)
- **Time**: 12 hours

**Frontend Lead**
- [ ] Fix UI bugs
- [ ] Accessibility fixes
- [ ] Performance profiling (React DevTools)
- [ ] Review code
- **Time**: 6 hours

**Mobile Developer**
- [ ] Fix mobile bugs
- [ ] Test on real devices (iOS + Android)
- [ ] Performance optimization (reduce bundle size)
- **Time**: 2 hours

**Deliverables**
- ✓ E2E tests passing (80%+ coverage of critical paths)
- ✓ Load tests passing (handles 100 concurrent users)
- ✓ Accessibility audit passed (WCAG AA)
- ✓ Security audit passed
- ✓ Bug fixes complete

---

### **WEEK 11: Deployment & Documentation** (Total: 40 hours)

**Objectives**
- Staging deployment (full pre-production test)
- User documentation
- Admin guides
- Training materials

#### Tasks by Role

**QA & DevOps**
- [ ] Deploy to staging (AWS RDS, ECS, CloudFront)
- [ ] Run smoke tests on staging
- [ ] Verify backups & disaster recovery
- [ ] Setup monitoring (Grafana, Datadog)
- [ ] Create deployment runbook (rollback procedures)
- [ ] Setup log aggregation (CloudWatch / ELK)
- **Time**: 16 hours

**All Developers**
- [ ] Create API documentation (Swagger/OpenAPI finalized)
- [ ] Create database schema documentation
- [ ] Create architecture overview diagrams
- [ ] Record architecture video walkthrough (10 min)
- **Time**: 8 hours each (2 hours) = **12 hours total**

**Frontend Lead**
- [ ] Create user guide (screenshots, step-by-step)
  - How to create PO
  - How to receive GRN
  - How to create shipment
  - How to use dashboard
- [ ] Create troubleshooting guide
- [ ] Create keyboard shortcuts guide (for power users)
- **Time**: 8 hours

**Mobile Developer**
- [ ] Create mobile user guide
- [ ] Create offline mode guide
- [ ] Record demo video (POD capture workflow)
- **Time**: 4 hours

**Deliverables**
- ✓ Staging environment live & tested
- ✓ User guides (PDF + web)
- ✓ API documentation
- ✓ Deployment runbook
- ✓ Training videos (2–3 min each)

---

### **WEEK 12: Production Release & Cutover** (Total: 40 hours)

**Objectives**
- Deploy to production
- Data migration from legacy system (if applicable)
- Go-live support

#### Tasks by Role

**QA & DevOps**
- [ ] Final staging smoke tests
- [ ] Create cutover checklist
- [ ] Plan 2-hour maintenance window (off-peak time)
- [ ] Deploy to production (blue-green deployment)
- [ ] Run production smoke tests
- [ ] Verify backups & replication
- [ ] Monitor system health (first 24h)
- [ ] Create post-release runbook
- **Time**: 16 hours

**All Developers** (On-call)
- [ ] Monitor production logs
- [ ] Respond to critical bugs (SLA: 1h fix)
- [ ] Support go-live team (answering questions)
- **Time**: 8 hours each = **40 hours** (distributed)

**Backend Lead**
- [ ] Manage data migration (if needed)
- [ ] Verify database integrity post-migration
- [ ] Optimize production queries based on real data
- **Time**: 8 hours

**Frontend Lead**
- [ ] Monitor frontend error rates
- [ ] Fix critical UI bugs in real-time
- **Time**: 4 hours

**Deliverables**
- ✓ Production deployment successful
- ✓ Data migrated (if applicable)
- ✓ Zero critical bugs post-release
- ✓ Monitoring & alerting live
- ✓ On-call rotation established

---

## Gantt Timeline

```
Week 1:   Setup & Foundation          ████████████████
Week 2:   Authentication              ████████████████
Week 3:   Drug Master & Vendors        ████████████████
Week 4:   Procurement Module           ████████████████
Week 5:   Warehouse Module             ████████████████
Week 6:   Distribution & POD           ████████████████
Week 7:   Consumption & Expiry         ████████████████
Week 8:   Analytics & Dashboards       ████████████████
Week 9:   Mobile Polish & Offline      ████████████████
Week 10:  Testing & Bug Fixes          ████████████████
Week 11:  Deployment & Documentation   ████████████████
Week 12:  Production Release           ████████████████
```

---

## Dependencies & Risk Management

### Critical Path Dependencies

```
Week 1: Database & Auth
    ↓
Week 2: Protected Routes
    ↓
Week 3: Master Data (Drugs, Vendors)
    ↓
Week 4: Procurement (PO)
    ├─→ Week 5: Warehouse (GRN)
    │   ├─→ Week 6: Distribution (Shipments)
    │   │   └─→ Week 7: Consumption
    │   │       └─→ Week 8: Analytics
    │   └─→ Week 9: Mobile Offline Sync
    │
    └─→ Week 10–12: Testing, Deploy, Release
```

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Database performance** (10M+ records) | Medium | High | Use indexing, partitioning early; load test week 10 |
| **API design changes mid-project** | Medium | High | Freeze API spec by end of week 1; use versioning |
| **Mobile barcode scanner integration delays** | Medium | Medium | Use placeholder QR code in week 6; integrate in week 9 |
| **Vendor communication failures** (email down) | Low | Medium | Implement fallback (SMS/Slack); add retry logic |
| **Token expiration edge cases** | Low | Medium | Comprehensive auth tests in week 2 |
| **Scope creep (additional features)** | High | High | Strict sprint planning; move nice-to-haves to phase 2 |
| **Team member unavailability** | Low | High | Cross-training; pair programming on critical modules |

---

## Definition of Done (DoD)

Each task is only "done" when:
1. **Code written** (matches style guide)
2. **Tests written** (unit + integration; >80% coverage)
3. **Tests passing** (locally + in CI)
4. **Code reviewed** (1 peer approval, lead sign-off)
5. **Documentation updated** (README, API docs, inline comments)
6. **No console errors/warnings**
7. **Accessibility check** (keyboard nav, color contrast)
8. **Performance OK** (no new N+1 queries, <2s load time)

---

## Monitoring & Metrics

### Development Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| **Test coverage** | >80% | Weekly |
| **Build success rate** | >95% | Per commit |
| **Code review time** | <24h | Per PR |
| **Bug escape rate** | <5% to staging | Weekly |

### Quality Gates

- **Staging deployment**: Must pass E2E tests + security scan
- **Production deployment**: Must have zero critical bugs, all tests green

---

## Phase 2 & 3 Roadmap (Post-MVP)

### Phase 2 (Weeks 13–18): Advanced Features
- AI-powered demand forecasting
- Automatic vendor selection (RFQ auction)
- Geolocation tracking for shipments
- Hospital ERP integration (consumption data pull)
- Multi-language support (Hindi UI)

### Phase 3 (Weeks 19–24): Scale & Optimization
- Real-time GPS tracking (AWS Location Service)
- Cold chain monitoring (temperature sensors integration)
- Batch recall workflows (automated)
- Predictive stockout alerts (7-day horizon)
- Mobile app on both app stores (TestFlight + Google Play)

---

## Success Criteria (MVP)

✓ **Functional**: All core workflows (Procurement → Warehouse → Distribution → Consumption) working end-to-end  
✓ **Performant**: API response <2s, dashboard loads in <5s  
✓ **Reliable**: 99.5% uptime in staging, zero critical bugs in production  
✓ **Usable**: 3 hospitals can go live and train staff  
✓ **Documented**: User guides, API docs, deployment runbook complete  
✓ **Scalable**: Can handle 10M+ records, 100 concurrent users  

---

## Budget & Resource Allocation

| Role | Hours | Cost (at $50/hr) | Total |
|------|-------|-----------------|-------|
| Backend Lead (Manav) | 480 | $24,000 | $24,000 |
| Frontend Lead | 480 | $24,000 | $24,000 |
| Mobile Developer | 480 | $18,000 | $18,000 |
| Full-Stack Dev 1 | 480 | $16,000 | $16,000 |
| Full-Stack Dev 2 | 480 | $16,000 | $16,000 |
| QA & DevOps | 480 | $14,000 | $14,000 |
| **Total Labor** | 2,880 | | **$112,000** |

**Infrastructure (12 weeks)**:
- AWS RDS PostgreSQL: $500
- ECS/App Engine: $1,000
- S3 storage: $100
- Monitoring (Datadog): $500
- **Total Infrastructure**: $2,100

**Third-party Services**:
- SendGrid (email): $100
- Twilio (SMS optional): $200
- GitHub Actions (CI/CD): Free
- **Total Services**: $300

**Grand Total**: ~$114,400

---

## Sign-Off & Approval

- [ ] **Product Owner**: Approves requirements, scope
- [ ] **Backend Lead** (Manav): Approves architecture, tech stack
- [ ] **Frontend Lead**: Approves UI/UX design, component patterns
- [ ] **QA Lead**: Approves test strategy, acceptance criteria
- [ ] **DevOps**: Approves deployment pipeline, infrastructure

---

**Document Version**: 1.0  
**Last Updated**: August 16, 2026  
**Next Review**: Post-Week 1 (August 23, 2026)
