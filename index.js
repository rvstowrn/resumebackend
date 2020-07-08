
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
  
  // Future : Check if sending uri and recieving with multer works for images

  // Check Auth
  const token = req.header["x-auth-token"];
  const authstatus = authHandler(token); 
  if(authstatus["msg"]!=='success')
    res.json({"msg":authstatus["msg"]})

  let buff = Buffer.from(req.body.image, 'base64');
  let imgsrc = uuidv4();
  fs.writeFileSync(`${imgsrc}.jpg`, buff);
  
  let { about,
        skillname,skilldesc,
        expname,expdesc,
        tenthname,tenthaddr,tenthmarks,
        twelthname,twelthaddr,twelthmarks,
        collegename,collegeaddr,collegemarks,
        links } = req.body;

  let resume = new Resume(
    { 
      details:         about,
      
      allskills:       skillname,
      skilldetails:    skilldesc,  
      
      experience:      expname,
      expdetails:      expdesc,
      
      college:         collegename,
      collegeaddress:  collegeaddr,
      collegepercent:  collegemarks,
      
      twelth:          twelthname,
      twelthaddress:   twelthaddr,
      twelthpercent:   twelthmarks,
      
      tenth:           tenthname,
      tenthaddress:    tenthaddr,
      tenthpercent:    tenthmarks,

      anchors: links,
      imgsrc:imgsrc,
      user:authstatus["decoded"]["id"] 

    });

    // resume future features 
    // siteparam:
    // templateid:template,
      
    
    resume.save().then(()=>{
      res.json({"msg":'success'});
    });
});


app.get('/:id', async (req, res)=> {
  let id = req.params.id;
  let resume = await Resume.findOne({ "user":id });
  if(resume)
    res.render('template1', {data:resume});
  else
    res.send('404 bro');
});

app.listen(process.env.PORT || 3333);