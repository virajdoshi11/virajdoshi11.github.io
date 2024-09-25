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
require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const blogRouter = require("./routes/blogRouter");
const authRouter = require("./routes/authRoutes")

const app = express();
const PORT = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
//   next();
// });

// in data visualization, and statistical models and data mining tools.

app.use(express.json());
app.use(cors({origin:'*'}))
app.set("view engine", "ejs");
// app.use(express.urlencoded({ extentded: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/blogs", blogRouter);
app.use("/login", authRouter)

//http to https redirects
// app.enable('trust proxy');
// app.use((req,res,next) => {
//   if(req.secure) next()
//   else res.redirect('https://'+req.host+req.url)
// })

async function connectMongo() {
  const uri = "mongodb+srv://virajdoshi11:" + process.env.MONGODB_PASS + "@blog.yhp88d1.mongodb.net/blogs?retryWrites=true&w=majority&appName=Blog";
  console.log(uri)
  try {
    await mongoose.connect(uri)
    .then(() => {
      console.log('Connected to MongoDB');
    });
  } catch (err) {
    console.log("There was an error")
    console.log(err)
  }
}

connectMongo()

let mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'virajdoshi11@gmail.com',
    pass: "" + process.env.GMAIL_APP_PASS
  }
});

app.get("/star", (req, res) => {
  res.sendFile(__dirname + "/public/html/star.html")
})

app.get("/netflix", (req, res) => {
  res.sendFile(__dirname + "/public/html/netflixIntro.html")
})

app.get("/forms", (req, res) => {
  res.sendFile(__dirname + "/public/html/forms.html");
});

app.get("/", (req, res) => {
  // console.log("This is the client IP: ", req.headers['sec-ch-ua']);
  res.sendFile(__dirname + "/index.html");
});

app.get("/projects", (req, res) => {
  res.sendFile(__dirname + "/public/html/projects.html");
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

// To run node application in the background (i.e even after closing the terminal)
/** Systemd
 * Run the below command: 
 * - sudo vim /etc/systemd/system/myapp.service
 * 
 * Paste the below code in the vim editor:
 * [Unit]
 * Description=Viraj Doshi Portfolio App
 * After=network.target multi-user.target
 * 
 * [Service]
 * user=ubuntu
 * WorkingDirectory=/home/ubuntu/portfolio
 * ExecStart=/usr/bin/npm start
 * Restart=always
 * StandardOutput=syslog
 * StandardError=syslog
 * SyslogIdentifier=viraj_doshi_portfolio_app_log
 * 
 * [Install]
 * WantedBy=multi-user.target
 * 
 * Then run the following 3 commands in the terminal
 * - sudo systemctl daemon-reload
 * - sudo systemctl enable myapp.service
 * - sudo systemctl start myapp.service
 * 
 * Now, you should see your code in the terminal with the command:
 * - curl localhost:5000
 * 
 * Refresh the website and it should be running the website without running the npm start command
 * If you update/change the code just update the file in your instance and then run the command
 * - sudo systemctl restart myapp.service
 * 
 * Now to setup a reverse proxy (to access it over https rather than port 5000) install caddy
 * (also look for nginx reverse proxy)
 * Go to https://caddyserver.com/docs/install#debian-ubuntu-raspbian and copy the code under stable release
 * This will install caddy and then you can run:
 * - sudo systemctl start caddy
 * 
 * Now when you try running `curl localhost` it should give you the code for caddy homepage
 * Also look at it by removing the port number and refreshing the page in browser
 * 
 * Now we want to forward traffic to our application instead of caddy homepage.
 * To do this we want to edit the caddy file.
 * Run the command below:
 * - sudo vim /etc/caddy/Caddyfile
 * 
 * Here comment the line `root = /usr/share/caddy` and line with `file_server`
 * Uncomment the line `reverse_proxy localhost:8080` and change the port to the port you have your server running on
 * In this case change 8080 to 5000 and save it
 * 
 * now restart caddy with the command
 * - sudo systemctl restart caddy
 * 
 * Now you should be able to see your application on that ip address in browser without the '5000' port (i.e on "/")
 * (Be sure to remove the sutom tcp we added on the security group to remove access to port 5000)
 * 
 * Route 53 is DNS service offered by AWS
 * You have to buy a domain from a 3rd party domain provider and connect it to route 53
 * to start routing traffic to our services in aws
 */