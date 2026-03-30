const { execSync } = require('child_process');

async function run() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const dbId = process.env.D1_DATABASE_ID;

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: "SELECT name FROM sqlite_master WHERE type='table'" })
  });

  const data = await res.json();
  console.log("Tables:");
  console.dir(data, {depth: null});

  if (data.result && data.result[0].results.length > 0) {
    const tableName = data.result[0].results.find(t => t.name !== 'sqlite_sequence' && t.name !== 'banners' && t.name !== 'products' && t.name !== '_cf_KV')?.name;
    
    if (tableName) {
      const res2 = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: `PRAGMA table_info(${tableName})` })
      });
      const data2 = await res2.json();
      console.log(`Schema for ${tableName}:`);
      console.dir(data2, {depth: null});
    }
  }
}
run();
