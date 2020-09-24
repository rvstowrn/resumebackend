const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/user_model");
const jwtSecret ="DC46D6C4BC9E7BD52C3B0135B6C424FD0C8218E1EC54E0FD1BBB713FA5B20A7B";

// Register User
router.post("/register_user", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    let oldUser = await User.findOne({ username });
    if (oldUser) {
      return res.json({ msg: "User already exists" });
    }
    let salt = await bcrypt.genSalt(10);
    let encryptPassword = await bcrypt.hash(password, salt);
    let user = new User({ name, username, password: encryptPassword });
    await user.save();
    return res.json({ msg: "success" });
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

// Login User
router.post("/login_user", async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "User doesn't exists" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.json({ msg: "Wrong Password" });
    }
    
    const payload = {
      user: {
        id: username,
        name: user.name,
        type: "customer",
        sitelink: "null"
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      return res.json({ msg: "success", token: token, name: user.name , sitelink:user.sitelink});
    });
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

module.exports = router;
