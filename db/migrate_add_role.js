require("dotenv").config();
const pool = require("./index");

async function migrate() {
  await pool.query(`
    ALTER TABLE auth_users
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
  `);

  console.log("✅ Migration complete: role column added to auth_users");
  await pool.end();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
