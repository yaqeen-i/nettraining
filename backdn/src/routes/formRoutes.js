const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

router.post("/", formController.createForm);

router.use(authenticateAdmin);
//protected routes
router.get("/", formController.getForms);
router.put("/:id", formController.putForm);
router.post("/import", formController.importForms);
router.delete("/:id", formController.deleteForm);

module.exports = router;