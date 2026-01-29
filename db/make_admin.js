require("dotenv").config();
const pool = require("./index");

async function makeAdmin() {
  const email = "john.auth@test.com";

  const result = await pool.query(
    "UPDATE auth_users SET role = 'admin' WHERE email = $1 RETURNING id, email, role",
    [email]
  );

  if (result.rows.length === 0) {
    console.log("❌ No user found with that email.");
  } else {
    console.log("✅ User promoted to admin:", result.rows[0]);
  }

  await pool.end();
}

makeAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
