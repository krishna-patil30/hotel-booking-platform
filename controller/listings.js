const Listing = require("../models/listing.js");//data
const axios = require("axios");//map

//index
module.exports.index = async (req, res) => {
    const AllListing = await Listing.find({});
    res.render("listings/index", { AllListing });
};

//newlisting
module.exports.renderNewForm = (req, res) => {
 res.render("listings/newListing");
};
//showlisting
module.exports.showListing =async(req,res)=>{
let{id}=req.params;
const listing = await Listing.findById(id)
.populate({
    path:"review",
        populate:{
        path:"author"
        }
   })
    .populate("owner");

if (!listing) {
    req.flash("error", "Listing you request for does not exist!");
    return res.redirect("/listing");
}
res.render("listings/show", { listing });

}
//cretelisting
module.exports.creteListing =async (req, res,next) => {
   let url= req.file.path;
   let filename= req.file.filename;

const newListing = new Listing(req.body.listing);

 //-----Map Geoapify Geocoding-----//
    const location = req.body.listing.location;

    const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
            params: {
                text: location,
                apiKey: process.env.GEOAPIFY_KEY,
                limit: 1
            }
        }
    );//---------------map--------------------------//


    if (response.data.features.length > 0) {

        newListing.geometry =
            response.data.features[0].geometry;

    }
newListing.owner = req.user._id;
newListing.image={url,filename};
await newListing.save();
req.flash("success","New Listing Created!");
 res.redirect("/listings");
}
//edit
module.exports.renderEditForm =async (req, res) => {
let { id } = req.params;
let listing = await Listing.findById(id);
if(!listing){
 req.flash("error", "editListing you request for does not exist!");
    return res.redirect("/listing");
}

 let originalImageUrl = listing.image.url;
 originalImageUrl = originalImageUrl.replace("/uploads","/uploads/h_300,w_250");
    res.render("listings/edit", { listing , originalImageUrl});
}

//update
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
   let listing=  await Listing.findByIdAndUpdate(id, {...req.body.listing});
 
   if(typeof req.file !== "undefined"){
    
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success","Listing update!");
    res.redirect(`/listings/${id}`);
}
//delete
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing delete!");
    res.redirect("/listings");
}
