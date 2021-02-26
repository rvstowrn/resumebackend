// INITIALIZATION

const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db ="mongodb+srv://rishabh:cse300531@cluster0-amnhk.mongodb.net/resumestorage?retryWrites=true&w=majority";
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/static", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// DB CONNECTION

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Mongodb connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// Routes

app.use("/api", require("./routes/api/user"));
app.use("/api", require("./routes/api/resume"));
app.use("/", require("./routes/renders/web"));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});