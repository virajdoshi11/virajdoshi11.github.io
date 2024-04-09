//TODO:
//https://web.dev/learn/pwa/installation-prompt/
//show which browser and platform (win, macos) they are using
//Complete projects page
//Upload it to page.cloudfare.com (only static websites allowed)
//Make page transitions
//Add "fun pages" which would be the pages with games/simulations, etc
//Make a blog

//Perfect SEO - https://bloxylibrary.glitch.me/
//The above website appears first in the google search, just search bloxylibrary

const express = require("express");
const nodemailer = require('nodemailer');
const cors = require("cors");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json());
app.use(cors({origin:'*'}))
app.set("view engine", "ejs")

//http to https redirects
app.enable('trust proxy');
app.use((req,res,next) => {
  if(req.secure) next()
  else res.redirect('https://'+req.host+req.url)
})

let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'virajdoshi11@gmail.com',
    pass: "" + process.env.GMAIL_APP_PASS
  }
});

app.get("/netflix", (req, res) => {
  res.sendFile(__dirname + "/public/html/netflixIntro.html")
})

app.get("/forms", (req, res) => {
  res.sendFile(__dirname + "/public/html/forms.html");
});

app.get("/", (req, res) => {
  console.log("This is the client IP: ", req.headers['sec-ch-ua']);
  res.sendFile(__dirname + "/index.html");
});

app.get("/projects", (req, res) => {
  res.sendFile(__dirname + "/public/html/projects.html");
});

app.get("/blogs", (req, res) => {
  res.sendFile(__dirname + "/public/html/blogs.html");
});

app.get("/ads", (req, res) => {
  res.sendFile(__dirname + "/public/html/googleads.html");
});

app.get('/VirajDoshiResume.html', (req, res) => {
  const file = `${__dirname}/public/VirajDoshiResume.html`;
  res.download(file); // Set disposition and send it.
});

app.post("/", (req, res) => {
  let email = req.body.emailVal;
  let name = req.body.nameVal;
  let msg = req.body.msgVal;
  
  function validateEmail(email) {
    
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }
  
  if(email == undefined || email == "undefined") {
    return res.json({ status: "undefined" });
  }
  
  if(!validateEmail(email)) {
    return res.json({ status: "emailError" });
  }
  
  let mailDetails = {
    from: 'virajdoshi11@gmail.com',
    to: 'virajdoshi11@gmail.com',
    subject: 'SOMEONE LOOKED OUR WEBSITE',
    text: 'From: ' + name + ", " + email + "\n" + msg
  };
  
  mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) { console.log(err); }
    else { console.log('Email sent successfully'); }
  });
  
  res.json({status: "ok"});
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/public/html/test.html");
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/"));

// app.get('*', function(req, res){
//   res.redirect("https://" + req.headers.host + req.path);
// });

app.get('*', function(req, res){
  res.sendFile(__dirname + "/public/html/404Page.html")
});

app.listen(PORT, () => {
  console.log("Server started on port: " + PORT)
})

// let mailDetails2 = {
//   from: "virajdoshi11@gmail.com",
//   to: 'senderEmail@gmail.com',
//   subject: 'Thanks for checking my Website',
//   text: "Hello, \n Thank you for checking my website and showing an interest\
//         in my work. I'll try to reach back to you ASAP."
// }
 
// mailTransporter.sendMail(mailDetails2, function(err, data) {
//   if(err) { console.log('Error Occurs'); }
//   else { console.log('Email sent successfully'); }
// });