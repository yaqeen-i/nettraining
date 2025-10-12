const jwt = require("jsonwebtoken");

// authenticate admin using JWT
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contains { id } from loginAdmin
    req.user = { id: decoded.id }; // could also store decoded.role later
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(401).json({ error: msg });
  }
};

module.exports = { authenticateAdmin };
