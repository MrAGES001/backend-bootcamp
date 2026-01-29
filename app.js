const express = require("express");

const usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");
const meRouter = require("./routes/me.routes");
const adminRouter = require("./routes/admin.routes");
const { cloudSetup } = require("./db/cloudSetup");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// health check
app.get("/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);

// TEMPORARY: run once then delete
app.get("/__setup", async (req, res) => {
  try {
    const message = await cloudSetup();
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Cloud DB setup failed",
      detail: err.message
    });
  }
});

// error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
