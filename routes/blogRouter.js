require('dotenv').config();

const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const slugify = require("slugify");
const mongoose = require("mongoose");

const BlogModel = require("../public/models/BlogModel");
const { authenticateToken } = require("../controllers/authController")

const articles = [
  {
    blogTitle: "Demo title one",
    blogDes: "This blog is a demo blog just to see if everything works",
    blogContent: "This is the content of the demo blog",
    tags: ["Fiction", "Fantasy", "Comedy", "Action"],
    date: new Date()
  },
  {
    blogTitle: "Why white people can talk to anyone",
    blogDes: "This article discusses why white people can talk to anyone and how good their social skills are",
    blogContent: "loren ipsum",
    tags: ["Documentary", "vlog", "social"],
    date: new Date()
  }
];

router.get("/", async (req, res) => {
  //get all the articles from db
  const allBlogs = await BlogModel.find({})

  const token = req.cookies.jwtToken;
  let isUser = false;
  if(!token) {
    isUser = false;
    console.log("THERE IS NO TOKEN!!")
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        isUser = false;
        console.log("THERE WAS AN ERROR WITH THE TOKEN!!")
      } else {
        isUser = true;
        console.log("THERE IS A TOKEN!!", isUser)
      }
    });
  }
  res.render("blogs", {allBlogs: allBlogs, user: isUser});
});

router.get("/create", authenticateToken, (req, res) => {
  console.log("This is the req.user variable:")
  console.log(req.user);
  
  if(req.user.user.accessType == "admin") {
    console.log("Admin access, you can create a blog");
    return res.render('createBlog');
  } else {
    return res.send("You are not authorized to create a new blog. Please message me on +1 8628001675 to get access");
  }
});

router.get("/:slug", async (req, res) => {
  //find the blog with this id and send that variable
  const blog = await BlogModel.findOne({ slug: req.params.slug });

  // const id = new mongoose.Types.ObjectId(req.params.id)
  // const blog = await BlogModel.findById(id)
  if(blog) {
    res.render("showBlog", {blog: blog});
  } else {
    res.redirect("/");
  }
});

router.post("/create", authenticateToken, async (req, res) => {
  const title = req.body.blogTitle.toString();
  const des = req.body.blogDes.toString();
  let dupBlogTitle;

  if(title.length > 255 || des.length > 400) {
    res.send({ status: "Error", msg: "title & description should be less than 255 & 400 character count respectively" })
  }
  
  // const dupSlug = await BlogModel.findOne({ blogTitle: title });
  // // console.log(dupSlug._id, dupSlug.blogTitle, dupSlug.slug);
  // if(dupSlug) {
  //   dupBlogTitle = title + " " + dupSlug._id;
  //   console.log(dupBlogTitle);
  // }

  try {
    const newBlog = new BlogModel({
      blogTitle: title,
      author: req.user.user.name,
      // dupBlogTitle: dupBlogTitle,
      blogDes: des,
      blogContent: req.body.blogContent,
      tags: req.body.tags || [],
      // author: req.body.author,
      date: Date.now()
    });

    let savedBlog = await newBlog.save();
    // res.render("showBlog", {blog: savedBlog})
    res.redirect(savedBlog.slug);
  } catch (err) {
    console.log("There was an error while saving the blog");
    console.log(err);
  }
})

module.exports = router;