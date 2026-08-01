const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview ,isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js")

//review create router
router.post("/", validateReview, WrapAsync(reviewController.createReviews ));
//review delete router
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, WrapAsync(reviewController.destroyReviews));
module.exports = router;

