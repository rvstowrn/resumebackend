
// INITIALIZATION

const path           = require('path');
const fs             = require('fs');
const { v4: uuidv4 } = require('uuid');
const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser')
const mongoose       = require("mongoose");
const jwt            = require("jsonwebtoken");
const bcrypt         = require("bcryptjs");
const resume         = require('./resumemodel.js');
const user           = require('./usermodel.js');
const authHandler    = require('./handleAuth.js');
const db             = "mongodb+srv://rishabh:cse300531@cluster0-amnhk.mongodb.net/resumestorage?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({limit:"50mb", extended: true }))
app.use(bodyParser.json({limit:"50mb"}));
app.use('/static', express.static(path.join(__dirname, 'uploads')))
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


// Web Front End
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'front.html'));
})


// Create Users
app.post('/storeuser',async (req, res) => {
  let { name,username,password } = req.body;

  let user = new User({ name,username,password });
  let oldUser = await User.findOne({ username });
  if (oldUser) {
    return res
      .status(200)
      .json({ "msg": "User already exists" });
  }
  user.save().then(()=>{
    const payload = {
      user: {
        id:username, 
        name:name, 
        type: "customer"
      }
    };
    jwt.sign(
      payload,
      'DC46D6C4BC9E7BD52C3B0135B6C424FD0C8218E1EC54E0FD1BBB713FA5B20A7B',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        var msg='success';
        res.json({ msg,token });
      }
    );
  });
});




// Store Web Portfolio Data
app.post('/storeresume',async (req, res, next) => {
  
  console.log(req.body);
  res.json({"msg":"api touched"});
  // // Future : Check if sending uri and recieving with multer works for images

  // Check Auth
  const token = req.header["x-auth-token"];
  const authstatus = authHandler(token); 
  if(authstatus["msg"]!=='success')
    res.json({"msg":authstatus["msg"]})

  let buff = Buffer.from(req.body.image, 'base64');
  let imgsrc = uuidv4();
  fs.writeFileSync(`uploads/${imgsrc}.jpg`, buff);
  
  let { 
    about,
    skills,
    exps,
    twelth,
    tenth,
    college,
    templateid,
    links } = req.body;

  let resume = new Resume(
    { 
      imgsrc:     imgsrc,
      about:      about,
      skills:     skills,
      experience: exps,
      
      college:    college,
      twelth:     twelth,
      tenth:      tenth,
  
      links:      links,
      user:       authstatus["decoded"]["id"], 
      name:       authstatus["decoded"]["name"] 
    });

    // resume future features 
    // siteparam:
    // templateid:template,
      
    
    resume.save().then(()=>{
      res.json({"msg":'success','sitelink':`https://portfolio-v0.herokuapp.com/${resume.user}`});
    });
});


app.get('/:id', async (req, res)=> {
  let id = req.params.id;
  let templateid = 1;
  let resume = {
      imgsrc:      "scooty",
      about:       "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      skills:      {"c":"beginner","c++":"average","java":"average"},
      experience:  {"intern":"gmetri react","freelance":"srs commodities flutter"},
      
      college:     {"name":"srmist","year":"2021","degree":"btech cse","marks":"85.07"},
      twelth:      {"name":"dav","year":"2017","board":"cbse","marks":"78.4"},
      tenth:       {"name":"don bosco","year":"2015","board":"icse","marks":"87.83"},
  
      links:       {"github":"https://google.com","facebook":"https://google.com","linkedin":"https://google.com"},
      user:        "rvstowrn", 
      name:        "Rishabh Verma"
  };
  // await Resume.findOne({ "user":id });
  if(resume)
    res.render(`template${templateid}`, {data:resume});
  else
    res.send('404 bro');
});

app.listen(process.env.PORT || 3333);