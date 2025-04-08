const Assessment = require("../models/Assessment");
const Submission = require("../models/Submission");

// Create a new assessment
exports.createAssessment = async (req, res) => {
  const { title, description, questions, createdBy } = req.body;

  console.log("Received data:", req.body);

  if (!title || !description || !questions || questions.length === 0) {
    return res.status(400).json({ message: "Title, description, and questions are required." });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "At least one question is required." });
  }

  for (let i = 0; i < questions.length; i++) {
    if (!questions[i].questionText?.trim() || !questions[i].correctAnswer?.trim()) {
      return res.status(400).json({ message: `All questions must have text and a correct answer.` });
    }
  }

  try {
    const assessment = new Assessment({ title, description, questions, createdBy });
    await assessment.save();
    res.status(201).json(assessment);
  } catch (err) {
    console.error("Create assessment error:", err);
    res.status(500).json({ message: "Failed to create assessment" });
  }
};

// Delete an assessment by ID
exports.deleteAssessment = async (req, res) => {
  const { id } = req.params;

  try {
    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assessment:", err);
    res.status(500).json({ message: "Failed to delete assessment" });
  }
};

// Get all assessments (excluding correct answers)
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().select("-questions.correctAnswer");
    res.json(assessments);
  } catch (err) {
    console.error("Error fetching assessments:", err);
    res.status(500).json({ message: "Failed to fetch assessments" });
  }
};

// Get a single assessment by ID
exports.getAssessmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assessment = await Assessment.findById(id).populate("createdBy", "username");
    if (assessment) {
      res.json(assessment);
    } else {
      res.status(404).json({ message: "Assessment not found" });
    }
  } catch (err) {
    console.error("Fetch assessment error:", err);
    res.status(500).json({ message: "Failed to fetch assessment" });
  }
};

// Student submits answers and gets graded
exports.submitAssessment = async (req, res) => {
  const { assessmentId, answers, username } = req.body;

  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    let correctCount = 0;

    assessment.questions.forEach((q, index) => {
      const correctAnswer = q.correctAnswer?.trim().toLowerCase();
      const studentAnswer = (answers[index] || "").trim().toLowerCase();
      if (correctAnswer === studentAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / assessment.questions.length) * 100);

    const submission = new Submission({
      username,
      assessmentTitle: assessment.title,
      score,
    });

    await submission.save();

    res.json({ username, score });
  } catch (err) {
    console.error("Error submitting assessment:", err);
    res.status(500).json({ message: "Failed to submit assessment" });
  }
};

// Get all submissions for the teacher dashboard
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 }); // newest first
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
