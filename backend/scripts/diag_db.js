const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    await mongoose.connect('mongodb://localhost:27017');
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const dbs = await admin.listDatabases();
    let report = "--- MONGODB LOCAL REPORT ---\n";

    for (const dbInfo of dbs.databases) {
        if (['admin', 'config', 'local'].includes(dbInfo.name)) continue;
        report += `\nDatabase: ${dbInfo.name}\n`;
        const db = mongoose.connection.useDb(dbInfo.name);
        const collections = await db.db.listCollections().toArray();
        for (const col of collections) {
            const count = await db.db.collection(col.name).countDocuments();
            report += `  - ${col.name}: ${count}\n`;
            if (count > 0 && (col.name.includes('food') || col.name.includes('reel'))) {
                const docs = await db.db.collection(col.name).find({}).toArray();
                docs.forEach(doc => {
                    report += `    * ${doc.name || doc.title || doc._id}\n`;
                });
            }
        }
    }
    fs.writeFileSync('db_report.txt', report);
    console.log("Report generated at db_report.txt");
    process.exit(0);
}

run();
