const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resumeSchema = new Schema(
  {
    imgsrc: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    skills: {
      type: Object,
      required: false,
    },
    experience: {
      type: Object,
      required: false,
    },
    college: {
      type: Object,
      required: false,
    },
    twelth: {
      type: Object,
      required: false,
    },
    tenth: {
      type: Object,
      required: false,
    },
    links: {
      type: Object,
      required: false,
    },
    user: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
  },
  { strict: false }
);

module.exports = Resume = mongoose.model("Resume", resumeSchema);
