function notFound(req, res, next) {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("ERROR:", err.message);

  res.status(500).json({
    error: "Internal Server Error"
  });
}

module.exports = { notFound, errorHandler };
