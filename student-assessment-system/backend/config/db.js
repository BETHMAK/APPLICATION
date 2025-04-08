const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from the .env file
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use new URL parser
      useUnifiedTopology: true, // Use new server discovery and monitoring engine
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;