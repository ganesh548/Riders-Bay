require('dotenv').config();

var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy = require("passport-local");
var methodOverride=require("method-override");
var flash=require("connect-flash");
var Ride=require("./models/ride");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB= require("./seeds");

var ridesroutes=require("./routes/rides");
var commentsroutes=require("./routes/comments");
var authroutes=require("./routes/index");


mongoose.connect("mongodb://localhost/riders_bay");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
//seedDB();

app.use(require("express-session")({
    secret:"i want to explore the world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

app.use(authroutes);
app.use(ridesroutes);
app.use(commentsroutes);



app.listen(3000, function(){
	console.log("riders bay has started working");
})
