const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const formController = require("../controllers/formController");

router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/", formController.getForms); // Admin can view all forms
router.get("/:id", adminController.getAdminById); 
//router.put("/:id", formController.putForm); // Admin can update a specific form


module.exports = router;