const jwt = require("jsonwebtoken");

// authenticate admin using JWT
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // i attach admin ID to request object
    next();
  } catch (err) {
    console.error("Error in authenticateAdmin:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}