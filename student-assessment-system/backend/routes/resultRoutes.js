const express = require("express");
const router = express.Router();
const Result = require("../models/Result");
const Question = require("../models/Question");

// Submit student answers and calculate score
router.post("/submit-answers", async (req, res) => {
  const { answers } = req.body;
  let correctAnswers = 0;
  let totalQuestions = 0;

  for (let questionId in answers) {
    const question = await Question.findById(questionId);
    if (question) {
      totalQuestions++;
      if (question.answer === answers[questionId]) {
        correctAnswers++;
      }
    }
  }

  const score = (correctAnswers / totalQuestions) * 100;
  const result = new Result({ student: req.user.id, score });
  await result.save();

  res.json({ message: "Answers submitted successfully!", score });
});

module.exports = router;
