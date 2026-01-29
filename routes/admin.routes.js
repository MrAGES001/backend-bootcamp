const express = require("express");
const pool = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const userCount = await pool.query("SELECT COUNT(*)::int AS count FROM auth_users");
    const apiUsersCount = await pool.query("SELECT COUNT(*)::int AS count FROM users");

    res.json({
      auth_users: userCount.rows[0].count,
      users_table: apiUsersCount.rows[0].count
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
