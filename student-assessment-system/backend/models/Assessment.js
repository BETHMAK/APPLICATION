const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  correctAnswer: { type: String, required: true },
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
