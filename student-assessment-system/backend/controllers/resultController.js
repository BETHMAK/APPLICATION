const Result = require("../models/Result");

// Submit a result
exports.submitResult = async (req, res) => {
  const { assessment, student, score } = req.body;

  try {
    // Create a new result
    const result = new Result({ assessment, student, score });
    await result.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Submit result error:", err);
    res.status(500).json({ message: "Failed to submit result" });
  }
};

// Get results for a student
exports.getResultsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch all results for the student and populate the assessment field
    const results = await Result.find({ student: studentId }).populate("assessment", "title");
    res.json(results);
  } catch (err) {
    console.error("Fetch results error:", err);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};