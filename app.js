const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");
const meRouter = require("./routes/me.routes");
const adminRouter = require("./routes/admin.routes");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

/**
 * ======================
 * CORS CONFIG (Express 5 SAFE)
 * ======================
 * Must be BEFORE routes
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://shiny-peony-cca72d.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Express 5 SAFE preflight handler (DO NOT use "*")
app.options("/", cors());

app.use(express.json());

/**
 * Request logger (dev friendly)
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

/**
 * Routes
 */
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);

/**
 * Error handlers (must be last)
 */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
