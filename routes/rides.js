var express=require("express");
var router=express.Router();
var Ride=require("../models/ride");
var Book=require("../models/book")
var User=require("../models/user")
var middleware=require("../middleware");
var nodeGeocoder =require("node-geocoder");

var options={
    provider:'google',
    httpAdapter:'https',
    apiKey:process.env.GEOCODER_API_KEY,
    formatter:null
};

var geocoder=nodeGeocoder(options);
router.get('/rides', function(req, res){
	Ride.find({}, function(err, allRides){
        
        if(err)
        {
            
            console.log(err);
        }
        else
        {
            res.render("rides/rides",{rides:allRides, currentUser:req.user});
        }
    });
	
})

router.post('/rides', middleware.isLoggedIn, function(req, res){
    console.log(req.body.rides);
    geocoder.geocode(req.body.rides.location, function (err, data) {
        if(err)
        {
            console.log(err);
        }
        //var lat = data.results[0].geometry.location.lat;
       // var lng = data.results[0].geometry.location.lng;
        //var location = data.results[0].formatted_address;
        var lat=data[0].latitude;
        var lng=data[0].longitude;
        var location=data[0].formattedAddress;
        var newRides = {name: req.body.rides.name, image: req.body.rides.image,location: location, lat: lat, lng: lng,days: req.body.rides.days,startDate:req.body.rides.startDate,rideType:req.body.rides.rideType,genderType:req.body.rides.genderType,kms:req.body.rides.kms};
    Ride.create(newRides , function(err, newRides){
        if(err){
            console.log(err);
        }
        else
        {
            newRides.author.id=req.user._id;
            newRides.author.username=req.user.username;
            newRides.save();
            req.flash("success", "Hosted successfully");
            res.redirect("/rides");
        }
      });
    });
})

router.get('/rides/new', middleware.isLoggedIn, function(req, res){
    res.render("rides/new");
})

router.get('/rides/:id', function(req, res){
    Ride.findById(req.params.id).populate("comments").exec(function(err, findRides){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(findRides);
            res.render("rides/show", {rides:findRides});
        }
    })
});

router.get('/rides/:id/edit', middleware.checkOwnerShip, function(req, res){
    Ride.findById(req.params.id, function(err, foundRides){
        if(err)
        {
            res.redirect("/rides");
        }
        else
        {
            res.render("rides/edit", {rides: foundRides});
        }
    });
});

router.put('/rides/:id', middleware.checkOwnerShip, function(req, res){
    Ride.findByIdAndUpdate(req.params.id, req.body.rides, function(err, upgradedRides)
    {
        if(err)
        {
            res.redirect("/rides");
        }
        else
        {
            req.flash("success", "Edited Successfully");
            res.redirect('/rides/' + req.params.id);
        }
    })
});

router.delete('/rides/:id', middleware.checkOwnerShip, function(req, res){
    Ride.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            req.flash("success", "Deleted successfully");
            res.redirect("/rides");
        }
    });
})

router.get('/rides/:id/book', middleware.isLoggedIn, function(req, res){
    Ride.findById(req.params.id, function(err, foundRides){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("rides/book",{rides:foundRides});
        }
    })
})

router.post('/rides/:id/book', middleware.isLoggedIn, function(req, res){
    var newBook=req.body.rides;
    newBook.bookingDate=new Date();
    Book.create(newBook, function(err ,newBook){
        if(err){
            console.log(err)
        }
        else{
            newBook.user.id=req.user.id;
            newBook.user.username=req.user.username;
            newBook.save();
            res.redirect("/rides");
        }
    })
})

router.get('/rides/user/:id', middleware.isLoggedIn, function(req, res){
    var query={"author.id":req.params.id};
    var query1={"user.id":req.params.id};
    Ride.find(query, function(err, foundRides){
        if(err)
        {
            console.log(err);
        }
        else
        {
            Book.find(query1, function(err, foundBooks){
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render('rides/userData',{rides:foundRides,books:foundBooks})
                }
            })
        }
    })
})
 

module.exports = router;