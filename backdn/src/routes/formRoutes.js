const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

router.get("/", authenticateAdmin , formController.getForms);
router.post("/", formController.createForm);
router.put("/:id", authenticateAdmin, formController.putForm);

module.exports = router;