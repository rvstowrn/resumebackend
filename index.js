// INITIALIZATION

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Resume = require('./resumemodel.js');
const User = require('./usermodel.js');
const authHandler = require('./handleAuth.js');
const db = "mongodb+srv://rishabh:cse300531@cluster0-amnhk.mongodb.net/resumestorage?retryWrites=true&w=majority";
const jwtSecret = "DC46D6C4BC9E7BD52C3B0135B6C424FD0C8218E1EC54E0FD1BBB713FA5B20A7B";

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(bodyParser.json({ limit: "50mb" }));
app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');




// DB CONNECTION

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Mongodb connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();




// ROUTES

// Delete all data
app.get("/reset", async (req, res) => {
  try {
    await User.deleteMany({});
    await Resume.deleteMany({});
    res.send("<h1>All Clear</h1>");
    } catch (err) {
    console.error(err.message);
    res.json({msg:"server error"})
  }
});

// Web Front End
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'front.html'));
})

// Register User
app.post("/registerUser", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    let oldUser = await User.findOne({ username });
    if (oldUser) {
      return res.json({ msg: "User already exists" });
    }
    let salt = await bcrypt.genSalt(10)
    let encryptPassword = await bcrypt.hash(password, salt);
    let user = new User({ name, username, password: encryptPassword });
    await user.save();
    return res.json({ "msg": "successfull" });
  } catch (err) {
    console.error(err.message);
    res.json({msg:"server error"})
  }
});

// Login User
app.post("/loginUser", async (req, res) => {
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
        type: "customer"
      }
    };
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res.json({ msg: "success", token:token, name:user.name });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.json({msg:"server error"})
  }
});


// Store Web Portfolio Data
app.post('/storeresume', async (req, res) => {
  if(req.body.ping){
    return res.json({"msg":"success"});
  }

  try {

    // Check Auth
    const token = req.body["x-auth-token"];
    const authstatus = authHandler(token);
    if (authstatus["msg"] !== 'success')
      res.json({ "msg": authstatus["msg"] })

    let oldResume = await Resume.findOne({ user: authstatus["decoded"]["user"]["id"] });
    if (oldResume) {
      return res.json({ "msg": "Resume for this user already exists" });
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
      links } = req.body;

    let resume = new Resume(
      {
        imgsrc: image,
        about: about,
        skills: skills,
        experience: experience,

        college: college,
        twelth: twelth,
        tenth: tenth,

        links: links,
        user: authstatus["decoded"]["user"]["id"],
        name: authstatus["decoded"]["user"]["name"]
      });

    await resume.save();
    res.json({ "msg": 'success', 'sitelink': `https://portfolio-v0.herokuapp.com/${resume.user}` });

  } catch (err) {
    console.error(err.message);
    res.json({msg:"server error"})
  }
});

app.get('/resumedata', async (req, res) => {
  try{
    let id = req.params.id;
    let resume = await Resume.findOne({ "user": id });
    let msg = "success";
    Object.assign(resume, { msg });
    res.json(resume);
  } 
  catch (err) {
    console.error(err.message);
    res.json({msg:"server error"})
  }
});

app.get('/:id', async (req, res) => {

  let id = req.params.id;
  let templateid = 1;

  let resume = await Resume.findOne({ "user": id });
  if (resume) {
    let buff = Buffer.from(resume.imgsrc, 'base64');
    let imagename = uuidv4();
    Object.assign(resume, { imagename });
    fs.writeFileSync(`uploads/${imagename}.jpg`, buff);
    res.render(`template${templateid}`, { data: resume });
  }
  else
    res.send('<h1>404 bro</h1>');
});

app.listen(process.env.PORT || 3333);