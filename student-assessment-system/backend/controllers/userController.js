const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// Registration
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exits" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    // Exclude password from response
    res.status(201).json({ _id: user._id, username: user.username, role: user.role });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration faed" });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
