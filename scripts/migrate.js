const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const migrations = [
  '000_create_doctors.sql',
  '001_create_patients.sql',
  '002_create_appointments.sql',
  '003_add_notes_to_appointments.sql',
];

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  for (const file of migrations) {
    const sql = fs.readFileSync(
      path.join(__dirname, '../src/4-framework/database/migrations', file),
      'utf8',
    );
    try {
      await conn.query(sql);
      console.log(`✓ ${file}`);
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.errno === 1060) {
        console.log(`~ ${file} (already applied)`);
      } else {
        console.error(`✗ ${file}: ${err.message}`);
        process.exit(1);
      }
    }
  }

  await conn.end();
  console.log('Migrations done.');
}

run();
