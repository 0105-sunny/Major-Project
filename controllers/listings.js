const Listing  = require("../models/listing.js")


//this is index route
module.exports.index = async(req, res, next) => {
    const allListings = await Listing.find({}); // yaha par hamne S2listing file wale data ko route kiya hai
    res.render("./listings/index.ejs", {allListings});
};

// new form route
module.exports.renderNewForm = (req, res) => {   
    res.render("./listings/newListing.ejs");
};


//show route
module.exports.showListing = async(req, res)=> {
      let {id} = req.params;
      const listing = await Listing.findById(id)
        .populate({
           path:"reviews",
           populate: {
             path: "author",
           },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    res.render("./listings/show.ejs", {listing, showMap:true});
};


// // create route 
module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "new Listing created");
  res.redirect("/listings");
}


  // Edit form
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    let origImageUrl = listing.image.url;
    console.log(listing.image.usrl);
    let originalImageUrl = origImageUrl.replace("/upload", "/upload/h_200,w_350"); // here we reducing the quality of picture 
    res.render("./listings/edit.ejs", { listing, originalImageUrl})
};


//update route
module.exports.updateListing = async(req, res) => {
    
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete route
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params ;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing deleted");
    res.redirect(`/listings`);
};


// map code 

//map tiles
module.exports.mapTiles =  async (req, res) => {
  const { z, x, y } = req.params;
  const tileUrl = `https://api.maptiler.com/maps/streets/256/${z}/${x}/${y}.png?key=${MAPTILER_API_KEY}`;

  try {
    const r = await fetch(tileUrl);
    if (!r.ok) return res.status(r.status).send("Tile fetch error");
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=86400"); // cache 1 day
    r.body.pipe(res);
  } catch (err) {
    console.error("Tile proxy error:", err);
    res.status(500).send("Tile proxy error");
  }
};
