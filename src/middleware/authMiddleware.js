const { tryCatch } = require("../utils/tryCatch");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();

const authenticateToken = tryCatch(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Convert jwt.verify to promise
  const user = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  req.user = user;
  next();
});

module.exports = authenticateToken;
