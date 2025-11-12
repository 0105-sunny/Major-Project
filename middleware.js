const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js")  //S12 ExpressError class for custom error
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js"); // phse 2 step2 

// step 2
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to crate new listing or make changes ");
        return res.redirect("/login");
    };
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
     let {id} = req.params;
    // await Listing.findByIdAndUpdate(id, {...req.body.listing});
    let listing  = await Listing.findById(id);

    // this path is to check that currUser is owner of listing or not 
    //basically this to protect the route from fake user 
    if(!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

//middleware for listing route
module.exports.validateListing = async (req, res, next) => {
    
    // await Listing.findByIdAndUpdate(id, {...req.body.listing});


   if (req.body.listing === undefined && req.body.title) {
    req.body.listing = { ...req.body };
     }
    let {error} = listingSchema.validate(req.body); // here it check the data coming to body is in correct format
    if (error) {  
    let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
       next(); 
    }
};

// // Middleware for validating listing data
// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body, { abortEarly: false });

//   if (error) {
//     // Convert Joi error details to readable message
//     const msg = error.details.map(el => el.message).join(", ");
//     console.log("❌ Listing Validation Error:", msg);
//     // Return a simple response or render error page
//     return res.status(400).send(`Validation Error: ${msg}`);
//   } else {
//     next(); // move to next middleware/controller
//   }
// };


module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    // Remove unexpected rating field if present
    if (req.body.rating) delete req.body.rating;

    let {error}= reviewSchema.validate(req.body); // here it check the data coming to body is in correct format
    if (error) {  
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
       next(); 
    }
};
//middleware for review route

module.exports.isReviewAuthor = async (req, res, next) => {
     let {reviewId, id} = req.params;
    // await Listing.findByIdAndUpdate(id, {...req.body.listing});
    let review = await Review.findById(reviewId);

    // this path is to check that currUser is owner of listing or not 
    //basically this to protect the route from fake user 
    if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the author of this  review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};



// module.exports.isLoggedInEdit = (req, res, next) => {
//     if(!req.isAuthenticated()){
//         req.flash("error", "you must be logged in to create New listing");
//         return res.redirect("/login");
//     };
//     next();
// };