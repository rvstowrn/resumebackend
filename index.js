const path        = require('path');
const fs          = require('fs');
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser')
const mongoose    = require("mongoose");
const jwt         = require("jsonwebtoken");
const resume      = require('./resumemodel.js');
const user        = require('./usermodel.js');
const authHandler = require('./handleAuth.js');
const db          = "mongodb+srv://rishabh:cse300531@cluster0-amnhk.mongodb.net/resumestorage?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({limit:"50mb", extended: true }))
app.use(bodyParser.json({limit:"50mb"}));

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


var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });



app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname,'front.html'));
})

// app.post('/storeuser',async (req, res) => {
//   let { name,username,password } = req.body;
//   let user = new User({ name,username,password });
//   let oldUser = await User.findOne({ username });
//   if (oldUser) {
//     return res
//       .status(400)
//       .json({ msg: "User already exists" });
//   }
//   user.save().then(()=>{
//     const payload = {
//       user: {
//         id:username, 
//         name:name, 
//         type: "customer"
//       }
//     };
//     jwt.sign(
//       payload,
//       'DC46D6C4BC9E7BD52C3B0135B6C424FD0C8218E1EC54E0FD1BBB713FA5B20A7B',
//       { expiresIn: 360000 },
//       (err, token) => {
//         if (err) throw err;
//         var msg='success';
//         res.json({ msg,token });
//       }
//     );
//   });
// })

// app.post('/storeresume', upload.single('image'),async (req, res, next) => {
//   // check file precense
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//     // Check Auth
//     const token = req.body["x-auth-token"];
//     const authstatus = authHandler(token); 
//     if(authstatus["msg"]!=='success')
//       res.json({"msg":authstatus["msg"]})

//     let { about,skills,experience,college,twelth,tenth,links,template } = req.body;
//     let resume = new Resume({ about,skills,experience,college,twelth,tenth,links,template,
//       imgsrc:file.filename,username:authstatus["decoded"]["id"] });
    
//     resume.save().then(()=>{
//       res.json({"msg":'success'});
//     });
// });

app.post('/testimg',async (req, res) => {
  // check file precense
  // const file = req.file
  // if (!file) {
  //   const error = new Error('Please upload a file')
  //   error.httpStatusCode = 400
  //   return next(error)
  // }
  let buff = Buffer.from(req.body.image, 'base64');
  console.log(req.body["about"]);
  console.log(req.body["hell"]);

  fs.writeFileSync('upload1.jpg', buff);
  res.json({"msg":"api touched"})
});


// app.get('/:id', async (req, res)=> {
//   const id = req.params.id;
//   const resume = await User.findOne({ username });
// });

app.listen(process.env.PORT || 3333);