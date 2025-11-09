const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const listingController = require("../controllers/users.js")

//combine route for signup at "/signup"
router.route("/signup")
// signup form route
.get(listingController.renderSignupForm)
// signup route
.post((listingController.signup));


//combine route for login at "/login"
router.route("/login")
// login form route
.get(listingController.renderLoginForm)
// login route
.post(saveRedirectUrl,
    passport.authenticate("local", 
    { failureRedirect: `/login`, 
    failureFlash: true,
  }), (listingController.login));

//logout route
router.get("/logout", (listingController.logout));

module.exports = router;