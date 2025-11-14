
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") // S12 async wrap function for error handling
const Listing = require("../models/listing.js"); // step 2
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require("multer"); // its package used for to read the multipart form data
const {storage} = require("../cloudConfig.js");
const { listingSchema } = require("../schema.js");
const upload = multer({ storage }); // this will save the files(images) in uploads folder

//cmbine routes at "/" 
router
  .route("/")
  // Index Route
  .get( wrapAsync(listingController.index))
  
   //S5 part 2 Create route (we will post the information which is added in the newlisting form)
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync( listingController.createNewListing));

// new form route for adding new listing 
router.get("/new",isLoggedIn, (listingController.renderNewForm));

// combine route at "/:id"
router
  .route("/:id")
   // Show route in side crud we call as read op
  .get(wrapAsync (listingController.showListing))
   // update route
  .put(
    isLoggedIn, 
    isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing)) 

    //S 6 Delete route
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync( listingController.destroyListing));

//S5 part 3 edit route (editing the existing form);
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));

module.exports = router;