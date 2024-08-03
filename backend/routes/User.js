const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/middle");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: existingUser._id, username }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({ id: existingUser._id, token });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

router.get("/user", middleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;
