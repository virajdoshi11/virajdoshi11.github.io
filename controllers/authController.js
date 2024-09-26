require('dotenv').config();

const UserModel = require("../public/models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

function checkToken(req) {
  const token = req.cookies.jwtToken;
  if (!token) {
    return false
  }
  return true;
}

function login_get(req, res) {
  console.log("We are rendering login page")
  if(checkToken(req)) {
    return res.redirect("/blogs")
  }
  res.render('login');
}

async function login_post(req, res) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  console.log(user);

  if(user) {
    // if(user.password == password) {
    //   console.log("The passwords were not encrypted");
    //   const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
    //   res.cookie('jwtToken', token, { httpOnly: true });
    //   res.redirect('/blogs/create');
    // } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if(err) {
        console.log("Error comparing the passwords:", err);
        res.render('login', { msgType: "Error", message: err, reqType: "self" })
      } else if(result) {
        console.log('Passwords match! User authenticated.', result);
        const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
        // const authHeader = new Headers();
        // authHeader.append('Authorization', `Bearer ${token}`)
        
        res.cookie('jwtToken', token, { httpOnly: true });
        // res.set('Authorization', `Bearer ${token}`)
        // res.json({ msgType: "Success", message: "Login Successful, you can now create blogs" })
        res.redirect('/blogs/create');
      } else {  
        console.log("Passwords don't match");
        res.status(401).render("login", { msgType: "Error", message: 'Invalid credentials', reqType: "self" })
      }
    });
    // }
  }

  // if(user) {
  //   const token = jwt.sign({ userId: user._id }, secretKey);
  //   res.status(200).json({ message: "Success", token: token })
  // }
  else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return;
}

//Middleware to Authenticate Requests
function authenticateToken(req, res, next) {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  const token = req.cookies.jwtToken;
  console.log("This is the token", token)
  if (!token) {
    console.log("redirecting to the login page because you are not signed in")
    return res.status(401).redirect("/login")
    //{ msgType: "Error", message: 'Unauthorized', reqType: "other" }
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).redirect('/login');
      // { msgType: "Error", message: 'Invalid token', reqType: "other" }
    }
    if (user.user.accessType != "admin" && user.user.accessType != "editor") {
      // console.log("This is the accces type of the user: ", user.user.accessType)
      return res.status(401).json({ msgType: "Error", message: "You are not authorized to perform this request" });
    }
    req.user = user;
    next();
  });
}

module.exports = { login_get, login_post, authenticateToken };