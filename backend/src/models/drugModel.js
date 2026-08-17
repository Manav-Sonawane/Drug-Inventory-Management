const db = require('../database/database');
const { v4: uuidv4 } = require('uuid');

const Drug = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM drugs', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM drugs WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            const query = `
                INSERT INTO drugs (id, name, category, unit, manufacturer)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [id, data.name, data.category, data.unit, data.manufacturer];
            
            db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve({ id, ...data });
            });
        });
    },

    update: (id, data) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE drugs
                SET name = COALESCE(?, name),
                    category = COALESCE(?, category),
                    unit = COALESCE(?, unit),
                    manufacturer = COALESCE(?, manufacturer),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const params = [data.name, data.category, data.unit, data.manufacturer, id];
            
            db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM drugs WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
};

module.exports = Drug;
