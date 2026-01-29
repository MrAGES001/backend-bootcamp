require("dotenv").config();
const pool = require("./index");

async function test() {
  const result = await pool.query("SELECT NOW() as now;");
  console.log("✅ DB connected. Server time:", result.rows[0].now);
  await pool.end();
}

test().catch((err) => {
  console.error("❌ DB test failed (full error):");
  console.error(err); // prints full error object
  process.exit(1);
});
