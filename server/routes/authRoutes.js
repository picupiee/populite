const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User model

// @route   POST /api/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find users by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Otorisasi Tidak Sah !" });
    }

    // Compare the plain text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Salah !" });
    }
    // If credentials valid, create a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "4H" }, // token expired in 4 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // send the token back to client
        console.log(
          `User : ${username} with token : ${token}valid for for 5 minutes.\nTimestamp : ` +
            new Date().toLocaleTimeString()
        );
      }
    );
  } catch (err) {
    console.error("Server-side error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
