const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes');
const app = express();
const {reqauth, checkuser}=require('./middleware/authmiddleware');

// middleware
app.use(express.static('public'));

//middleware for reading inputs
app.use(express.urlencoded({extended:true}));

// view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
// database connection
const dbURI='mongodb+srv://akash_lenka:password_password@cluster0.xsfca.mongodb.net/smoothie?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {app.listen(3000);
  console.log("Connected to the client");
  })
  .catch((err) => {console.log(err)
  console.log("Unable to Connect");});

// routes
app.get("*",checkuser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',reqauth,(req, res) => res.render('smoothies'));
app.use(authRoutes);
app.use((req,res)=>res.render('404'));