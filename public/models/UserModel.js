const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accessType: {
    type: String,
    required: true
  },
  blogList: [String]
});

module.exports = mongoose.model("UserModel", userModelSchema)