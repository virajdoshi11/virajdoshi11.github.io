const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { marked } = require("marked");
const slugify = require("slugify");

const blogModelSchema = new Schema({
  blogTitle: {
    type: String,
    required: true
  },
  // dupBlogTitle: {
  //   type: String,
  // },
  blogDes: {
    type: String,
    required: true
  },
  blogContent: {
    type: String,
    required: true
  },
  // author: {
  //   type: String,
  //   required: true
  // },
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

// blogModelSchema.pre("save", (next) => {
//   console.log("This is the title:", this);
//   if(this.blogTitle) {
//     this.slug = slugify(this.blogTitle, {
//       lower: true,
//       strict: true
//     })
//   }

//   // this.blogContent = marked(this.blogContent)

//   next()
// })

//regular functions inherit the context(`this` keyword) from the document being validated/saved.
//On the other hand since the blog is not actually in this context, arrow functions
//won't be able to get the context(`this` keyword).
//Maybe arrow functions and regular functions are not same
blogModelSchema.pre("validate", function preValidateMiddleware (next) {

  if(this.dupBlogTitle) {
    this.slug = slugify(this.dupBlogTitle, {
      lower: true,
      strict: true
    })
  } else if(this.blogTitle) {
    this.slug = slugify(this.blogTitle + "-" + this._id, {
      lower: true,
      strict: true
    })
  }

  this.blogContent = marked.parse(this.blogContent)
  next()
});

// const BlogModel = mongoose.model("BlogModel", blogModelSchema)

module.exports = mongoose.model("BlogModel", blogModelSchema)