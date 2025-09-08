const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const formController = require("../controllers/formController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

router.use(authenticateAdmin);
//protected routes

router.get("/", formController.getForms);
router.get("/:id", adminController.getAdminById);
//router.put("/:id", formController.putForm); // Admin can update a specific form


module.exports = router;