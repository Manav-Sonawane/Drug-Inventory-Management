# Product Requirements Document (PRD)
## Drug Inventory and Supply Chain Tracking System (PSS04)

**Version**: 1.0  
**Date**: August 2026  
**Status**: MVP Specification  
**Target Users**: Government procurement officers, vendors, warehouse managers, hospital administrators, pharmacists, delivery personnel

---

## 1. Executive Summary

The Drug Inventory and Supply Chain Tracking System is an integrated platform designed to ensure the "6 Rights" of pharmaceutical distribution: Right Quantity, Right Product, Right Place, Right Time, Right Condition, Right Cost. It replaces manual spreadsheets and siloed systems with real-time visibility across procurement → warehouse → distribution → consumption.

**Core Objective**: Enable data-driven decisions on procurement, stock allocation, and expiration management across a network of hospitals and warehouses.

---

## 2. Problem Statement

### Current Challenges
- **Visibility Gap**: No real-time view of stock levels across 100+ institutions
- **Inefficiency**: Manual orders, paper-based tracking, duplicate procurement
- **Waste**: Drugs expire before use; stockouts occur despite surplus elsewhere
- **Cost Overrun**: No standardized pricing negotiations; vendors exploit information asymmetry
- **Compliance Risk**: No audit trail; quality/condition tracking is manual
- **Procurement Delay**: Order → approval → procurement cycle takes weeks

### Quantified Impact
- ~15–20% of pharmaceutical budget wasted on expiration/overstocking
- 30–40% of hospitals report regular stockouts despite system-wide surplus
- Manual reconciliation takes ~5 hours/day per warehouse
- Procurement decisions based on gut feeling, not data

---

## 3. Solution Overview

### High-Level Architecture

```
Vendors
   ↓ (supply orders, shipments)
Warehouse (Central/Regional)
   ↓ (allocation)
Hospitals/Institutions
   ↓ (consumption)
Analytics & Dashboards
```

### Key Modules

1. **Procurement Module**: Vendor management, RFQ, PO creation, cost tracking
2. **Warehouse Module**: Inbound receipts, stock management, expiry tracking
3. **Distribution Module**: Allocation rules, shipment tracking, delivery confirmation
4. **Consumption Tracking**: Hospital-level consumption, demand forecasting
5. **Analytics & Dashboards**: Real-time KPIs, predictive alerts, reporting
6. **Quality Control**: Drug condition assessment, damage tracking, batch verification

---

## 4. User Personas & Roles

### 1. Procurement Officer (Government Level)
**Goal**: Approve orders, negotiate pricing, ensure compliance  
**Pain Points**: Manual approvals, no vendor performance metrics  
**Key Actions**:
- View pending POs across all vendors
- Approve/reject orders with comments
- Compare vendor pricing and delivery performance
- Generate compliance reports

**Access Level**: National/state view, read-mostly (approve/reject actions only)

---

### 2. Vendor Manager
**Goal**: Submit supply orders, track shipments, claim payments  
**Pain Points**: Manual invoicing, unclear payment status  
**Key Actions**:
- Create supply orders (pull orders from system)
- Upload shipping documents
- Track shipment status
- Submit invoices, track payment

**Access Level**: Own vendor account; read own shipments, orders, invoices

---

### 3. Warehouse Manager (Central/Regional)
**Goal**: Manage inventory, optimize storage, track expiries  
**Pain Points**: Manual stock counts, late expiry detection  
**Key Actions**:
- Receive and bin inbound drugs
- Track stock by batch, expiry date, location
- Generate expiry alerts (30, 15, 7 days before)
- Allocate stock to hospitals
- Reconcile physical vs. system stock (cycle counts)

**Access Level**: Own warehouse; read other warehouses (for allocation decisions)

---

### 4. Hospital Pharmacist/Stock Manager
**Goal**: Manage hospital inventory, fulfill patient prescriptions  
**Pain Points**: Stockouts, dead stock, expired drugs on shelf  
**Key Actions**:
- View allocated stock
- Request stock adjustments (if received physical damage)
- Log consumption (by prescription or batch)
- Request emergency replenishment
- Track expiry dates on shelf

**Access Level**: Own hospital only; read-write on consumption, requests

---

### 5. Delivery Personnel (Logistics)
**Goal**: Track and confirm deliveries in real-time  
**Pain Points**: Manual POD (Proof of Delivery) forms, lost paperwork  
**Key Actions**:
- View assigned shipments (mobile)
- Scan barcodes to confirm pickup/delivery
- Capture recipient signature/photos
- Submit delivery confirmation with timestamp
- Mark exceptions (damage, shortfall)

**Access Level**: Assigned shipments only (mobile-first)

---

### 6. System Administrator
**Goal**: Manage users, configure rules, audit system  
**Pain Points**: User access sprawl, hard to track changes  
**Key Actions**:
- Create users, assign roles
- Define allocation rules (e.g., prioritize high-demand drugs to remote hospitals)
- Set expiry alert thresholds
- View audit logs
- Configure drug catalog (Master Data)

**Access Level**: Full system access

---

## 5. Core Features by Module

### 5.1 Procurement Module

**Features:**
- **Vendor Management**
  - Vendor profiles (name, contact, payment terms, certifications)
  - Performance metrics (on-time delivery %, price competitiveness, quality issues)
  - Blacklist/whitelist status

- **Demand Forecasting Integration**
  - Historical consumption data from hospitals
  - Seasonal adjustments (e.g., flu season demand)
  - Suggested order quantities (AI-powered, optional for MVP)

- **RFQ & PO Creation**
  - Bulk RFQs to multiple vendors
  - Competitive bidding (vendors submit bids, system selects lowest-cost qualified vendor)
  - PO generation with approval workflow
  - PO status tracking (Drafted → Submitted → Approved → Dispatched → Delivered → Invoiced)

- **Cost Tracking**
  - Compare unit prices across vendors
  - Track total cost of ownership (including delivery, handling)
  - Budget vs. actual spend reporting

**MVP Scope**: Vendor profiles, manual PO creation, basic approval workflow (no AI forecasting yet)

---

### 5.2 Warehouse Module

**Features:**
- **Inbound Management**
  - GRN (Goods Receipt Note) creation
  - Barcode/batch scanning
  - Quality inspection checklist (seal intact, no visible damage, docs complete)
  - Bin assignment (by drug type, expiry cohort)
  - Stock reconciliation (received qty vs. PO qty)

- **Inventory Tracking**
  - Real-time stock view (by drug, batch, expiry, location)
  - FIFO enforcement (First In, First Out via system UI)
  - ABC classification (high-value, medium, low) for prioritization
  - Multi-warehouse view (for allocation decisions)

- **Expiry Management**
  - Automated expiry alerts (30, 15, 7 days before expiry)
  - Quarantine zone for expired drugs
  - Disposal/return tracking
  - Waste reports

- **Stock Adjustments**
  - Manual adjustments (damage, loss) with approval workflow
  - Reason tracking (e.g., "Damaged in transit", "Expired")
  - Audit trail of all adjustments

**MVP Scope**: GRN creation, basic inventory tracking, expiry alerts, manual adjustments

---

### 5.3 Distribution Module

**Features:**
- **Allocation Rules Engine**
  - Rule-based allocation (e.g., "prioritize critical drugs to rural hospitals")
  - Fairness constraints (no hospital hoards more than 30% of supply)
  - Custom rules per drug category (pediatric vs. general)

- **Shipment Management**
  - Create shipments (bundle drugs for delivery)
  - Generate shipping labels with barcodes
  - Track shipment status: Packed → In Transit → Out for Delivery → Delivered
  - Geolocation tracking (optional, for round 2)

- **Proof of Delivery (POD)**
  - Mobile capture of recipient signature/OTP
  - Barcode scan at delivery
  - Photo upload (for damage claims)
  - Exception handling (shortfall, damage, refused)

- **Return Management**
  - Track returns (damaged in transit, refused by hospital)
  - RMA (Return Merchandise Authorization) workflow
  - Credit notes generation

**MVP Scope**: Manual shipment creation, barcode-based delivery tracking, POD via mobile app

---

### 5.4 Consumption Tracking Module

**Features:**
- **Hospital-Level Logging**
  - Consumption entries (by date, drug, quantity, ward/department)
  - Batch traceability (log by batch number for quality control)
  - Integration with prescription systems (optional, manual for MVP)

- **Demand Analytics**
  - Monthly/seasonal consumption trends
  - Reorder point recommendations
  - Anomaly detection (e.g., spike in pain medication usage)

- **Feedback Loop**
  - Hospitals report stockouts (frequency, duration)
  - Hospitals report overstocking (low-velocity drugs)
  - Feeds into next procurement cycle

**MVP Scope**: Manual consumption logging, basic trend charts

---

### 5.5 Analytics & Dashboards

**Web Dashboard (for Procurement Officers, Warehouse Managers)**
- **KPIs**:
  - Stockout frequency (by drug, by hospital)
  - Stock turnover rate (days of inventory on hand)
  - Procurement efficiency (budget vs. actual spend)
  - Vendor performance (on-time delivery %, price rank)
  - Expiry waste (% of stock that expires unused)

- **Reports**:
  - Monthly procurement summary
  - Warehouse health (utilization %, expiry incidents)
  - Hospital demand trends
  - Vendor scorecards

- **Alerts**:
  - Critical stockouts
  - Upcoming expirations
  - Budget overruns
  - Delivery delays (>5 days past promised date)

**Mobile Dashboard (for Hospital Staff)**
- Current stock levels
- Upcoming expirations (next 7 days)
- Low-stock alerts
- Pending inbound shipments

---

### 5.6 Quality Control Module

**Features**:
- **Inbound Inspection**
  - Visual checklist (seal, packaging, docs)
  - Temperature/condition verification (if critical drugs)
  - Batch documentation review

- **Storage Monitoring**
  - Temperature/humidity alerts (for temperature-sensitive drugs)
  - Contamination reports

- **Traceability**
  - Full batch history (manufacturer → warehouse → hospital → patient)
  - Adverse event tracking (if drug cause issue, trace all units)

**MVP Scope**: Inbound inspection checklist, basic batch traceability

---

## 6. Data Model (High-Level)

### Entities

```
Drug
├─ id, name, manufacturer, category, unit_price, expiry_threshold
├─ temperature_sensitive (bool)
└─ notes

Batch
├─ drug_id, batch_number, manufacture_date, expiry_date
├─ warehouse_id, location_bin, current_qty
└─ status (in_stock, reserved, expired, disposed)

Vendor
├─ id, name, contact, payment_terms, approval_status
└─ performance_metrics (on_time_pct, quality_score)

PurchaseOrder
├─ id, vendor_id, drug_id, quantity, unit_price, total_cost
├─ order_date, promised_delivery_date, approval_status
└─ status (draft, approved, dispatched, received, invoiced)

GoodsReceipt (GRN)
├─ po_id, warehouse_id, received_qty, received_date
├─ inspection_status, quality_notes
└─ discrepancies (qty mismatch, damage, docs missing)

Shipment
├─ id, from_warehouse_id, to_hospital_id, created_date
├─ batch_ids (array of batch IDs in shipment)
├─ status (packed, in_transit, delivered, exception)
└─ tracking_number, estimated_delivery_date

ShipmentEvent (event log)
├─ shipment_id, event_type (pickup, in_transit, out_for_delivery, delivered)
├─ timestamp, location, notes
└─ attached_images (for POD, damage photos)

Consumption
├─ id, hospital_id, batch_id, quantity, consumed_date
├─ ward, department, notes
└─ logged_by (user_id)

Hospital
├─ id, name, location, priority_tier (rural, urban, referral)
├─ allocated_budget, current_stock_value
└─ contact, storage_capacity

Audit
├─ entity (drug, batch, po, shipment, etc.)
├─ entity_id, action (create, update, delete)
├─ user_id, timestamp, old_value, new_value
└─ reason
```

---

## 7. Integration Points

### External Systems (Future)
- **Hospital ERP/Pharmacy System**: Consume drug usage data (optional MVP)
- **Government Budget Portal**: Sync approved budgets
- **Vendor Invoicing System**: Send PO data for automatic invoice matching
- **Weather Service**: Predictive alerts for temperature-sensitive shipments
- **Geolocation/Logistics API**: Track shipment location (round 2)

### MVP: No external integrations (all manual entry)

---

## 8. Non-Functional Requirements

| Requirement | Target | Notes |
|-------------|--------|-------|
| **Latency** | <2s for dashboard loads | Indexed queries, caching |
| **Uptime** | 99.5% (SLA) | Health checks, failover |
| **Scalability** | 500+ concurrent users, 10M+ records | Database partitioning, API rate limiting |
| **Security** | SOC 2 ready | Encryption, audit logs, RBAC |
| **Data Retention** | 7 years (pharma compliance) | Archival strategy, cold storage |
| **Offline Capability** | Mobile works offline, syncs when online | Service workers, local SQLite |
| **Accessibility** | WCAG 2.1 AA | Keyboard navigation, screen reader support |
| **Localization** | English + Hindi (UI text) | RTL support for future Urdu |

---

## 9. Success Metrics

| Metric | Baseline | Target (6 months) |
|--------|----------|-------------------|
| Stockout frequency | 40% of hospitals/month | <10% |
| Expiry waste | 15–20% of purchases | <5% |
| Procurement cycle time | 3–4 weeks | <5 days |
| Inventory turnover | 45 days | 30 days |
| Vendor on-time delivery | 70% | >90% |
| User adoption | N/A | 80% of hospitals actively logging |
| Data accuracy | ~85% (manual) | >98% (system-tracked) |

---

## 10. Constraints & Assumptions

### Constraints
- **Budget**: Limited to free/open-source infrastructure (PostGIS, open APIs)
- **Timeline**: MVP in 3 months, full release in 6 months
- **Network**: Some rural hospitals have low connectivity (offline capability required)
- **Literacy**: Non-technical users (mobile UX must be intuitive)

### Assumptions
- Vendors are willing to adopt (incentivized by faster payment)
- Hospitals can assign staff to log consumption daily
- Central warehouse staff can scan barcodes for all inbound
- Government provides legal mandate for system adoption

---

## 11. Roadmap

### Phase 1 (Weeks 1–3): MVP Core
- Drug & vendor master data
- PO creation & approval workflow
- GRN & inbound tracking
- Shipment & POD (mobile)
- Basic dashboards

### Phase 2 (Weeks 4–6): Consumption & Analytics
- Hospital consumption logging
- Expiry alerts & waste tracking
- Demand forecasting charts
- Vendor performance scorecards

### Phase 3 (Weeks 7–12): Intelligence & Optimization
- AI-powered allocation rules
- Predictive stockout alerts
- Supply chain optimization (round-trip cost)
- Geolocation tracking for shipments

### Phase 4 (Future): Ecosystem Integration
- Vendor invoice automation
- Hospital ERP integration
- Mobile offline-first redesign
- Advanced analytics (Tableau, custom reports)

---

## 12. Out of Scope (MVP)

- Real-time GPS tracking of shipments
- Temperature sensors for cold chain drugs
- ML-based demand forecasting
- Integration with hospital billing systems
- Supplier dispute resolution (automated)
- Batch recall workflows (manual for now)

---

## Appendix A: Competitive Landscape

### Existing Solutions (Global)
- **TraceLink**: Focus on pharmaceutical traceability (high cost, enterprise-only)
- **MuleSoft/SAP Ariba**: General SCM platforms (overkill, expensive)

### Why Custom Solution?
- Indian government-specific workflows (procurement rules, warehouse structure)
- Affordable (no licensing)
- Modular (can add features incrementally)
- Local support (no vendor lock-in)

---

**Document Version**: 1.0  
**Last Updated**: August 16, 2026  
**Next Review**: Post-MVP feedback (Week 4)
