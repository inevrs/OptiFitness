require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || 'zenfitness';

async function initDb() {
  // Step 1: Connect without DB to create it if needed
  const bootstrap = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
  });

  console.log('✓ Connected to MySQL');
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  console.log(`✓ Database "${DB_NAME}" ready`);
  await bootstrap.end();

  // Step 2: Connect WITH the database and run each statement individually
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
    port: process.env.DB_PORT || 3306,
    multipleStatements: false, // run one at a time for better error reporting
  });

  // Run migration updates
  try {
    await conn.query(`ALTER TABLE badges MODIFY COLUMN requirement_type ENUM('streak', 'points', 'challenges_completed', 'water_reached') NOT NULL`);
    await conn.query(`DELETE FROM user_badges WHERE badge_id > 6`);
    await conn.query(`DELETE FROM badges WHERE id > 6`);
    try {
      await conn.query(`ALTER TABLE users MODIFY COLUMN last_active_date DATETIME NULL`);
    } catch (_) {
      // ignore if column doesn't exist yet or cannot be modified on first boot
    }
    // Allow squads to have NULL leader (for empty squads)
    try {
      await conn.query(`ALTER TABLE squads MODIFY COLUMN created_by INT NULL`);
      await conn.query(`ALTER TABLE squads DROP FOREIGN KEY squads_ibfk_1`);
      await conn.query(`ALTER TABLE squads ADD CONSTRAINT squads_ibfk_1 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL`);
    } catch (_) {
      // ignore if already updated
    }
  } catch (e) {
    // Table might not exist yet on first boot, ignore
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const raw = fs.readFileSync(schemaPath, 'utf8');

    // Split on semicolons, skip empty lines and DB-level commands
    const statements = raw
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .filter(s => !s.match(/^--/))                          // skip comment-only lines
      .filter(s => !s.match(/^CREATE DATABASE/i))            // already done
      .filter(s => !s.match(/^USE\s/i));                     // already selected

    for (const stmt of statements) {
      try {
        await conn.query(stmt);
      } catch (err) {
        // Ignore "already exists" errors for seed data
        if (!err.message.includes('Duplicate entry')) {
          console.warn(`  ⚠ Skipped: ${err.message.slice(0, 80)}`);
        }
      }
    }

    console.log('✓ Schema applied');
  }

  await conn.end();
  console.log('✅ Database initialization complete!');
}

if (require.main === module) {
  initDb().catch(err => {
    console.error('❌ Init failed:', err.message);
    process.exit(1);
  });
}

// Export pool for use in index.js
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
