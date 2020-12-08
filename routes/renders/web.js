const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const auth_handler = require("../../auth/handle_auth");
const Resume = require("../../models/resume_model");
const User = require("../../models/user_model");

// Web Front End
router.get("/", function (req, res) {
  res.render(`home`);
});

// Login
router.get("/login", function (req, res) {
  res.render(`login`);
});

// Register
router.get("/register", function (req, res) {
  res.render(`register`);
});

// Profile Page
router.get("/profile", function (req, res) {
  const token = req.cookies.token;
  const authstatus = auth_handler(token);
  if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });
  const user = authstatus["decoded"]["user"]["id"];
  Resume.findOne({ user }).then((resume)=>{
    res.render(`profile`,{data:authstatus["decoded"]["user"],link:`https://portfolio-v0.herokuapp.com/p/${resume.user}`});
  }).catch((e)=>{
    res.render(`profile`,{data:authstatus["decoded"]["user"],link:"null"});
  })
});

// Create Resume
router.get("/create_resume", function (req, res) {
  const token = req.cookies.token;
  const authstatus = auth_handler(token);
  if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });
  res.render(`create_resume`);
});

// Edit Resume
router.get("/edit_resume", async function (req, res) {
  const token = req.cookies.token;
  const authstatus = auth_handler(token);
  if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });
  const resume = await Resume.findOne({user:authstatus['decoded']['user']['id']})
  res.render(`edit_resume`,{data:resume});
});

router.get("/p/:id", async (req, res) => {
  let id = req.params.id;
  let templateid = 2;

  let resume = await Resume.findOne({ user: id });
  if (resume) {
    let buff = Buffer.from(resume.imgsrc, "base64");
    let imagename = uuidv4();
    Object.assign(resume, { imagename });
    fs.writeFileSync(`uploads/${imagename}.jpg`, buff);
    res.render(`template${templateid}`, { data: resume });
  } else res.send("<h1>404 bro</h1>");
});

// Delete all data
router.get("/reset", async (req, res) => {
  try {
    await User.deleteMany({});
    await Resume.deleteMany({});
    res.send("<h1>All Clear</h1>");
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

module.exports = router;
