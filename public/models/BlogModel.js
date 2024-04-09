const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  blogTitle: {
    type: String,
    required: true
  },
  blogDes: {
    type: String,
    required: true
  },
  blogContent: {
    type: String,
    required: true
  },
  tags: [String],
  date: {
    type: Date,
    default: Date.now()
  }
})