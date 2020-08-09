var middlewareObj ={};
var Ride=require("../models/ride");
var Comment=require("../models/comment");

middlewareObj.checkOwnerShip=function(req, res, next){
        if(req.isAuthenticated()){
            Ride.findById(req.params.id, function(err, foundRides){
                if(err)
                {
                    res.redirect("back");
                }
                else
                {
                    if(foundRides.author.id.equals(req.user._id))
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error", "This ride does not belong to you");
                        res.redirect("back");
                    }
                    
                }
            })
        }
        else
        {
            req.flash("error", "please login");
            res.redirect("/login");
        }
    };
middlewareObj.checkCommentOwnerShip=function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, foundComments){
                if(err)
                {
                    res.redirect("back");
                }
                else
                {
                    if(foundComments.author.id.equals(req.user._id))
                    {
                        next();
                    }
                    else
                    {
                        res.redirect("back");
                    }
                    
                }
            })
        }
        else
        {
            req.flash("error", "You can't delete this comment");
            res.redirect("/login");
        }
    }
middlewareObj.isLoggedIn=function(req, res, next){
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }

module.exports=middlewareObj;