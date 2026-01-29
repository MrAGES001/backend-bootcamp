require("dotenv").config();
const pool = require("./index");

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ refresh_tokens table ready");
  await pool.end();
}

setup().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
