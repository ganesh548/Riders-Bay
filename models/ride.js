var mongoose=require("mongoose");

var ridesSchema=new mongoose.Schema({
    name:String,
    image:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    days:Number,
    startDate:Date,
    rideType:String,
    genderType:String,
    kms:Number,
    location:String,
    lat:Number,
    lng:Number
});

module.exports=mongoose.model("Ride", ridesSchema);