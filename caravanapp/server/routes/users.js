const express = require("express");
const router = express.Router();
const container = require("../core/bootstrap");
const UserService = container.resolve("userService");

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const result = await UserService.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const result = await UserService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
});

module.exports = router;
