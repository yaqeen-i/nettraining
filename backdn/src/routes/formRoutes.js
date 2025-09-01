const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

router.get("/", formController.getForms);
router.post("/", formController.createForm);
router.put("/:id", formController.putForm);

module.exports = router;