# PRODUCT REQUIREMENTS DOCUMENT

# Drug Inventory & Supply Chain Tracking System (DISCTS)
*Right Product · Right Quantity · Right Place · Right Time · Right Condition · Right Cost · Right People*

**Smart India Hackathon — Problem Statement Response**
**Version**: 2.0 | **Build Sprint**: 2-Day (48 hrs)

---

## 1. Executive Summary

The Drug Inventory and Supply Chain Tracking System (DISCTS) is a centralized, omni-channel (Web + Mobile App) platform that provides complete visibility across the public health drug supply chain. It replaces manual registers with real-time tracking of supply orders, shipments, stock levels, and consumption. 

To address the unique challenges of public healthcare (e.g., low connectivity at rural centers), the system features a **responsive Web Dashboard** for state/warehouse admins and a **Mobile App with Offline-First Capabilities** for hospital pharmacists and delivery vendors. 

**Hackathon Framing:** The MVP is scoped to a 48-hour build with high-impact demo features (QR scanning via app, live dashboard, offline sync). The architecture is production-ready, modular, and scalable to state-level rollout.

## 2. Problem Statement (Restated)

Public-health drug distribution suffers from opacity: warehouses lack real-time stock visibility at hospitals, leading to stockouts or expiry wastage. Vendors' order statuses are opaque, and there is no unified dashboard to monitor consumption patterns or vendor performance. 

**The Solution:** A system that (a) improves efficiency and quality control via rigorous procurement-to-distribution tracking, and (b) provides live dashboards for monitoring vendor activity, shipments, and drug consumption at every medical institution.

## 3. Goals & Objectives

### 3.1 Primary Goals
* **Efficiency & Quality Control:** Digitize procurement with validation checks (batch/expiry, quantity, quality) at every handoff.
* **Real-Time Dashboard Monitoring:** Provide live views of supply orders, shipments, and stock for every stakeholder role.
* **Vendor Activity Tracking:** Log every vendor action (acknowledgement, dispatch, delivery) with timestamps to auto-calculate SLA adherence.
* **Consumption Monitoring:** Capture drug usage at the hospital level to detect unusual patterns, hoarding, or impending stockouts.
* **Mobile Accessibility:** Empower on-the-ground staff (pharmacists, delivery agents) with a dedicated Mobile App featuring QR barcode scanning and offline support.

### 3.2 Hackathon-Specific Goals (The "Winning Edge")
* **End-to-End Demo Flow:** Vendor creates order $\rightarrow$ Admin approves $\rightarrow$ Shipment dispatched $\rightarrow$ Hospital receives via **Mobile App QR Scan** $\rightarrow$ Consumption logged $\rightarrow$ Dashboard reflects it live via WebSockets.
* **Offline-First Sync:** Mobile app caches data and syncs when connectivity is restored (simulates rural use case).
* **Smart Alerts Engine:** Auto low-stock alerts, reorder suggestions based on moving averages, and expiry-risk flagging.

## 4. Scope (2-Day MVP)

### 4.1 In Scope (Web & Mobile)

| Module | Web Dashboard Scope (Admins, Vendors) | Mobile App Scope (Pharmacists, Logistics) |
| :--- | :--- | :--- |
| **Auth & Roles** | Super Admin, Vendor, Warehouse Officer | Hospital/Institution Pharmacist, Delivery Agent |
| **Vendor & Orders** | Vendor onboarding, order creation, approval workflows | View assigned orders (Vendors) |
| **Shipment Tracking** | Generate shipments, track status pipeline | Update status (Dispatched $\rightarrow$ Delivered), e-Signature |
| **Inventory Mgmt** | Central stock ledger, real-time aggregation | **Scan-to-Receive** (QR/Barcode), offline stock sync |
| **Consumption** | View consumption analytics and trends | Daily/weekly drug issue logging at ward level |
| **Alerts & Smart UI** | Low-stock, near-expiry, SLA breaches | Push notifications for urgent stockouts |
| **Audit Trail** | Immutable log of all system actions | N/A (Admin only) |

### 4.2 The "Wow" Factors (Stretch Goals for Judges)
* **QR Code Integration:** Every shipment generates a QR code. The mobile app scans it to instantly verify batch, expiry, and quantity on receipt.
* **Predictive Reordering (Heuristics):** Suggests reorder amounts based on simple velocity `(Average Weekly Consumption $\times$ Lead Time)`.
* **Geo-Tagging:** The mobile app captures GPS coordinates when a delivery is marked "Received" to prevent fraud.

## 5. System Architecture

### 5.1 Architectural Principles
* **API-First & Headless:** A single Node.js backend serves both the React Web Dashboard and the Flutter/React Native Mobile App.
* **Event-Driven Stock Ledger:** Stock changes are immutable events (IN/OUT). Current stock is dynamically computed. This ensures an unbreakable audit trail.
* **Role-Based Access Control (RBAC):** Cryptographically enforced via JWTs. 

### 5.2 Deployment Topology (Hackathon Demo)
* **Frontend (Web):** React.js + TailwindCSS hosted on Vercel.
* **Frontend (Mobile App):** Flutter (or React Native/Expo) compiled to an APK for demo on an Android device/emulator.
* **Backend:** Node.js + Express hosted on Render/Railway.
* **Database:** PostgreSQL (Supabase or Neon) for relational integrity.
* **Realtime Layer:** Socket.io for live dashboard updates.

## 6. Technology Stack (Detailed)

| Layer | Technology | Justification for Hackathon |
| :--- | :--- | :--- |
| **Web Frontend** | React.js (Vite), TailwindCSS, Recharts | High velocity, beautiful UI, instant live charts. |
| **Mobile App** | Flutter | Write once, compile to Android/iOS. Great for native camera access (QR scanning). |
| **Backend API** | Node.js + Express.js | Fast to build REST endpoints, huge ecosystem. |
| **Database** | PostgreSQL | Relational data is crucial for inventory/ledgers. |
| **Realtime** | Socket.io | Pushes stock updates to the admin dashboard instantly. |
| **Mobile Local DB** | SQLite / Hive (Flutter) | Caches inventory for offline usage in rural hospitals. |

## 7. Data Model (Core Entities)

| Entity | Key Fields |
| :--- | :--- |
| `users` | id, name, role (admin/vendor/pharmacist), institution_id, phone, password_hash |
| `drugs` | id, name, category, unit, pack_size, reorder_threshold, standard_shelf_life_days |
| `supply_orders` | id, vendor_id, institution_id, status, total_value, created_at |
| `shipments` | id, order_id, batch_no, expiry_date, status, dispatch_date, delivered_at, qr_hash |
| `stock_ledger` | id, institution_id, drug_id, batch_no, type (IN/OUT), quantity, timestamp |
| `consumption` | id, institution_id, drug_id, department, quantity, logged_by, timestamp |

## 8. API Contract (Sample Endpoints)

* `POST /api/auth/login` $\rightarrow$ returns JWT
* `GET /api/inventory/:institution_id` $\rightarrow$ computes and returns current stock from ledger
* `POST /api/shipments/:id/receive` (Mobile App) $\rightarrow$ payload: `{ qr_hash, received_qty, geo_lat, geo_lng }`
* `POST /api/consumption/log` (Mobile App) $\rightarrow$ appends to ledger, triggers WebSocket event `STOCK_UPDATE`

## 9. Alerts & Rules Logic (The 'Smart' Layer)

* **Low Stock:** If `current_stock(drug) < reorder_threshold` $\rightarrow$ trigger Alert.
* **Expiry Risk:** If `expiry_date - today <= 60 days` AND `stock > 0` $\rightarrow$ highlight red on dashboard.
* **SLA Breach:** If `shipment.delivered_at > order.promised_date` $\rightarrow$ deduct from Vendor rating.

## 10. Execution Plan (48 Hours)

### Day 1: Core Flow & APIs (0-24 hrs)
* **0-4h:** Setup Git repo, DB schemas, configure Node.js + Postgres.
* **4-10h:** Build Auth and CRUD APIs for Drugs, Vendors, and Orders.
* **10-16h:** Scaffold React Web Dashboard (Routing, Layout, Auth Context).
* **16-24h:** Scaffold Flutter Mobile App (Login, Basic Inventory List). Wire up the central Stock Ledger logic.

### Day 2: Mobile App, Real-time, & Polish (24-48 hrs)
* **24-32h:** Implement QR Scanning in Mobile App & Offline data caching. Implement WebSockets for live dashboard updates.
* **32-38h:** Build Analytics charts (Recharts) on Web Dashboard. Write the Alerts Engine.
* **38-44h:** **Crucial Step:** Seed realistic demo data (past orders, near-expiry batches, low stock items) to make the dashboard look alive.
* **44-48h:** Bug bashes, UI polishing, rehearsal of the demo script.

## 11. The Winning Demo Script

1. **The Hook (Web):** Open the Super Admin Dashboard. Show the live map, vendor SLA scorecards, and the blinking "Expiry Risk" alerts.
2. **The Flow (Web):** Log in as a Vendor. Acknowledge a new Supply Order and mark it "Dispatched."
3. **The Mobile Innovation (App):** Switch to the mobile phone screen share. Log in as a Rural Hospital Pharmacist.
4. **Scan & Receive (App):** Use the phone camera to scan a QR code (simulating the physical shipment). The app instantly verifies the batch and updates the inventory.
5. **Real-time Magic (Web + App):** Log consumption on the Mobile App. Instantly, on the Admin Web Dashboard, the stock chart dips, and a "Low Stock" alert pops up via WebSockets.
6. **The Drop (Web):** Show the Immutable Audit Trail, proving the system is robust enough for government use.

## 12. UI/UX Design System Guidelines
* **Colors:** Trustworthy Medical Blue (`#1E3A8A`), Alert Red (`#DC2626`), Success Green (`#16A34A`), Clean White backgrounds.
* **Typography:** Inter or Roboto for maximum legibility on small screens.
* **Components:** Large, easy-to-tap buttons on the Mobile App for users wearing gloves. High-contrast data tables on the Web Dashboard.

---
> [!TIP]
> **To the Team:** Stick strictly to this scope. Do not attempt ML integration or Blockchain during the 48 hours; simulate the smart features intelligently with rules and ledger logic. Focus heavily on the Mobile QR scan to Web Dashboard realtime sync, as cross-device demos score extremely high with judges.
