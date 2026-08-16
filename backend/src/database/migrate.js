const db = require('./database');
const fs = require('fs');
const path = require('path');

const migrate = () => {
    try {
        const schemaPath = path.resolve(__dirname, 'migrations/001_initial_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        db.exec(schema);
        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    }
};

migrate();
