const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModelSchema = new Schema({
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
  }
});

module.exports = mongoose.model("UserModel", userModelSchema)