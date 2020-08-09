var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport=require("passport");

router.get('/',function(req, res){
    res.render("home");
})

router.get('/register', function(req, res){
   res.render("register");
})
router.post('/register', function(req, res){
   var newUser=new User({username:req.body.username});
   User.register(newUser, req.body.password, function(err, user ){
       if(err)
       {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/rides");
       })
   })
});

router.get("/login", function(req, res){

   res.render("login");
});

router.post("/login", passport.authenticate("local", {
   successRedirect:"/rides",
   failureRedirect:"/login"
}), function(req, res){
   res.flash("success", "logged in");
});


//========
//logout
//======

router.get('/logout', function(req, res){
   req.logout();
   req.flash("success","Logged you out ");
   res.redirect("/rides");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated())
   {
       return next();
   }
   res.redirect("/login");
}

module.exports=router;