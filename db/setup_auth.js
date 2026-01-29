require("dotenv").config();
const pool = require("./index");

async function setupAuth() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ Auth table setup complete (auth_users ready)");
  await pool.end();
}

setupAuth().catch((err) => {
  console.error("❌ Auth setup failed:", err);
  process.exit(1);
});
