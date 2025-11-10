
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require ("./review.js");

// const listingSchema = new Schema ({
// title: {
//     type:String,
//     required:true,
// },

// description: {
//     type:String,
//     required:true,
// },
// image: String,
   
  
//   price:Number,
//   location:String,
//   country:String,
// });

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  // image:{

  // prior schema before cloudinary
    // url: {
    // type: String,
    // default: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    
    // // Optional: If user enters empty string, set to default
    // set: (v) =>
    //   v === "" 
    //     ? "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
    //     : v,

    //   required: [true, "Image URL is required"]
    // }

    // schema after cloudinary
  //   url
  // },
  image:{
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  location: {
    type: String,
    required: [true, "Location is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  },
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },


  // maping code or gecoding
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [77.1025, 28.7041] // default = Delhi (example)
  }
}

   
 },
);

// this is post mongoose middleware we are using it to delete all the reviews related to a list
listingSchema.post(`findOneAndDelete`, async (listing) => {
  if(listing) {
     await Review.deleteMany({_id : {$in: listing.reviews }});
  };
});

// Create model

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;