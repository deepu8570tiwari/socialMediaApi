// middleware/authenticateToken.js
const { tryCatch } = require("../utils/tryCatch");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authenticateToken = tryCatch(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // ✅ Attach the decoded user payload to the request
  req.user = decoded; // example: { id: '652d3b5f...', iat: ..., exp: ... }
  next();
});

module.exports = authenticateToken;
