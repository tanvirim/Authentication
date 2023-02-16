// Import dependencies
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
// const encryption = require("mongoose-encryption")
const md5 = require('md5');

// Set up express app
const app = express();

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB database using Mongoose

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

 
  const signupSchema = new mongoose.Schema({
    username: {
        type: String
      },
      password: {
        type: String
        }
    })
  ;

  //model encryption

// const secret = process.env.SECRET ;

// signupSchema.plugin(encryption, {secret:secret ,encryptedFields: ['password']})



//making collection
const User = mongoose.model('User', signupSchema);


  //home route
app.route("/")
.get((req,res)=>{
  res.render("home")
})



// register route
app
.route("/register")

.get((req,res)=>{
  res.render("register") 
})

.post((req,res)=>{
  const userData01 = new User(
    { username: req.body.username,
     password: md5(req.body.password)
   }) 
  userData01.save((err)=>{
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  })
}) ;

//log-in route
app
.route("/login")

.get((req,res)=>{
  res.render("login") 
})

.post((req,res)=>{
  User.findOne({username: req.body.username},(err,foundUser)=>{
    if(err){
      console.log(err);
    }else{
      if(foundUser.password === md5(req.body.password)){
        res.render("secrets")
      }else(
        res.send("not matching password")
      )
    }
  })
}) 


// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
