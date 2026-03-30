const accountId = "ee422d61c4954fa44ae543724e776a66";
const databaseId = "662393b0-62a3-4dd8-81d3-9f14be289475";
const token = "cfat_F46Kx3ENQyBKWynGv4jfjuLZ4D85ZdY81Md9cjUM781ef096";

const D1_API_URL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

async function query(sql) {
    const res = await fetch(D1_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
    });
    const data = await res.json();
    return data.result && data.result[0];
}

async function run() {
    const tablesRes = await query(`SELECT name FROM sqlite_master WHERE type="table"`);
    const tables = tablesRes.results.map(r => r.name).filter(name => !['sqlite_sequence', 'products', 'enquiries', 'banners', 'admin_users', '_cf_KV'].includes(name));
    
    for (const table of tables) {
        const info = await query(`PRAGMA table_info(\`${table}\`)`);
        if (!info || !info.results) continue;
        const columns = info.results.map(c => c.name);
        if (columns.includes('model') && !columns.includes('model_number')) {
            console.log(`Renaming 'model' to 'model_number' in table '${table}'`);
            const alterRes = await query(`ALTER TABLE \`${table}\` RENAME COLUMN model TO model_number`);
            console.log(alterRes?.success ? "Success" : "Failed", alterRes);
        } else {
            console.log(`Skipping table '${table}' (columns: ${columns.join(', ')})`);
        }
    }
}
run();
