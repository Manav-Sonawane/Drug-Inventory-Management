# Drug Inventory and Supply Chain Tracking System (PSS04)

## Project Purpose
The Drug Inventory and Supply Chain Tracking System is an integrated platform designed to ensure the "6 Rights" of pharmaceutical distribution: Right Quantity, Right Product, Right Place, Right Time, Right Condition, Right Cost. It replaces manual spreadsheets and siloed systems with real-time visibility across procurement → warehouse → distribution → consumption.

## Main Modules
1. Procurement Module
2. Warehouse Module
3. Distribution Module
4. Consumption Tracking
5. Analytics & Dashboards
6. Quality Control

## Technology Stack
- **Backend:** Node.js, Express, PostgreSQL
- **Web Frontend:** React, Vite, Tailwind CSS
- **Mobile Frontend:** Flutter, Dart, SQLite (Offline storage placeholder)

## Repository Structure
```
drug-inventory-management/
├── PSS04_PRD.md
├── PSS04_ARCHITECTURE.md
├── PSS04_IMPLEMENTATION_PLAN.md
├── PSS04_IMPLEMENTATION_PLAN_ROLE_WISE.md
├── backend/            # Node.js + Express + PostgreSQL API
├── web/                # React + Vite web dashboard
└── mobile/             # Flutter mobile application
```

## Development Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+)
- Flutter SDK
- Dart

## Getting Started

### 1. Backend
```bash
cd backend
npm install
# Setup PostgreSQL and copy .env.example to .env and configure DB string
npm start
```

### 2. Web Frontend
```bash
cd web
npm install
npm run dev
```

### 3. Mobile Application
```bash
cd mobile
flutter pub get
flutter run
```

## Current MVP Status
This repository is currently scaffolding the foundational frameworks for the web dashboard, backend API, and mobile application. Core modules such as authentication, procurement, and warehouse are scheduled for future development.
