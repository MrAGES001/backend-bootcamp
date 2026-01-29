const express = require("express");
const pool = require("../db");

const router = express.Router();


// GET all users
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id ASC"
    );

    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});


// GET user by id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});


// CREATE user
router.post("/", async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [name, email]
    );

    res.status(201).json({
      message: "User created",
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    next(err);
  }
});


// UPDATE user
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at",
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated",
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    next(err);
  }
});

// DELETE user
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email, created_at",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted",
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
