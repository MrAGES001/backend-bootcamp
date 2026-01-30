const express = require("express");
const cors = require("cors");


const usersRouter = require("./routes/users.routes");
const authRouter = require("./routes/auth.routes");
const meRouter = require("./routes/me.routes");
const adminRouter = require("./routes/admin.routes");


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
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);



// error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
