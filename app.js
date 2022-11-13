const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const User = require("./models/user");
const ObjectId = require('mongodb').ObjectId;
const alert = require('alert');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));
app.set('view-engine', 'ejs');

mongoose.connect("mongodb+srv://Li:258369AA@atdl.nxqeadw.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

app.use(session({
  secret: "Li is an idiot",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", signedIn, function(req, res) {
  res.render("index.ejs");
});

app.get("/guest", function(req, res) {
  res.render("guest.ejs");
});

app.get("/signup", function(req, res) {
  res.render("signup.ejs");
});

app.post('/signup', function(req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("signup.ejs");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/signin");
    });
  });
});

app.get("/signin", function(req, res) {
  res.render("signin.ejs");
});

app.post('/signin', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin"
}), function(req, res) {});

app.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function signedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

// app.get("/users", function(req, res) {
//   res.render("users.ejs", {
//     username: "Bruce",
//     password: 111111
//   });
// });

app.get("/admin", function(req, res) {
  res.render("admin.ejs");
});

app.post("/admin", function(req, res) {
  if (req.body.code == 666666) {
    res.render("test.ejs");
  } else {
    res.redirect('/admin');
  }
});


// CRUD api

app.get('/guys', async function(req, res) {
  const guys = await User.find({});

  try {
    res.send(guys);
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete user account
app.post('/guys', function(req, res) {
  User.findByIdAndDelete(req.body.userID, function(err, docs) {
    if (err) {
      console.log(err)
    } else {
      console.log("Deleted : ", docs);
    }
  });
  res.render("test.ejs");
});

// show creation time
app.post('/times', function(req, res) {
    alert(ObjectId(req.body.userID).getTimestamp().toLocaleDateString() + " " + ObjectId(req.body.userID).getTimestamp().toLocaleTimeString());
    res.render("test.ejs");
});


app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000.");
});
