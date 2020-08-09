var mongoose=require("mongoose");

var bookSchema=new mongoose.Schema({
    user:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username:String
    },
    rides:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Ride"
            }
    },
    contact:Number,
    email:String,
    bookingDate:Date
})

module.exports=mongoose.model("Book", bookSchema);