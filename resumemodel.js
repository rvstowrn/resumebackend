const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resumeSchema = new Schema(
  {
    imgsrc: {
      type: String,
      required: true
    },
    about: {
      type: String,
      required: true
    },
    skills: {
      type: Array,
      required: true
    },
    experience: {
      type: Array,
      required: true
    },
    college: {
      type: String,
      required: true
    },
    twelth: {
      type: String,
      required: true
    },
    tenth: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      required: true
    },
  },
  { strict: true }
);

module.exports = Resume = mongoose.model("Resume", resumeSchema);