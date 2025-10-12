// middleware/authorizeAdmin.js
// Prevents an admin from accessing or deleting another admin's account

module.exports = function authorizeAdmin(paramName = "id") {
  return (req, res, next) => {
    const loggedInAdmin = req.user;
    const targetId = req.params[paramName];

    if (!loggedInAdmin) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // allow only self-access 
    if (String(loggedInAdmin.id) !== String(targetId)) {
      return res.status(403).json({ error: "Forbidden: cannot access another admin's data" });
    }

    next();
  };
};
