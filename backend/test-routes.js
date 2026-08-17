const app = require('./src/app');
const http = require('http');

const PORT = 3001;
const baseUrl = `http://localhost:${PORT}/api`;

const server = http.createServer(app);

const runTests = async () => {
    let drugId;

    try {
        console.log('--- Testing /api/drugs ---');
        
        // 1. Create a new drug
        let res = await fetch(`${baseUrl}/drugs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Paracetamol',
                category: 'Painkiller',
                unit: 'mg',
                manufacturer: 'PharmaInc'
            })
        });
        let data = await res.json();
        console.assert(res.status === 201, 'POST /drugs should return 201');
        console.assert(data.data.name === 'Paracetamol', 'Drug name should match');
        drugId = data.data.id;
        console.log('✅ POST /api/drugs passed');

        // 2. Get all drugs
        res = await fetch(`${baseUrl}/drugs`);
        data = await res.json();
        console.assert(res.status === 200, 'GET /drugs should return 200');
        console.assert(Array.isArray(data.data), 'GET /drugs should return an array');
        console.log('✅ GET /api/drugs passed');

        // 3. Get drug by ID
        res = await fetch(`${baseUrl}/drugs/${drugId}`);
        data = await res.json();
        console.assert(res.status === 200, 'GET /drugs/:id should return 200');
        console.assert(data.data.id === drugId, 'Drug ID should match');
        console.log('✅ GET /api/drugs/:id passed');

        // 4. Update drug
        res = await fetch(`${baseUrl}/drugs/${drugId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 'Analgesic' })
        });
        data = await res.json();
        console.assert(res.status === 200, 'PUT /drugs/:id should return 200');
        
        // Verify update
        res = await fetch(`${baseUrl}/drugs/${drugId}`);
        data = await res.json();
        console.assert(data.data.category === 'Analgesic', 'Drug category should be updated');
        console.log('✅ PUT /api/drugs/:id passed');

        // 5. Delete drug
        res = await fetch(`${baseUrl}/drugs/${drugId}`, { method: 'DELETE' });
        console.assert(res.status === 200, 'DELETE /drugs/:id should return 200');
        
        // Verify deletion
        res = await fetch(`${baseUrl}/drugs/${drugId}`);
        console.assert(res.status === 404, 'GET /drugs/:id should return 404 after deletion');
        console.log('✅ DELETE /api/drugs/:id passed');

        console.log('\n🎉 All tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        server.close();
        process.exit(0);
    }
};

server.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    runTests();
});
