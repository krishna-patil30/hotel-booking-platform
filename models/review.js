const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating :{
        type : Number,
        min:1,
        max:5,
    },

    createdAt:{
        type: Date,
        default:Date.now(),
    },
author: {
    type: Scheme.Types.ObjectId,
    ref: "User",
}
});

module.exports = mongoose.model("Review", reviewSchema);