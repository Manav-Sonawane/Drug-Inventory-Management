# Hackathon Implementation Strategy & Blueprint

This document outlines the tactical execution plan to build the system within a 48-hour hackathon timeframe.

## 1. The 48-Hour Execution Roadmap

### Phase 1: Foundation (Hours 0 - 12)
* **Database Setup:** Provision PostgreSQL (e.g., Supabase or local Docker). Run schema migrations.
* **Backend API Scaffold:** Initialize Node.js/Express. Set up JWT authentication middleware.
* **Web Scaffold:** Initialize React/Vite. Setup React Router and basic layout shells (Sidebar, Navbar).
* **Goal:** A user can log in via an API call and view a blank, authenticated web dashboard.

### Phase 2: Core Logistics Flow (Hours 12 - 28)
* **Backend:** Build CRUD endpoints for Drugs, Vendors, Orders, and Shipments.
* **Web Frontend:** Build the "Create Order" and "Approve Order / Dispatch Shipment" forms.
* **Mobile Scaffold:** Initialize Flutter. Build the Login screen and the "Pending Shipments" list view.
* **Goal:** An admin can create an order, approve it, and see the shipment status change to 'Dispatched'.

### Phase 3: The "Wow" Features (Hours 28 - 40)
* **Mobile App:** Integrate QR scanner. Build the "Scan to Receive" logic that updates the central stock ledger via API.
* **Backend Real-time:** Integrate Socket.io. Emit a `STOCK_UPDATE` event whenever an inventory API is hit.
* **Web Frontend:** Hook up Recharts to the real-time data stream. Implement the visual Alerts panel (red/yellow warnings based on stock thresholds).
* **Goal:** A mobile scan instantly updates a chart on the web dashboard without refreshing the page.

### Phase 4: Seeding & Polish (Hours 40 - 48)
* **Crucial Step:** Write a script to seed the database with realistic, "almost broken" data:
  * 1 drug batch expiring in 3 days (triggers Expiry Alert).
  * 1 drug whose stock is exactly 1 unit below the reorder threshold (triggers Low Stock Alert).
  * 1 vendor with a history of late deliveries (shows poor SLA on the dashboard).
* **Goal:** The moment judges see the dashboard, it is full of actionable insights, not empty tables.

---

## 2. Database Schema (PostgreSQL)

```sql
-- Core schemas to implement
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50), -- 'ADMIN', 'VENDOR', 'PHARMACIST'
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE drugs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    reorder_threshold INT,
    unit VARCHAR(20) -- 'Strip', 'Vial', 'Box'
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    order_id INT,
    batch_no VARCHAR(50),
    quantity INT,
    expiry_date DATE,
    status VARCHAR(50), -- 'DISPATCHED', 'DELIVERED'
    qr_hash VARCHAR(255) UNIQUE
);

CREATE TABLE stock_ledger (
    id SERIAL PRIMARY KEY,
    institution_id INT,
    drug_id INT,
    batch_no VARCHAR(50),
    movement_type VARCHAR(10), -- 'IN' or 'OUT'
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
> [!NOTE]
> **Why an Immutable Ledger?** Notice there is no `current_stock` column in a table. Stock is calculated dynamically: `SUM(quantity WHERE movement_type = 'IN') - SUM(quantity WHERE movement_type = 'OUT')`. This ensures an unbreakable audit trail that judges will love.

---

## 3. Critical API Endpoints to Build

| Endpoint | Method | Payload / Action |
| :--- | :--- | :--- |
| `/api/auth/login` | POST | `{ email, password }` $\rightarrow$ Returns JWT |
| `/api/shipments/dispatch` | POST | Creates shipment, generates `qr_hash` |
| `/api/shipments/receive` | POST | Mobile App: Submits `qr_hash`. Appends `IN` record to `stock_ledger` |
| `/api/consumption/log` | POST | Mobile App: Appends `OUT` record to `stock_ledger` |
| `/api/dashboard/stats` | GET | Returns aggregated stock, active alerts, and SLA scores |

## 4. Hardware/Environment Prep for Demo Day
1. **Host Backend:** Deploy Node backend to Render.com (free tier, but ensure it's "woken up" before demoing).
2. **Host Database:** Use Supabase or Neon (free PostgreSQL in the cloud).
3. **Web App:** Deploy React app to Vercel.
4. **Mobile App:** Pre-install the compiled `.apk` on your physical Android phone for the live demo. Keep a laptop emulator running as a backup.
5. **Physical Props:** Print out 2-3 sample QR codes on paper to physically scan with the mobile phone during the pitch to wow the judges.
