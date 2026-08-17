const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

const Vendor = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM vendors', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM vendors WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            const query = `
                INSERT INTO vendors (id, name, contact_email, contact_phone, address)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [id, data.name, data.contact_email, data.contact_phone, data.address];
            
            db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve({ id, ...data });
            });
        });
    },

    update: (id, data) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE vendors
                SET name = COALESCE(?, name),
                    contact_email = COALESCE(?, contact_email),
                    contact_phone = COALESCE(?, contact_phone),
                    address = COALESCE(?, address),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const params = [data.name, data.contact_email, data.contact_phone, data.address, id];
            
            db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM vendors WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
};

module.exports = Vendor;
