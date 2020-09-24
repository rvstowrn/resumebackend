const express = require("express");
const router = express.Router();
const Resume = require("../../models/resume_model");
const auth_handler = require("../../auth/handle_auth");

// Store Web Portfolio Data
router.post("/store_resume", async (req, res) => {
  try {
    // Check Auth
    const token = req.body["x-auth-token"];
    const authstatus = auth_handler(token);
    if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });

    let oldResume = await Resume.findOne({
      user: authstatus["decoded"]["user"]["id"],
    });
    if (oldResume) {
      return res.json({ msg: "Resume for this user already exists" });
    }

    let {
      image,
      about,
      skills,
      experience,
      twelth,
      tenth,
      college,
      templateid,
      links,
    } = req.body;

    let resume = new Resume({
      imgsrc: image,
      about: about,
      skills: skills,
      experience: experience,

      college: college,
      twelth: twelth,
      tenth: tenth,

      links: links,
      user: authstatus["decoded"]["user"]["id"],
      name: authstatus["decoded"]["user"]["name"],
    });

    await resume.save();
    res.json({
      msg: "success",
      sitelink: `https://portfolio-v0.herokuapp.com/p/${resume.user}`,
    });
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

router.post("/edit_resume", async (req, res) => {
  try {
    // Check Auth
    const token = req.body["x-auth-token"];
    const authstatus = auth_handler(token);
    if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });

    let oldResume = await Resume.findOne({
      user: authstatus["decoded"]["user"]["id"],
    });
    if (!oldResume) {
      return res.json({ msg: "Resume doesn't exists" });
    }

    let findUser = authstatus["decoded"]["user"]["id"];

    let {
      image,
      about,
      skills,
      experience,
      twelth,
      tenth,
      college,
      templateid,
      links,
    } = req.body;

    let resume = {
      imgsrc: image,
      about: about,
      skills: skills,
      experience: experience,

      college: college,
      twelth: twelth,
      tenth: tenth,

      links: links,
      user: authstatus["decoded"]["user"]["id"],
      name: authstatus["decoded"]["user"]["name"],
    };

    await Resume.findOneAndUpdate({ user: findUser }, resume);
    res.json({
      msg: "success",
      sitelink: `https://portfolio-v0.herokuapp.com/p/${resume.user}`,
    });
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

router.post("/get_resume", async (req, res) => {
  try {
    // Check Auth
    const token = req.body["x-auth-token"];
    const authstatus = auth_handler(token);
    if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });

    let oldResume = await Resume.findOne({
      user: authstatus["decoded"]["user"]["id"],
    });
    if (oldResume) {
      let obj = oldResume.toObject();
      delete obj.imgsrc;
      return res.json({ obj });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

router.post("/delete_resume", async (req, res) => {
  try {
    // Check Auth
    const token = req.body["x-auth-token"];
    const authstatus = auth_handler(token);
    if (authstatus["msg"] !== "success") res.json({ msg: authstatus["msg"] });
    await Resume.findOneAndDelete({
      user: authstatus["decoded"]["user"]["id"],
    });
    return res.json({ msg: "success" });
  } catch (err) {
    console.error(err.message);
    res.json({ msg: "server error" });
  }
});

module.exports = router;
