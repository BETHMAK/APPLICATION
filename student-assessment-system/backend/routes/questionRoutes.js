const express = require("express");
const router = express.Router();
const Question = require("../models/Question"); 

// 📌 Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// 📌 Add a new question
router.post("/", async (req, res) => {
  try {
    const { questionText, correctAnswer } = req.body;
    
    if (!questionText || !correctAnswer) {
      return res.status(400).json({ message: "Both question and correct answer are required." });
    }

    const newQuestion = new Question({ questionText, correctAnswer });
    await newQuestion.save();
    
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add question" });
  }
});

// 📌 Delete a question by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question" });
  }
});

// 📌 Add an answer to a question
router.post("/:id/answer", async (req, res) => {
  try {
    const { answer } = req.body;
    
    if (!answer) {
      return res.status(400).json({ message: "Answer is required." });
    }

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.correctAnswer = answer;
    await question.save();

    res.json(question);
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Failed to add answer" });
  }
});

module.exports = router;
