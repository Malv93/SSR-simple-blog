const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const aboutContent =
  'Simple blog made with node.js, express, ejs and mongodb as a Server Side Rendered App. The front end is connected to a mongodb database. At the home page "/" all posts are fetched. Each post can be fetched sngularly at "/posts/postTitle". At "/compose" new posts can be added to the database through a form post.';

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("home", { posts });
  } catch (err) {
    console.log(err);
  }
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
    });

    await post.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/:postId", async (req, res) => {
  try {
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({ _id: requestedPostId });

    res.render("post", post);
  } catch (err) {}
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
