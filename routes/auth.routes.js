const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const crypto = require("crypto");
const { authLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/auth");
const { requireAuth } = require("../middleware/auth");





const router = express.Router();

// SIGNUP
router.post("/signup", authLimiter, async (req, res, next) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email, and password are required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO auth_users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role, created_at",
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "Signup successful",
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    next(err);
  }
});

router.post("/login", authLimiter, async (req, res, next) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, name, email, role, password_hash FROM auth_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // short-lived access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // long-lived refresh token (random)
    const refreshToken = crypto.randomBytes(48).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, refreshToken, expiresAt]
    );

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
});
router.post("/refresh", authLimiter, async (req, res, next) => {

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    const result = await pool.query(
      "SELECT rt.token, rt.expires_at, au.id, au.email, au.role FROM refresh_tokens rt JOIN auth_users au ON au.id = rt.user_id WHERE rt.token = $1",
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const row = result.rows[0];

    if (new Date(row.expires_at) < new Date()) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    const accessToken = jwt.sign(
      { userId: row.id, email: row.email, role: row.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});
router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken]);

    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});
router.put("/password", requireAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "oldPassword and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "newPassword must be at least 8 characters" });
    }

    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT password_hash FROM auth_users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const ok = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE auth_users SET password_hash = $1 WHERE id = $2",
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});
// CHANGE PASSWORD (protected)
router.put("/password", requireAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: "oldPassword and newPassword are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "newPassword must be at least 8 characters"
      });
    }

    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT password_hash FROM auth_users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const ok = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE auth_users SET password_hash = $1 WHERE id = $2",
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
