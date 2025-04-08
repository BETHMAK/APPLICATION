const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const Result = require("../models/Result");

// Submit answers
router.post("/api/submit-answers", async (req, res) => {
  try {
    const { studentId, assessmentId, answers } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ error: "Assessment not found" });

    let score = 0;
    const totalQuestions = assessment.questions.length;

    assessment.questions.forEach((q) => {
      if (answers[q._id] && answers[q._id] === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    // Store result
    const result = new Result({
      studentId,
      assessmentId,
      assessmentTitle: assessment.title,
      score: percentage,
    });

    await result.save();

    res.json({ message: "Assessment submitted!", score: percentage });
  } catch (err) {
    res.status(500).json({ error: "Error submitting assessment" });
  }
});

// Get student results
router.get("/api/results/:studentId", async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

module.exports = router;
