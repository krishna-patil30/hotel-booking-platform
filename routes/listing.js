const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js"); //err
const ExpressError = require("../utils/ExpressError.js"); //err
const { listingSchema} = require("../schema.js"); //schemavalidation
const Listing = require("../models/listing.js");//data
const { isLoggedIn ,isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


//listing and create post  common router
router
.route("/")
.get( WrapAsync( listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,WrapAsync(listingController.creteListing));


//new listing
router.get("/new",isLoggedIn,(listingController.renderNewForm ));

//show details and put update and delete common router
router
.route("/:id")
.get(WrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,WrapAsync(listingController.updateListing ))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.destroyListing ));

//edit form router
router.get("/:id/edit",isLoggedIn ,isOwner ,WrapAsync(listingController.renderEditForm  ));



module.exports = router;




