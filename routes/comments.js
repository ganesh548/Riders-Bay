var express=require("express");
var router=express.Router();
var Ride=require("../models/ride");
var Comment=require("../models/comment");
var middleware=require("../middleware");

router.post("/rides/show/:id/comments", middleware.isLoggedIn, function(req, res){
    Ride.findById(req.params.id, function(err, rides){
        if(err)
        {
            console.log(err);
        }
        else
        {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }
                else
                {
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    rides.comments.push(comment);
                    rides.save()
                    res.redirect('/rides/' + rides._id)
                }
            })
        }
    })
})

router.delete('/rides/show/:id/comments/:commentId', middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/rides/" + req.params.id);
        }
    })
})






module.exports=router;