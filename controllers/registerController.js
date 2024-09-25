require('dotenv').config();

const UserModel = require("../public/models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function register_get(req, res) {
  res.render("register");
}

async function register_post(req, res) {
  const { name, email, password } = req.body;
  const user = await UserModel.findOne({ email: email });

  if(user) {
    res.render("register", { msgType: "Error", message: "A user already exists with this email" });
  } else {
    try {
      const newUser = new UserModel({
        name: name,
        email: email,
        //encrypt the password here before saving to database
        password: password,
        accessType: "editor",
        blogList: []
      });

      let savedUser = await newUser.save();
      res.redirect("/login")
    } catch(err) {
      console.log("THERE WAS AN ERROR SAVING THE USER!!!!!!!");
      console.log(err);
    }
  }
}

module.exports = { register_get, register_post };