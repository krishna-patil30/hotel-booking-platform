const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReviews=async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);   // agar schema me reviews hai
    await newReview.save();
    await listing.save();
    req.flash("success","New Review create !");
    res.redirect(`/listings/${listing._id}`);
    //console.log("new review saved")
    //res.send("new review saved")
}

module.exports.destroyReviews=async (req, res) => {
    let { id, reviewId } = req.params;
    // Listing के review array से review की ObjectId हटाओ
    await Listing.findByIdAndUpdate(id, {$pull: { review: reviewId }
    });
    // Review document delete करो
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    // वापस listing page पर जाओ
    res.redirect(`/listings/${id}`);
}


