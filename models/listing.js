const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title hona zaroori hai!"],
  },
  description: {
    type: String,
    required: [true, "Description hona zaroori hai!"],
  },
  image: {
   url:String,
   filename:String,
  },
  price:Number,
  location:String,
  country: String,

  review:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],

owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
}
,

geometry: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
    },
    coordinates: {
        type: [Number],
        default: [],
    },
},



  });



//post middleware
  listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
    }
  
  });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

  /*price: {
    type: Number,
    required: [true, "Price daalna zaroori hai!"],
    min: [0, "Price kabhi minus (-) mein nahi ho sakti!"],
  },
  location: {
    type: String,
    required: [true, "Location hona zaroori hai!"],
  },
  country: {
    type: String,
    required: [true, "Country hona zaroori hai!"],
  },
*/

