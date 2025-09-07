const express = require("express");
const router = express.Router();
const referenceDataController = require("../controllers/referenceDataController");
// backdn/src/routes/referenceData.js

router.get("/regions", referenceDataController.getRegions);
router.get("/areas", referenceDataController.getAreas);
router.get("/institutes", referenceDataController.getInstitutes);
router.get("/professions", referenceDataController.getProfessions);


module.exports = router;