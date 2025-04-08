const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  username: String,
  assessmentTitle: String,
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
