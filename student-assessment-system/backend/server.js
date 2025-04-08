const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
try {
  const userRoutes = require("./routes/userRoutes");
  console.log("✅ Successfully loaded userRoutes.js");
  app.use("/api/users", userRoutes);
} catch (error) {
  console.error("❌ Error loading userRoutes.js:", error);
}
try {
  const assessmentRoutes = require("./routes/assessmentRoutes");
  console.log("✅ Successfully loaded assessmentRoutes.js");
  app.use("/api/assessments", assessmentRoutes);
} catch (error) {
  console.error("❌ Error loading assessmentRoutes.js:", error);
}


try {
  const questionRoutes = require("./routes/questionRoutes");
  console.log("✅ Successfully loaded questionRoutes.js");
  app.use("/api/questions", questionRoutes);
} catch (error) {
  console.error("❌ Error loading questionRoutes.js:", error);
}


try {
  const resultRoutes = require("./routes/resultRoutes");
  console.log("✅ Successfully loaded resultRoutes.js");
  app.use("/api/results", resultRoutes);
} catch (error) {
  console.error("❌ Error loading resultRoutes.js:", error);
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
