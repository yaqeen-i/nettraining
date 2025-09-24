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
/* there should be an endpoint and also an interface where the student can upload the required documents
  should be implemented where the documents can be stored in a cloud storage like AWS S3 
 */
module.exports = router;