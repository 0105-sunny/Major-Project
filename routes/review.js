const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js") // S12 async wrap function for error handling
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const listingController = require("../controllers/reviews.js")

//* pashe 2 part a
//*Review route
//post Review route


router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(listingController.createReview));

  // Delete Review route
router.delete(
    "/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync( listingController.destroyReview));

module.exports = router;