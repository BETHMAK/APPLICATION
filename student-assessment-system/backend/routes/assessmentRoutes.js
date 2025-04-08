// routes/assessmentRoutes.js
const express = require("express");
const router = express.Router();

const assessmentController = require("../controllers/assessmentController"); // ✅ check this path

router.get("/", assessmentController.getAssessments);
router.post("/", assessmentController.createAssessment);
router.post("/submit", assessmentController.submitAssessment);
router.get("/submissions", assessmentController.getSubmissions); // ✅ make sure this function exists
router.get("/:id", assessmentController.getAssessmentById);
router.delete("/:id", assessmentController.deleteAssessment);

module.exports = router;
