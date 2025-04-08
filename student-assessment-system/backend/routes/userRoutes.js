const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
console.log("User routes loaded");
// Register a new user
router.post("/register", userController.register);

// Login a user
router.post("/login", userController.login);

module.exports = router;