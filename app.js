if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


const users = []; //will be replaced with database.

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false
}));
app.set('view-engine', 'ejs');
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


// let sql;


//connect database
// const db = new sqlite3.Database("./users.db", sqlite3.OPEN_READWRITE, (err) => {
//   if (err) return console.error(err.message);
// });

// create table
// sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, username, password, email)';
// db.run(sql);

//drop table
// db.run("DROP TABLE users");

//insert data
// sql = 'INSERT INTO users(username, password, email) VALUES (?,?,?)'
// db.run(sql, ["Bruce Li", "123456", "liyinru2000@gmail.com"], (err)=>{
//   if (err) return console.error(err.message);
// });

//delete data
// sql = 'DELETE FROM users WHERE id=?';
// db.run(sql, [1], (err)=>{
//   if (err) return console.error(err.message);
// });

// query data
// sql = 'SELECT * FROM users';
// db.all(sql, [], (err, rows)=>{
//   if(err) return console.error(err.message);
//   rows.forEach(row=>{
//     console.log(row);
//   });
// });


//
// let mailTransporter = nodemailer.createTransport({
//   service:"gmail",
//   auth:{
//     user: "liyinru2000@gmail.com",
//     pass: "rlcozsjxwtviwxgx"
//   }
// });
//
// let details = {
//   from: "liyinru2000@gmail.com",
//   to: "y_li28@uncg.edu",
//   subject:"testing out nodemailer",
//   text:"You are smart and funny!"
// }
//
// mailTransporter.sendMail(details, (err)=>{
//   if(err){
//     console.log("it has an error", err);
//   }
//   else{
//     console.log("email has been sent")
//   }
// })



app.get("/", checkAuthenticated, function(req, res) {
  res.render("index.ejs");
});

app.get("/guest", function(req, res) {
  res.render("guest.ejs");
});

app.get("/signup", function(req, res) {
  res.render("signup.ejs");
});

app.post('/signup', async function(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    });
    res.redirect('/signin');
  } catch {
    res.redirect('/signup');
  }
  console.log(users);
});

app.get("/signin", function(req, res) {
  res.render("signin.ejs");
});

app.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash: true
}));

app.get("/users", function(req, res) {
  res.render("users.ejs", {username: "Bruce", password: 111111});
});

app.get("/admin", function(req, res) {
  res.render("admin.ejs");
});

app.post("/admin", function(req, res) {
  if (req.body.code == 123456) {
    res.redirect("/users");
  } else{
    res.redirect('/admin');
  }
});

app.get("/test", function(req, res){
  res.render("test.ejs", {
    listTitle: "User Accounts",
    newItem: users
  });
});

app.delete('/logout', (req, res) => {
  req.logOut(function() {
    res.redirect('/signin')
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

app.listen(process.env.POST || 3000, function(req, res) {
  console.log("Server is running on port 3000.");
});
