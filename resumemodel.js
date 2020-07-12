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
      type: Object,
      required: true
    },
    experience: {
      type: Object,
      required: true
    },
    college: {
      type: Object,
      required: true
    },
    twelth: {
      type: Object,
      required: true
    },
    tenth: {
      type: Object,
      required: true
    },
    links: {
      type: Object,
      required: true
    },
  },
  { strict: true }
);

module.exports = Resume = mongoose.model("Resume", resumeSchema);