/**
 * Seed script — creates an admin user and sample data so the system is usable out of the box.
 * Run once: node src/database/seed.js
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

console.log('🌱 Seeding database...');

const seed = db.transaction(() => {
    // ─── Admin User ───────────────────────────────────────────────────
    const adminId = uuidv4();
    const existingAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@drugims.com'").get();
    if (!existingAdmin) {
        db.prepare(
            `INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)`
        ).run(adminId, 'admin@drugims.com', bcrypt.hashSync('Admin@123', 10), 'System Administrator', 'ADMIN');
        console.log('  ✅ Admin user: admin@drugims.com / Admin@123');
    } else {
        console.log('  ⏭  Admin user already exists.');
    }

    // ─── Warehouses ───────────────────────────────────────────────────
    const wh1Id = uuidv4();
    const wh2Id = uuidv4();
    db.prepare("INSERT OR IGNORE INTO warehouses (id, name, location) VALUES (?, ?, ?)").run(wh1Id, 'Central State Medical Warehouse', 'Kolkata, West Bengal');
    db.prepare("INSERT OR IGNORE INTO warehouses (id, name, location) VALUES (?, ?, ?)").run(wh2Id, 'Siliguri Regional Depot', 'Siliguri, West Bengal');
    console.log('  ✅ Warehouses seeded.');

    // ─── Hospitals ────────────────────────────────────────────────────
    const hosp1Id = uuidv4();
    const hosp2Id = uuidv4();
    const hosp3Id = uuidv4();
    db.prepare("INSERT OR IGNORE INTO hospitals (id, name, location) VALUES (?, ?, ?)").run(hosp1Id, 'Primary Health Centre, Malda', 'Malda, West Bengal');
    db.prepare("INSERT OR IGNORE INTO hospitals (id, name, location) VALUES (?, ?, ?)").run(hosp2Id, 'City Hospital North Wing', 'Kolkata, West Bengal');
    db.prepare("INSERT OR IGNORE INTO hospitals (id, name, location) VALUES (?, ?, ?)").run(hosp3Id, 'District Alpha Medical Complex', 'Burdwan, West Bengal');
    console.log('  ✅ Hospitals seeded.');

    // ─── Vendors ──────────────────────────────────────────────────────
    const v1Id = uuidv4();
    const v2Id = uuidv4();
    db.prepare("INSERT OR IGNORE INTO vendors (id, name, contact) VALUES (?, ?, ?)").run(v1Id, 'MediEquip Global', 'logistics@mediequip.com');
    db.prepare("INSERT OR IGNORE INTO vendors (id, name, contact) VALUES (?, ?, ?)").run(v2Id, 'PharmaCorp Ind.', 'support@pharmacorp.in');
    console.log('  ✅ Vendors seeded.');

    // ─── Drugs ────────────────────────────────────────────────────────
    const d1Id = uuidv4();
    const d2Id = uuidv4();
    const d3Id = uuidv4();
    const d4Id = uuidv4();
    const d5Id = uuidv4();

    const drugs = [
        [d1Id, 'Paracetamol 500mg', 'Paracetamol', 'Generic Pharma', 'Painkiller', 0.5, 30, 0],
        [d2Id, 'Amoxicillin 500mg', 'Amoxicillin', 'MediEquip Global', 'Antibiotic', 3.2, 30, 0],
        [d3Id, 'Insulin Glargine 100IU/ml', 'Insulin Glargine', 'Apex BioPharma', 'Hormone', 120.0, 90, 1],
        [d4Id, 'Saline Solution 500ml IV', 'Sodium Chloride', 'Lifeline Logistics', 'IV Fluid', 15.0, 60, 0],
        [d5Id, 'Ciprofloxacin 250mg', 'Ciprofloxacin', 'PharmaCorp Ind.', 'Antibiotic', 5.5, 30, 0],
    ];
    for (const drug of drugs) {
        db.prepare(
            `INSERT OR IGNORE INTO drugs (id, name, generic_name, manufacturer, category, unit_price, expiry_threshold_days, temperature_sensitive)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(...drug);
    }
    console.log('  ✅ Drugs seeded.');

    // ─── Batches ──────────────────────────────────────────────────────
    const b1Id = uuidv4();
    const b2Id = uuidv4();
    const b3Id = uuidv4();
    const b4Id = uuidv4();
    const b5Id = uuidv4();

    db.prepare(`INSERT OR IGNORE INTO batches (id, drug_id, batch_number, expiry_date, warehouse_id, location_bin, current_qty) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(b1Id, d1Id, 'B-7742', '2026-03-31', wh1Id, 'A-2-1', 14200);
    db.prepare(`INSERT OR IGNORE INTO batches (id, drug_id, batch_number, expiry_date, warehouse_id, location_bin, current_qty) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(b2Id, d2Id, 'B-992-X', '2025-12-31', wh1Id, 'A-2-2', 18400);
    db.prepare(`INSERT OR IGNORE INTO batches (id, drug_id, batch_number, expiry_date, warehouse_id, location_bin, current_qty, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(b3Id, d3Id, 'C-112', '2025-09-15', wh1Id, 'COLD-1', 150, 'in_stock');
    db.prepare(`INSERT OR IGNORE INTO batches (id, drug_id, batch_number, expiry_date, warehouse_id, location_bin, current_qty) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(b4Id, d4Id, 'IV-22-A', '2026-06-30', wh1Id, 'A-5-1', 9600);
    db.prepare(`INSERT OR IGNORE INTO batches (id, drug_id, batch_number, expiry_date, warehouse_id, location_bin, current_qty) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(b5Id, d5Id, 'A-402', '2026-01-15', wh2Id, 'B-3-1', 8500);
    console.log('  ✅ Batches seeded.');

    // ─── Role Users ───────────────────────────────────────────────────
    const roleUsers = [
        ['warehouse@drugims.com', 'Warehouse@123', 'Warehouse Manager', 'WAREHOUSE'],
        ['vendor@drugims.com', 'Vendor@123', 'Vendor Representative', 'VENDOR'],
        ['phc@drugims.com', 'PHC@123', 'PHC Clinic Staff', 'HOSPITAL'],
        ['procurement@drugims.com', 'Proc@123', 'Procurement Officer', 'PROCUREMENT'],
    ];
    for (const [email, password, full_name, role] of roleUsers) {
        const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!exists) {
            db.prepare(
                `INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)`
            ).run(uuidv4(), email, bcrypt.hashSync(password, 10), full_name, role);
        }
    }
    console.log('  ✅ Role users seeded.');
});

try {
    seed();
    console.log('\n✅ Seeding complete!\n');
    console.log('📋 Login credentials:');
    console.log('   admin@drugims.com       / Admin@123   (ADMIN)');
    console.log('   warehouse@drugims.com   / Warehouse@123 (WAREHOUSE)');
    console.log('   vendor@drugims.com      / Vendor@123  (VENDOR)');
    console.log('   phc@drugims.com         / PHC@123     (HOSPITAL)');
    console.log('   procurement@drugims.com / Proc@123    (PROCUREMENT)');
} catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
}
