const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sqlite3 = require('sqlite3').verbose();

const app = express();


let sql;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

//connect database
const db = new sqlite3.Database("./users.db", sqlite3.OPEN_READWRITE, (err)=>{
  if (err) return console.error(err.message);
});

//create table
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

//query data
sql = 'SELECT * FROM users';
db.all(sql, [], (err, rows)=>{
  if(err) return console.error(err.message);
  rows.forEach(row=>{
    console.log(row);
  });
});


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

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/guest", function(req, res) {
  res.sendFile(__dirname + "/guest.html");
});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/signup/signup.html");
});

app.get("/signin", function(req, res) {
  res.sendFile(__dirname + "/signin/signin.html");
});

app.get("/users", function(req, res) {
  res.sendFile(__dirname + "/users.html");
});

app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000.");
});
