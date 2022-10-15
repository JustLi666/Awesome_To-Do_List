const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// app.use(bodyParser.json());
app.use(express.static('public'));
// app.post('api/register', async(req, res)=>{
//   console.log(req.body);
//   res.json({status: 'ok'})
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

app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000.");
});
