const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    await mongoose.connect('mongodb://localhost:27017');
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const dbs = await admin.listDatabases();
    let report = "--- SEARCH FOR ORIGINAL IDs ---\n";

    for (const dbInfo of dbs.databases) {
        if (['admin', 'config', 'local'].includes(dbInfo.name)) continue;
        const db = mongoose.connection.useDb(dbInfo.name);
        const collections = await db.db.listCollections().toArray();
        for (const col of collections) {
            const docs = await db.db.collection(col.name).find({ email: /@/ }).toArray();
            const originalDocs = docs.filter(d => d.email !== 'user@example.com' && d.email !== 'partner@example.com');
            if (originalDocs.length > 0) {
                report += `DB: ${dbInfo.name} | Col: ${col.name}\n`;
                originalDocs.forEach(d => {
                    report += `  - ${d.email} (${d._id})\n`;
                });
            }
        }
    }
    fs.writeFileSync('original_ids.txt', report);
    process.exit(0);
}

run();
