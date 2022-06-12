const express = require("express");
//const config = require("./config");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');




const mongoDb = process.env.MONGODB_URI || process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const authors_controller = require('./controllers/authorsController');
const posts_controller = require('./controllers/postsController');
const comments_controller = require('./controllers/commentsController')


const app = express();
app.use(helmet());

app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json());



app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.post('/sign-up', authors_controller.authors_create_post);

app.get('/posts', posts_controller.posts_list);
app.get('/posts/:postid', posts_controller.post_get)
app.post('/new-post', posts_controller.posts_create_post);

app.post('/:postid/new-comment', comments_controller.comments_create_post)



module.exports = app;